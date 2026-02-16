<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	type AiOption = 'yes' | 'maybe' | 'no' | 'depends';

	let selection: AiOption | null = null;
	let concerns = '';

 let hydrated = false;

    onMount(() => {
        const existing = localStorage.getItem('lapcat-workshop');
        if (existing) {
            const parsed = JSON.parse(existing);
            if (parsed.aiSelection) selection = parsed.aiSelection;
            if (parsed.aiConcerns) concerns = parsed.aiConcerns;
        }

        hydrated = true;
    });

    $: if (hydrated) {
        persist(selection, concerns);
    }

    function persist(sel: typeof selection, text: string) {
        const existing = localStorage.getItem('lapcat-workshop');
        const parsed = existing ? JSON.parse(existing) : {};

        localStorage.setItem(
            'lapcat-workshop',
            JSON.stringify({
                ...parsed,
                aiSelection: sel,
                aiConcerns: text
            })
        );
    }

	const options: { key: AiOption; label: string; description: string }[] = [
		{
			key: 'yes',
			label: 'Yes',
			description: 'Automated flagging would improve governance and visibility.'
		},
		{
			key: 'maybe',
			label: 'Maybe',
			description: 'It could help, but only with safeguards and clarity.'
		},
		{
			key: 'depends',
			label: 'Depends',
			description: 'It depends on transparency, accuracy, and oversight.'
		},
		{
			key: 'no',
			label: 'No',
			description: 'AI involvement introduces unnecessary risk or complexity.'
		}
	];



	function saveAndContinue() {
		const existing = localStorage.getItem('lapcat-workshop');
		const parsed = existing ? JSON.parse(existing) : {};

		localStorage.setItem(
			'lapcat-workshop',
			JSON.stringify({
				...parsed,
				aiSelection: selection,
				aiConcerns: concerns
			})
		);

		goto('/7-summary');
	}
</script>

<div class="container">
	<header>
		<p class="step">Step 6 of 7</p>
		<h1>AI-Supported Governance</h1>
		<p class="subtitle">
			If incomplete or potentially outdated records were automatically flagged
			(not updated automatically, just flagged), would that help?
		</p>
	</header>

	<div class="card">
		{#each options as option}
			<div
				class="field {selection === option.key ? 'selected' : ''}"
				on:click={() => (selection = option.key)}
			>
				<div class="field-header">
					<span>{option.label}</span>
					{#if selection === option.key}
						<span class="check">✓</span>
					{/if}
				</div>
				<p>{option.description}</p>
			</div>
		{/each}
	</div>

	<div class="card">
		<label class="comment-label">
			Concerns or safeguards you would expect (optional)
			<textarea
				rows="3"
				bind:value={concerns}
				placeholder="For example: accuracy, audit trail, human oversight, data privacy..."
			/>
		</label>
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

	.field p {
		font-size: 0.8rem;
		color: #666;
		margin: 0;
	}

	.check {
		font-weight: bold;
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

	.next:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.next:hover:not(:disabled) {
		opacity: 0.85;
	}
</style>
