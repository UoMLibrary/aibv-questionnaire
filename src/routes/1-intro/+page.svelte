<script lang="ts">
	import { goto } from '$app/navigation';

	function next() {
		goto('/2-confidence');
	}
</script>

<div class="container">
	<header>
		<p class="step">Step 1 of 7</p>
		<h1>Lapcat Operational Visibility</h1>
		<p class="subtitle">
			This short workshop explores whether Lapcat provides sufficient operational
			visibility — and whether a lightweight minimum standard would improve resilience.
		</p>
	</header>

	<div class="card">
		<h2 class="section-title">Purpose</h2>
		<ul>
			<li>Validate current confidence in Lapcat</li>
			<li>Test a proposed minimum operational baseline</li>
			<li>Identify practical friction points</li>
			<li>Explore appetite for assisted governance</li>
		</ul>
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
		max-width: 640px;
	}

	.card {
		background: white;
		border-radius: 12px;
		padding: 1.75rem;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
		margin-bottom: 2rem;
	}

	.section-title {
		font-size: 1rem;
		margin: 0 0 0.75rem 0;
	}

	ul {
		padding-left: 1.2rem;
		margin: 0;
	}

	li {
		margin-bottom: 0.5rem;
		color: #444;
		font-size: 0.9rem;
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
