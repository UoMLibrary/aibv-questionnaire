<script lang="ts">
	import type { SingleChoiceQuestion } from '../questionnaire';

	export let question: SingleChoiceQuestion;
	export let value: any; // string
	export let otherText: string;
	export let onChange: (value: string, otherText?: string) => void;

	function select(id: string) {
		onChange(id, id === 'other' ? otherText : undefined);
	}

	function setOtherText(t: string) {
		onChange(value ?? 'other', t);
	}
</script>

<div class="space-y-2">
	{#each question.options as opt (opt.id)}
		<label
			class="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 hover:bg-slate-50"
		>
			<input
				type="radio"
				name={question.id}
				class="h-4 w-4"
				checked={value === opt.id}
				on:change={() => select(opt.id)}
			/>
			<span class="text-sm text-slate-800">{opt.label}</span>
		</label>

		{#if question.allowOtherText && opt.id === 'other' && value === 'other'}
			<input
				class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
				placeholder="Please specify…"
				value={otherText}
				on:input={(e) => setOtherText((e.currentTarget as HTMLInputElement).value)}
			/>
		{/if}
	{/each}
</div>
