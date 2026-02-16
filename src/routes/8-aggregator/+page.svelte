<script lang="ts">
	type Workshop = any;

	let workshops: Workshop[] = [];

	let frictionScores: Record<string, number> = {};
	let baselineScores: Record<string, number> = {};
	let aiCounts: Record<string, number> = {};
	let aiConcernList: string[] = [];

	let ratingTotals = {
		trust: 0,
		completeness: 0,
		ownership: 0,
		monitoring: 0
	};
	let ratingCount = 0;

	let initiativeMap: Record<
		string,
		{ impact: number; effort: number; risk: number; count: number }
	> = {};

	let aggregatedInitiatives: any[] = [];

	function handleFiles(event: Event) {
		const input = event.target as HTMLInputElement;
		if (!input.files) return;

		const readers = Array.from(input.files).map((file) =>
			file.text().then((text) => JSON.parse(text))
		);

		Promise.all(readers).then((results) => {
			workshops = results;
			aggregate();
		});
	}

	function aggregate() {
		frictionScores = {};
		baselineScores = {};
		aiCounts = {};
		aiConcernList = [];
		initiativeMap = {};
		aggregatedInitiatives = [];

		ratingTotals = {
			trust: 0,
			completeness: 0,
			ownership: 0,
			monitoring: 0
		};
		ratingCount = 0;

		for (const w of workshops) {

			// Friction weighted
			if (w.frictionOrder) {
				const max = w.frictionOrder.length;
				w.frictionOrder.forEach((item, index) => {
					const score = max - index;
					frictionScores[item.label] =
						(frictionScores[item.label] ?? 0) + score;
				});
			}

			// Baseline weighted
			if (w.minimumFieldOrder) {
				const max = w.minimumFieldOrder.length;
				w.minimumFieldOrder.forEach((item, index) => {
					const score = max - index;
					baselineScores[item.label] =
						(baselineScores[item.label] ?? 0) + score;
				});
			}

			// AI appetite
			if (w.aiSelection) {
				aiCounts[w.aiSelection] =
					(aiCounts[w.aiSelection] ?? 0) + 1;
			}

			// AI concerns
			if (w.aiConcerns && w.aiConcerns.trim().length > 0) {
				aiConcernList.push(w.aiConcerns.trim());
			}

			// Ratings
			if (w.currentState) {
				ratingTotals.trust += w.currentState.trust ?? 0;
				ratingTotals.completeness += w.currentState.completeness ?? 0;
				ratingTotals.ownership += w.currentState.ownership ?? 0;
				ratingTotals.monitoring += w.currentState.monitoring ?? 0;
				ratingCount++;
			}

			// Initiatives
			if (w.priorities) {
				for (const p of w.priorities) {
					if (!initiativeMap[p.title]) {
						initiativeMap[p.title] = {
							impact: 0,
							effort: 0,
							risk: 0,
							count: 0
						};
					}

					initiativeMap[p.title].impact += p.impact;
					initiativeMap[p.title].effort += p.effort;
					initiativeMap[p.title].risk += p.risk;
					initiativeMap[p.title].count++;
				}
			}
		}

		// Build averaged initiative ranking
		aggregatedInitiatives = Object.entries(initiativeMap)
			.map(([title, data]) => {
				const avgImpact = data.impact / data.count;
				const avgEffort = data.effort / data.count;
				const avgRisk = data.risk / data.count;
				const score = avgImpact * 2 - avgEffort - avgRisk;

				return {
					title,
					impact: avgImpact.toFixed(2),
					effort: avgEffort.toFixed(2),
					risk: avgRisk.toFixed(2),
					score: score.toFixed(2)
				};
			})
			.sort((a, b) => Number(b.score) - Number(a.score));
	}

	function average(v: number) {
		return ratingCount ? (v / ratingCount).toFixed(2) : '–';
	}

	function topFive(obj: Record<string, number>) {
		return Object.entries(obj)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 5);
	}
</script>

<div class="container">
	<header>
		<h1>Aggregated Workshop Summary</h1>
		<input type="file" multiple accept="application/json" on:change={handleFiles} />
		{#if workshops.length}
			<p class="muted">{workshops.length} submissions loaded.</p>
		{/if}
	</header>

	{#if workshops.length}

		<!-- Current State -->
		<div class="card">
			<h2>Current State Confidence (Average)</h2>
			<ul>
				<li><strong>Trust:</strong> {average(ratingTotals.trust)} / 5</li>
				<li><strong>Completeness:</strong> {average(ratingTotals.completeness)} / 5</li>
				<li><strong>Ownership:</strong> {average(ratingTotals.ownership)} / 5</li>
				<li><strong>Monitoring:</strong> {average(ratingTotals.monitoring)} / 5</li>
			</ul>
		</div>

		<!-- Baseline -->
		<div class="card">
			<h2>Top 5 Minimum Baseline Fields (Weighted)</h2>
			<ul>
				{#each topFive(baselineScores) as [label, score], i}
					<li><strong>{i + 1}. {label}</strong> (score: {score})</li>
				{/each}
			</ul>
		</div>

		<!-- Friction -->
		<div class="card">
			<h2>Top 5 Friction Factors (Weighted)</h2>
			<ul>
				{#each topFive(frictionScores) as [label, score], i}
					<li><strong>{i + 1}. {label}</strong> (score: {score})</li>
				{/each}
			</ul>
		</div>

		<!-- Initiatives -->
		<div class="card">
			<h2>Initiative Prioritisation (Averaged)</h2>
			{#each aggregatedInitiatives as item, i}
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
		</div>

		<!-- AI -->
		<div class="card">
			<h2>AI Governance Appetite</h2>
			<ul>
				{#each Object.entries(aiCounts) as [label, count]}
					<li><strong>{label}</strong>: {count}</li>
				{/each}
			</ul>

			{#if aiConcernList.length}
				<div class="concerns">
					<h3>Concerns / Safeguards Raised</h3>
					<ul>
						{#each aiConcernList as concern}
							<li>{concern}</li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>

	{/if}
</div>

<style>
	.container {
		max-width: 780px;
		margin: 4rem auto;
		padding: 0 1.5rem;
		font-family: system-ui;
	}

	header {
		margin-bottom: 2rem;
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

	h3 {
		font-size: 0.9rem;
		margin-top: 1rem;
		margin-bottom: 0.5rem;
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
</style>
