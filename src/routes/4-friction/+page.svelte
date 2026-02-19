<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	type FrictionItem = {
		id: string;
		label: string;
		description: string;
	};

	let frictionItems: FrictionItem[] = [
		{ id: 'time', label: 'Time Pressure', description: 'Operational work takes priority.' },
		{ id: 'ownership', label: 'Ownership Unclear', description: 'Responsibility is ambiguous.' },
		{ id: 'noReview', label: 'No Review Cycle', description: 'No scheduled validation process.' },
		{ id: 'notPriority', label: 'Not Seen as Priority', description: 'Documentation is secondary.' },
		{ id: 'hardToFind', label: 'Hard to Find', description: 'Records are not easily accessible.' },
		{ id: 'forgetting', label: 'Forgetting', description: 'Updates are missed due to workload.' },
		{ id: 'noTrigger', label: 'No Update Trigger', description: 'No reminder when systems change.' },
		{ id: 'tooling', label: 'Tooling Limitations', description: 'Interface/process friction.' }
	];

	let dragIndex: number | null = null;
	let draggingIndex: number | null = null;

	/* ---------------------------------------
	   Shuffle (Fisher–Yates)
	---------------------------------------- */

	function shuffle<T>(array: T[]): T[] {
		const arr = [...array];
		for (let i = arr.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
		return arr;
	}

	/* ---------------------------------------
	   Persistence
	---------------------------------------- */

	function persist(items: FrictionItem[]) {
		const existing = localStorage.getItem('lapcat-workshop');
		const parsed = existing ? JSON.parse(existing) : {};

		localStorage.setItem(
			'lapcat-workshop',
			JSON.stringify({
				...parsed,
				frictionOrder: items
			})
		);
	}

	/* ---------------------------------------
	   Initialisation
	---------------------------------------- */

	onMount(() => {
		const existing = localStorage.getItem('lapcat-workshop');

		if (existing) {
			const parsed = JSON.parse(existing);

			// If saved order exists, use it
			if (parsed.frictionOrder) {
				frictionItems = parsed.frictionOrder;
				return;
			}
		}

		// Otherwise randomise initial order
		frictionItems = shuffle(frictionItems);
		persist(frictionItems);
	});

	/* ---------------------------------------
	   Reordering
	---------------------------------------- */

	function moveUp(index: number) {
		if (index === 0) return;

		const updated = [...frictionItems];
		[updated[index - 1], updated[index]] =
			[updated[index], updated[index - 1]];

		frictionItems = updated;
		persist(frictionItems);
	}

	function moveDown(index: number) {
		if (index === frictionItems.length - 1) return;

		const updated = [...frictionItems];
		[updated[index + 1], updated[index]] =
			[updated[index], updated[index + 1]];

		frictionItems = updated;
		persist(frictionItems);
	}

	function handleDragStart(event: DragEvent, index: number) {
		dragIndex = index;
		draggingIndex = index;

		const target = event.currentTarget as HTMLElement;
		event.dataTransfer?.setDragImage(target, 12, 12);
	}

	function handleDragEnd() {
		dragIndex = null;
		draggingIndex = null;
	}

	function handleDrop(index: number) {
		if (dragIndex === null || dragIndex === index) return;

		const updated = [...frictionItems];
		const [moved] = updated.splice(dragIndex, 1);
		updated.splice(index, 0, moved);

		frictionItems = updated;
		dragIndex = null;
		draggingIndex = null;

		persist(frictionItems);
	}

	function saveAndContinue() {
		persist(frictionItems);
		goto('/5-lifecycle');
	}
</script>

<div class="container">
	<header>
		<p class="step">Step 4 of 7</p>
		<h1>Friction Prioritisation</h1>
		<p class="subtitle">
			Rank the factors that most realistically prevent Lapcat records being updated.
		</p>
		<p class="limit">Top 5 items are highlighted.</p>
	</header>

	<div class="card">
		{#each frictionItems as item, index}
			<div class="row">
				<div class="rank {index < 5 ? 'top' : ''}">
					{index + 1}
				</div>

				<div
					class="field {draggingIndex === index ? 'dragging' : ''}"
					draggable="true"
					on:dragstart={(e) => handleDragStart(e, index)}
					on:dragend={handleDragEnd}
					on:dragover|preventDefault
					on:drop={() => handleDrop(index)}
				>
					<div class="field-header">
						<span>{item.label}</span>

						<div class="controls">
							<button on:click={() => moveUp(index)}>↑</button>
							<button on:click={() => moveDown(index)}>↓</button>
						</div>
					</div>

					<p>{item.description}</p>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.container {
		max-width: 780px;
		margin: 4rem auto;
		padding: 0 1.5rem;
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
		color: #222;
	}

	header {
		margin-bottom: 2rem;
	}

	.step {
		font-size: 0.75rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #777;
		margin-bottom: 0.5rem;
	}

	h1 {
		font-size: 1.8rem;
		margin: 0 0 0.5rem 0;
	}

	.subtitle {
		color: #555;
		font-size: 0.95rem;
		margin-bottom: 0.5rem;
	}

	.limit {
		font-size: 0.8rem;
		color: #888;
	}

	.card {
		background: white;
		border-radius: 12px;
		padding: 1.75rem;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
		display: grid;
		gap: 0.9rem;
	}

	.row {
		display: grid;
		grid-template-columns: 40px 1fr;
		gap: 0.75rem;
		align-items: stretch;
	}

	.rank {
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 8px;
		background: #eee;
		font-weight: 600;
		color: #555;
	}

	.rank.top {
		background: #111;
		color: white;
	}

	.field {
		padding: 0.9rem 1rem;
		border: 1px solid #e3e3e3;
		border-radius: 10px;
		background: #fafafa;
		transition: all 0.15s ease;
		cursor: grab;
	}

	.field:active {
		cursor: grabbing;
	}

	.field.dragging {
		opacity: 0.6;
		transform: scale(0.98);
	}

	.field-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-weight: 500;
		margin-bottom: 0.3rem;
	}

	.field p {
		font-size: 0.8rem;
		color: #666;
		margin: 0;
	}

	.controls {
		display: flex;
		gap: 0.4rem;
	}

	.controls button {
		background: #eee;
		border: none;
		border-radius: 6px;
		padding: 0.2rem 0.5rem;
		cursor: pointer;
	}

	.controls button:hover {
		background: #ddd;
	}
</style>
