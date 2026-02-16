<script>
	import { goto } from '$app/navigation';

	function next() {
		goto('/2-confidence');
	}
</script>

<main class="container">
	<h1>Lapcat Operational Visibility Workshop</h1>
	<p class="lead">
		This short session explores whether Lapcat provides sufficient operational visibility
		and whether a lightweight minimum standard would improve resilience.
	</p>

	<section class="card">
		<h2>Purpose</h2>
		<ul>
			<li>Validate current confidence in Lapcat</li>
			<li>Test a proposed minimum record baseline</li>
			<li>Identify practical friction points</li>
		</ul>
	</section>

	<button on:click={next}>Start</button>
</main>

<style>
	.container {
		max-width: 720px;
		margin: 4rem auto;
		padding: 2rem;
		font-family: system-ui, -apple-system, sans-serif;
	}
	h1 { font-size: 1.8rem; margin-bottom: 1rem; }
	.lead { color: #555; margin-bottom: 2rem; }
	.card {
		background: #fafafa;
		border: 1px solid #e5e5e5;
		padding: 1.5rem;
		border-radius: 8px;
		margin-bottom: 2rem;
	}
	button {
		background: #111;
		color: white;
		border: none;
		padding: 0.6rem 1.2rem;
		border-radius: 6px;
		cursor: pointer;
	}
	button:hover { background: #333; }
</style>
