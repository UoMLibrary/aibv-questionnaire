<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	const MAX_SELECTION = 4;

	type FrictionKey =
		| 'time'
		| 'ownership'
		| 'noReview'
		| 'notPriority'
		| 'hardToFind'
		| 'forgetting'
		| 'noTrigger'
		| 'tooling';

	let selected: FrictionKey[] = [];
	let comment = '';

	const frictionOptions: {
		key: FrictionKey;
		label: string;
		description: string;
	}[] = [
		{
			key: 'time',
			label: 'Time Pressure',
			description: 'Operational work takes priority over documentation updates.'
		},
		{
			key: 'ownership',
			label: 'Ownership Unclear',
			description: 'It’s not always obvious who is responsible for keeping records updated.'
		},
		{
			key: 'noReview',
			label: 'No Review Cycle',
			description: 'There is no scheduled review process for records.'
		},
		{
			key: 'notPriority',
			label: 'Not Seen as Priority',
			description: 'Documentation is considered secondary to delivery work.'
		},
		{
			key: 'hardToFind',
			label: 'Hard to Find',
			description: 'Lapcat records are not always easy to locate or access.'
		},
		{
			key: 'forgetting',
			label: 'Forgetting',
			description: 'Updates are intended but missed due to workload or context switching.'
		},
		{
			key: 'noTrigger',
			label: 'No Update Trigger',
			description: 'There is no automatic reminder when systems change.'
		},
		{
			key: 'tooling',
			label: 'Tooling Limitations',
			description: 'The current interface or process makes updating harder than it should be.'
		}
	];

	onMount(() => {
		const existing = localStorage.getItem('lapcat-workshop');
		if (existing) {
			const parsed = JSON.parse(existing);
			if (parsed.friction) selected = parsed.friction;
			if (parsed.frictionComment) comment = parsed.frictionComment;
		}
	});

	function toggle(key: FrictionKey) {
		if (selected.includes(key)) {
			selected = selected.filter((k) => k !== key);
		} else if (selected.length < MAX_SELECTION) {
			selected = [...selected, key];
		}
	}

	function saveAndContinue() {
		const existing = localStorage.getItem('lapcat-workshop');
		const parsed = existing ? JSON.parse(existing) : {};

		localStorage.setItem(
			'lapcat-workshop',
			JSON.stringify({
				...parsed,
				friction: selected,
				frictionComment: comment
			})
		);

		goto('/5-lifecycle');
	}
</script>

<div class="container">
	<header>
		<p class="step">Step 4 of 7</p>
		<h1>Friction Analysis</h1>
		<p class="subtitle">
			What realistically stops Lapcat records being updated?
		</p>
		<p class="limit">Select up to {MAX_SELECTION} factors.</p>
	</header>

	<div class="card">
		{#each frictionOptions as option}
			<div
				class="field {selected.includes(option.key) ? 'selected' : ''}"
				on:click={() => toggle(option.key)}
			>
				<div class="field-header">
					<span>{option.label}</span>
					{#if selected.includes(option.key)}
						<span class="check">✓</span>
					{/if}
				</div>
				<p>{option.description}</p>
			</div>
		{/each}
	</div>

	<div class="card">
		<label class="comment-label">
			Additional context (optional)
			<textarea
				rows="3"
				bind:value={comment}
				placeholder="Anything we’ve missed?"
			/>
		</label>
	</div>

	<div class="actions">
		<button class="next" on:click={saveAndContinue}>
			Continue →
		</button>
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
		margin-bottom: 1.5rem;
	}

	.field {
		padding: 0.9rem 1rem;
		border: 1px solid #e3e3e3;
		border-radius: 10px;
		cursor: pointer;
		transition: all 0.15s ease;
		background: #fafafa;
	}

	.field:hover {
		background: #f2f2f2;
	}

	.field.selected {
		border-color: #111;
		background: #111;
		color: white;
	}

	.field.selected p {
		color: #ddd;
	}

	.field-header {
		display: flex;
		justify-content: space-between;
		font-weight: 500;
		margin-bottom: 0.3rem;
	}

	.check {
		font-weight: bold;
	}

	.field p {
		font-size: 0.8rem;
		color: #666;
		margin: 0;
	}

	.comment-label {
		font-size: 0.85rem;
		color: #555;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	textarea {
		border-radius: 8px;
		border: 1px solid #ddd;
		padding: 0.6rem;
		font-family: inherit;
		resize: vertical;
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
