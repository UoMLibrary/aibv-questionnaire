<script lang="ts">
	import type { RatingQuestion } from '$lib/questionnaire/questionnaire';

	export let question: RatingQuestion;
	export let value: any; // number
	export let onChange: (value: number) => void;

	$: current = typeof value === 'number' ? value : 0;
</script>

<div class="flex flex-col gap-2">
	<div class="flex flex-wrap gap-2">
		{#each Array(question.max - question.min + 1)
			.fill(0)
			.map((_, i) => question.min + i) as n (n)}
			<button
				type="button"
				class="min-w-10 rounded-lg border px-3 py-2 text-sm font-medium transition
					{current === n
					? 'border-slate-900 bg-slate-900 text-white'
					: 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'}"
				on:click={() => onChange(n)}
				aria-pressed={current === n}
			>
				{n}
			</button>
		{/each}
	</div>

	{#if question.minLabel || question.maxLabel}
		<div class="flex justify-between text-xs text-slate-600">
			<span>{question.minLabel ?? ''}</span>
			<span>{question.maxLabel ?? ''}</span>
		</div>
	{/if}
</div>
