<script lang="ts">
	import type { MultiChoiceQuestion } from '../questionnaire';

	export let question: MultiChoiceQuestion;
	export let value: any; // string[]
	export let otherText: string;
	export let onChange: (value: string[], otherText?: string) => void;

	$: selected = Array.isArray(value) ? value : [];

	function toggle(id: string) {
		const next = selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id];
		onChange(next, next.includes('other') ? otherText : undefined);
	}

	function setOtherText(t: string) {
		const next = selected.includes('other') ? selected : [...selected, 'other'];
		onChange(next, t);
	}
</script>

<div class="space-y-2">
	{#each question.options as opt (opt.id)}
		<label
			class="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 hover:bg-slate-50"
		>
			<input
				type="checkbox"
				class="h-4 w-4"
				checked={selected.includes(opt.id)}
				on:change={() => toggle(opt.id)}
			/>
			<span class="text-sm text-slate-800">{opt.label}</span>
		</label>

		{#if question.allowOtherText && opt.id === 'other' && selected.includes('other')}
			<input
				class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
				placeholder="Please specify…"
				value={otherText}
				on:input={(e) => setOtherText((e.currentTarget as HTMLInputElement).value)}
			/>
		{/if}
	{/each}
</div>
