<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	type RatingKey =
		| 'trust'
		| 'completeness'
		| 'ownership'
		| 'monitoring';

	let responses: Record<RatingKey, number | null> = {
		trust: null,
		completeness: null,
		ownership: null,
		monitoring: null
	};

    $: persist(responses);

    function persist(state: typeof responses) {
        const existing = localStorage.getItem('lapcat-workshop');
        const parsed = existing ? JSON.parse(existing) : {};

        localStorage.setItem(
            'lapcat-workshop',
            JSON.stringify({
                ...parsed,
                currentState: state
            })
        );
    }


	onMount(() => {
		const existing = localStorage.getItem('lapcat-workshop');
		if (existing) {
			const parsed = JSON.parse(existing);
			if (parsed.currentState) {
				responses = { ...responses, ...parsed.currentState };
			}
		}
	});

	function saveAndContinue() {
		const existing = localStorage.getItem('lapcat-workshop');
		const parsed = existing ? JSON.parse(existing) : {};

		const updated = {
			...parsed,
			currentState: responses
		};

		localStorage.setItem('lapcat-workshop', JSON.stringify(updated));

		goto('/3-must-fields');
	}

	function allAnswered() {
		return Object.values(responses).every((v) => v !== null);
	}
</script>

<div class="container">
	<header>
		<p class="step">Step 2 of 7</p>
		<h1>Current State Confidence</h1>
		<p class="subtitle">
			Please rate your level of agreement with the following statements.
		</p>
	</header>

	<div class="card">
		{#each [
			{ key: 'trust', label: 'I trust Lapcat during an incident.' },
			{ key: 'completeness', label: 'Lapcat records are usually complete.' },
			{ key: 'ownership', label: 'Application ownership is clearly defined.' },
			{ key: 'monitoring', label: 'Monitoring visibility is clear from Lapcat.' }
		] as item}
			<div class="question">
				<p>{item.label}</p>
				<div class="scale">
					{#each [1, 2, 3, 4, 5] as value}
						<button
							class:selected={responses[item.key] === value}
							on:click={() => (responses[item.key] = value)}
						>
							{value}
						</button>
					{/each}
				</div>
				<div class="scale-labels">
					<span>Strongly disagree</span>
					<span>Strongly agree</span>
				</div>
			</div>
		{/each}
	</div>

</div>

<style>
	.container {
		max-width: 720px;
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
	}

	.card {
		background: #ffffff;
		border-radius: 12px;
		padding: 1.75rem;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
		margin-bottom: 2rem;
	}

	.question {
		margin-bottom: 2rem;
	}

	.question p {
		font-weight: 500;
		margin-bottom: 0.75rem;
	}

	.scale {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 0.4rem;
	}

	.scale button {
		flex: 1;
		padding: 0.5rem 0;
		border-radius: 8px;
		border: 1px solid #ddd;
		background: #f8f8f8;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.scale button:hover {
		background: #eee;
	}

	.scale button.selected {
		background: #111;
		color: white;
		border-color: #111;
	}

	.scale-labels {
		display: flex;
		justify-content: space-between;
		font-size: 0.75rem;
		color: #777;
	}

	.actions {
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
