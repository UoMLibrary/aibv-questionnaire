<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	type FieldItem = {
		id: string;
		label: string;
		description: string;
	};

	let fields: FieldItem[] = [
		{ id: 'developer', label: 'Primary Developer', description: 'Named responsible owner.' },
		{ id: 'backup', label: 'Backup Owner', description: 'Secondary contact if primary unavailable.' },
		{ id: 'prodUrl', label: 'Production URL', description: 'Live URL if Status = Production.' },
		{ id: 'repo', label: 'Version Control Link', description: 'Link to Git repository.' },
		{ id: 'healthcheck', label: 'Health Check Endpoint', description: 'Endpoint indicating system health.' },
		{ id: 'cronjob', label: 'Cronjob', description: 'Scheduled background tasks.' },
		{ id: 'status', label: 'Status', description: 'Development / UAT / Production / etc.' },
		{ id: 'techstack', label: 'Tech Stack', description: 'Primary technologies used.' },
		{ id: 'businessContact', label: 'Business Contact', description: 'Non-technical stakeholder contact.' },
		{ id: 'dependencies', label: 'Dependencies', description: 'Other systems relied upon.' }
	];

	let dragIndex: number | null = null;
	let draggingIndex: number | null = null;

    $: persist(fields);

    function persist(currentFields: typeof fields) {
        const existing = localStorage.getItem('lapcat-workshop');
        const parsed = existing ? JSON.parse(existing) : {};

        localStorage.setItem(
            'lapcat-workshop',
            JSON.stringify({
                ...parsed,
                minimumFieldOrder: currentFields
            })
        );
    }


	onMount(() => {
		const existing = localStorage.getItem('lapcat-workshop');
		if (existing) {
			const parsed = JSON.parse(existing);
			if (parsed.minimumFieldOrder) {
				fields = parsed.minimumFieldOrder;
			}
		}
	});

	function moveUp(index: number) {
		if (index === 0) return;
		const updated = [...fields];
		[updated[index - 1], updated[index]] =
			[updated[index], updated[index - 1]];
		fields = updated;
	}

	function moveDown(index: number) {
		if (index === fields.length - 1) return;
		const updated = [...fields];
		[updated[index + 1], updated[index]] =
			[updated[index], updated[index + 1]];
		fields = updated;
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

		const updated = [...fields];
		const [moved] = updated.splice(dragIndex, 1);
		updated.splice(index, 0, moved);

		fields = updated;
		dragIndex = null;
		draggingIndex = null;
	}

	function saveAndContinue() {
		const existing = localStorage.getItem('lapcat-workshop');
		const parsed = existing ? JSON.parse(existing) : {};

		localStorage.setItem(
			'lapcat-workshop',
			JSON.stringify({
				...parsed,
				minimumFieldOrder: fields
			})
		);

		goto('/4-risk');
	}
</script>

<div class="container">
	<header>
		<p class="step">Step 3 of 7</p>
		<h1>Minimum Operational Baseline</h1>
		<p class="subtitle">
			If Lapcat is the first place you look during an incident, rank the fields
			that must always be populated.
		</p>
		<p class="limit">Top 5 items are highlighted.</p>
	</header>

	<div class="card">
		{#each fields as field, index}
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
						<span>{field.label}</span>

						<div class="controls">
							<button on:click={() => moveUp(index)}>↑</button>
							<button on:click={() => moveDown(index)}>↓</button>
						</div>
					</div>

					<p>{field.description}</p>
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
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
			sans-serif;
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

	.actions {
		margin-top: 2rem;
		text-align: right;
	}

	.next {
		padding: 0.6rem 1.4rem;
		border-radius: 8px;
		border: none;
		background: #111;
		color: white;
		font-size: 0.9rem;
		cursor: pointer;
		transition: opacity 0.2s ease;
	}

	.next:hover {
		opacity: 0.85;
	}
</style>
