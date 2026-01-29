<script lang="ts">
	import type { TextQuestion } from '../questionnaire';

	export let question: TextQuestion;
	export let value: any; // string
	export let onChange: (value: string) => void;

	$: text = typeof value === 'string' ? value : '';
</script>

{#if question.multiline}
	<textarea
		class="min-h-24 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
		placeholder={question.placeholder ?? 'Type your answer…'}
		value={text}
		on:input={(e) => onChange((e.currentTarget as HTMLTextAreaElement).value)}
	></textarea>
{:else}
	<input
		class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
		placeholder={question.placeholder ?? 'Type your answer…'}
		value={text}
		on:input={(e) => onChange((e.currentTarget as HTMLInputElement).value)}
	/>
{/if}
