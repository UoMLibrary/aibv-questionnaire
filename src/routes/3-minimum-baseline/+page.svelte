<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	const MAX_SELECTION = 5;

	type FieldKey =
		| 'developer'
		| 'backup'
		| 'prodUrl'
		| 'repo'
		| 'healthcheck'
		| 'cronjob'
		| 'status'
		| 'techstack'
		| 'businessContact'
		| 'dependencies';

	let selected: FieldKey[] = [];

	const fields: { key: FieldKey; label: string; description: string }[] = [
		{ key: 'developer', label: 'Primary Developer', description: 'Named responsible owner.' },
		{ key: 'backup', label: 'Backup Owner', description: 'Secondary contact if primary unavailable.' },
		{ key: 'prodUrl', label: 'Production URL', description: 'Live URL if Status = Production.' },
		{ key: 'repo', label: 'Version Control Link', description: 'Link to Git repository.' },
		{ key: 'healthcheck', label: 'Health Check Endpoint', description: 'Endpoint indicating system health.' },
		{ key: 'cronjob', label: 'Cronjob', description: 'Scheduled background tasks.' },
		{ key: 'status', label: 'Status', description: 'Development / UAT / Production / etc.' },
		{ key: 'techstack', label: 'Tech Stack', description: 'Primary technologies used.' },
		{ key: 'businessContact', label: 'Business Contact', description: 'Non-technical stakeholder contact.' },
		{ key: 'dependencies', label: 'Dependencies', description: 'Other systems relied upon.' }
	];

	onMount(() => {
		const existing = localStorage.getItem('lapcat-workshop');
		if (existing) {
			const parsed = JSON.parse(existing);
			if (parsed.minimumFields) {
				selected = parsed.minimumFields;
			}
		}
	});

	function toggle(key: FieldKey) {
		if (selected.includes(key)) {
			selected = selected.filter((k) => k !== key);
		} else {
			if (selected.length < MAX_SELECTION) {
				selected = [...selected, key];
			}
		}
	}

	function saveAndContinue() {
		const existing = localStorage.getItem('lapcat-workshop');
		const parsed = existing ? JSON.parse(existing) : {};

		const updated = {
			...parsed,
			minimumFields: selected
		};

		localStorage.setItem('lapcat-workshop', JSON.stringify(updated));
		goto('/4-risk');
	}
</script>

<div class="container">
	<header>
		<p class="step">Step 3 of 7</p>
		<h1>Minimum Operational Baseline</h1>
		<p class="subtitle">
			If Lapcat is the first place you look during an incident, which fields must
			always be populated?
		</p>
		<p class="limit">Select up to {MAX_SELECTION} fields.</p>
	</header>

	<div class="card">
		{#each fields as field}
			<div
				class="field {selected.includes(field.key) ? 'selected' : ''}"
				on:click={() => toggle(field.key)}
			>
				<div class="field-header">
					<span>{field.label}</span>
					{#if selected.includes(field.key)}
						<span class="check">✓</span>
					{/if}
				</div>
				<p>{field.description}</p>
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

	.next:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
</style>
