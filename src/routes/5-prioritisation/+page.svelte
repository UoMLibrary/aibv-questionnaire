<script lang="ts">
	import { onMount } from 'svelte';

	type Initiative = {
		id: string;
		title: string;
		description: string;
		impact: number;
		effort: number;
		risk: number;
	};

	let initiatives: Initiative[] = [
		{
			id: crypto.randomUUID(),
			title: 'Standardised Documentation Template',
			description:
				'Create a consistent template for documenting library software systems.',
			impact: 1,
			effort: 1,
			risk: 1
		},
		{
			id: crypto.randomUUID(),
			title: 'Monitoring Dashboard',
			description:
				'Central dashboard showing service health, dependencies, and system status.',
			impact: 1,
			effort: 1,
			risk: 1
		},
		{
			id: crypto.randomUUID(),
			title: 'AI Log Analysis',
			description:
				'Use AI to analyse logs and detect anomalies or missing documentation.',
			impact: 1,
			effort: 1,
			risk: 1
		}
	];

	let hydrated = false;

	onMount(() => {
		const existing = localStorage.getItem('lapcat-workshop');
		if (existing) {
			const parsed = JSON.parse(existing);
			if (parsed.priorities) {
				initiatives = parsed.priorities;
			}
		}
		hydrated = true;
	});

	// Auto persist after hydration
	$: if (hydrated) {
		persist(initiatives);
	}

	function persist(items: typeof initiatives) {
		const existing = localStorage.getItem('lapcat-workshop');
		const parsed = existing ? JSON.parse(existing) : {};

		localStorage.setItem(
			'lapcat-workshop',
			JSON.stringify({
				...parsed,
				priorities: items
			})
		);
	}

	function score(item: Initiative) {
		return item.impact * 2 - item.effort - item.risk;
	}

	$: ranked = [...initiatives]
		.map((i) => ({ ...i, score: score(i) }))
		.sort((a, b) => b.score - a.score);

	function updateValue(
		id: string,
		field: 'impact' | 'effort' | 'risk',
		value: number
	) {
		const updated = initiatives.map((i) =>
			i.id === id ? { ...i, [field]: value } : i
		);
		initiatives = updated;
	}
</script>


<div class="container">
	<header>
		<p class="step">Step 5 of 7</p>
		<h1>Prioritisation</h1>
		<p class="subtitle">
			Score each initiative based on impact, effort, and risk.
		</p>
		<p class="limit">Score range: 1 (low) → 5 (high)</p>
	</header>

	<div class="card">
		{#each initiatives as item}
			<div class="initiative">
				<div class="initiative-header">
					<span>{item.title}</span>
					<span class="score">Score: {score(item)}</span>
				</div>
				<p>{item.description}</p>

				<div class="controls">
					<label>
						Impact
						<input
							type="range"
							min="1"
							max="5"
							value={item.impact}
							on:input={(e) =>
								updateValue(item.id, 'impact', +e.currentTarget.value)
							}
						/>
					</label>

					<label>
						Effort
						<input
							type="range"
							min="1"
							max="5"
							value={item.effort}
							on:input={(e) =>
								updateValue(item.id, 'effort', +e.currentTarget.value)
							}
						/>
					</label>

					<label>
						Risk
						<input
							type="range"
							min="1"
							max="5"
							value={item.risk}
							on:input={(e) =>
								updateValue(item.id, 'risk', +e.currentTarget.value)
							}
						/>
					</label>
				</div>
			</div>
		{/each}
	</div>

	<div class="card ranking">
		<h2>Ranked Outcome</h2>
		{#each ranked as r}
			<div class="rank-item">
				<span>{r.title}</span>
				<span>{r.score}</span>
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
		gap: 1.25rem;
		margin-bottom: 1.5rem;
	}

	.initiative {
		border: 1px solid #e3e3e3;
		border-radius: 10px;
		padding: 1rem;
		background: #fafafa;
	}

	.initiative-header {
		display: flex;
		justify-content: space-between;
		font-weight: 500;
		margin-bottom: 0.4rem;
	}

	.score {
		font-size: 0.85rem;
		color: #666;
	}

	.initiative p {
		font-size: 0.85rem;
		color: #666;
		margin-bottom: 0.75rem;
	}

	.controls {
		display: grid;
		gap: 0.6rem;
	}

	label {
		font-size: 0.75rem;
		color: #555;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	input[type='range'] {
		accent-color: #111;
	}

	.ranking h2 {
		font-size: 1rem;
		margin-bottom: 0.5rem;
	}

	.rank-item {
		display: flex;
		justify-content: space-between;
		padding: 0.5rem 0;
		border-bottom: 1px solid #eee;
		font-size: 0.85rem;
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
