<script lang="ts">
	import type { Question } from '$lib/questionnaire/questionnaire';
	import { quizState, setAnswer } from '$lib/questionnaire/store';

	import SingleChoice from './SingleChoice.svelte';
	import MultiChoice from './MultiChoice.svelte';
	import Rating from './Rating.svelte';
	import TextQuestion from './TextQuestion.svelte';

	export let question: Question;

	$: existing = $quizState.answers[question.id];
	$: value = existing?.value;
	$: otherText = existing?.otherText ?? '';

	function update(nextValue: any, nextOther?: string) {
		setAnswer(question.id, nextValue, nextOther);
	}
</script>

<div class="rounded-xl border border-slate-100 bg-slate-50 p-4">
	<div class="flex items-start justify-between gap-3">
		<div>
			<div class="text-sm font-medium text-slate-900">
				{question.prompt}
				{#if question.required !== false}
					<span class="ml-2 text-xs font-semibold text-slate-500">Required</span>
				{/if}
			</div>
			{#if question.help}
				<div class="mt-1 text-xs text-slate-600">{question.help}</div>
			{/if}
		</div>
	</div>

	<div class="mt-3">
		{#if question.type === 'single'}
			<SingleChoice {question} {value} {otherText} onChange={update} />
		{:else if question.type === 'multi'}
			<MultiChoice {question} {value} {otherText} onChange={update} />
		{:else if question.type === 'rating'}
			<Rating {question} {value} onChange={update} />
		{:else if question.type === 'text'}
			<TextQuestion {question} {value} onChange={update} />
		{/if}
	</div>
</div>
