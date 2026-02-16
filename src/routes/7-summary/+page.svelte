<script lang="ts">
	import { onMount } from 'svelte';

	type FieldItem = {
		id: string;
		label: string;
		description: string;
	};

	type FrictionItem = {
		id: string;
		label: string;
		description: string;
	};

	type Initiative = {
		id: string;
		title: string;
		description: string;
		impact: number;
		effort: number;
		risk: number;
	};

	let baseline: FieldItem[] = [];
	let friction: FrictionItem[] = [];
	let priorities: Initiative[] = [];
	let currentState: Record<string, number> | null = null;

	let aiSelection: string | null = null;
	let aiConcerns = '';

	function score(item: Initiative) {
		return item.impact * 2 - item.effort - item.risk;
	}

	$: ranked =
		priorities.length > 0
			? [...priorities]
					.map((i) => ({ ...i, score: score(i) }))
					.sort((a, b) => b.score - a.score)
			: [];

	onMount(() => {
		const existing = localStorage.getItem('lapcat-workshop');
		if (!existing) return;

		const parsed = JSON.parse(existing);

		if (parsed.minimumFieldOrder) baseline = parsed.minimumFieldOrder;
		if (parsed.frictionOrder) friction = parsed.frictionOrder;
		if (parsed.priorities) priorities = parsed.priorities;
		if (parsed.currentState) currentState = parsed.currentState;
		if (parsed.aiSelection) aiSelection = parsed.aiSelection;
		if (parsed.aiConcerns) aiConcerns = parsed.aiConcerns;
	});

	function downloadResults() {
		const existing = localStorage.getItem('lapcat-workshop');
		if (!existing) {
			alert('No workshop data found.');
			return;
		}

		const payload = {
			timestamp: new Date().toISOString(),
			...JSON.parse(existing)
		};

		const blob = new Blob(
			[JSON.stringify(payload, null, 2)],
			{ type: 'application/json' }
		);

		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `lapcat-workshop-${Date.now()}.json`;

		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);

		URL.revokeObjectURL(url);
	}
</script>

<div class="container">
	<header>
		<p class="step">Step 7 of 7</p>
		<h1>Workshop Summary</h1>
		<p class="subtitle">
			Structured summary of operational visibility, prioritisation, and governance discussion.
		</p>
	</header>

	<!-- Current State Confidence -->
	<div class="card">
		<h2>Current State Confidence</h2>

		{#if currentState}
			<ul>
				<li><strong>Trust during incident:</strong> {currentState.trust} / 5</li>
				<li><strong>Record completeness:</strong> {currentState.completeness} / 5</li>
				<li><strong>Ownership clarity:</strong> {currentState.ownership} / 5</li>
				<li><strong>Monitoring visibility:</strong> {currentState.monitoring} / 5</li>
			</ul>
		{:else}
			<p class="muted">No confidence ratings recorded.</p>
		{/if}
	</div>

	<!-- Minimum Baseline -->
	<div class="card">
		<h2>Top 5 Minimum Baseline Fields</h2>

		{#if baseline.length}
			<ul>
				{#each baseline.slice(0, 5) as field, i}
					<li><strong>{i + 1}. {field.label}</strong></li>
				{/each}
			</ul>
		{:else}
			<p class="muted">No baseline ranking recorded.</p>
		{/if}
	</div>

	<!-- Friction -->
	<div class="card">
		<h2>Top 5 Friction Factors</h2>

		{#if friction.length}
			<ul>
				{#each friction.slice(0, 5) as item, i}
					<li><strong>{i + 1}. {item.label}</strong></li>
				{/each}
			</ul>
		{:else}
			<p class="muted">No friction ranking recorded.</p>
		{/if}
	</div>

	<!-- Initiative Ranking -->
	<div class="card">
		<h2>Initiative Prioritisation</h2>

		{#if ranked.length}
			{#each ranked as item, i}
				<div class="rank-item">
					<div>
						<strong>{i + 1}. {item.title}</strong>
						<p class="small">
							Impact: {item.impact} | Effort: {item.effort} | Risk: {item.risk}
						</p>
					</div>
					<div class="score-badge">{item.score}</div>
				</div>
			{/each}
		{:else}
			<p class="muted">No initiative scoring recorded.</p>
		{/if}
	</div>

	<!-- AI -->
	<div class="card">
		<h2>AI Governance Appetite</h2>

		{#if aiSelection}
			<p><strong>Position:</strong> {aiSelection}</p>
		{:else}
			<p class="muted">No AI position recorded.</p>
		{/if}

		{#if aiConcerns}
			<div class="concerns">
				<p><strong>Concerns / Safeguards Raised:</strong></p>
				<p>{aiConcerns}</p>
			</div>
		{/if}
	</div>

	<div class="actions">
		<button class="next" on:click={downloadResults}>
			Download JSON Results →
		</button>
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
	}

	.card {
		background: white;
		border-radius: 12px;
		padding: 1.75rem;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
		margin-bottom: 1.5rem;
	}

	h2 {
		font-size: 1rem;
		margin-bottom: 1rem;
	}

	ul {
		margin: 0;
		padding-left: 1.2rem;
	}

	li {
		margin-bottom: 0.5rem;
		font-size: 0.9rem;
	}

	.rank-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 0;
		border-bottom: 1px solid #eee;
	}

	.score-badge {
		background: #111;
		color: white;
		padding: 0.4rem 0.7rem;
		border-radius: 8px;
		font-size: 0.8rem;
		font-weight: 600;
	}

	.small {
		font-size: 0.75rem;
		color: #666;
		margin: 0.25rem 0 0 0;
	}

	.muted {
		color: #777;
		font-size: 0.9rem;
	}

	.concerns {
		margin-top: 1rem;
		background: #f7f7f7;
		padding: 0.9rem;
		border-radius: 8px;
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

	@media print {
		.next {
			display: none;
		}
	}
</style>
