<script lang="ts">
	import type { Section } from './questionnaire';
	import QuestionRenderer from './questions/QuestionRenderer.svelte';

	export let section: Section;
</script>

<section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
	<h2 class="text-base font-semibold">{section.title}</h2>
	{#if section.description}
		<p class="mt-1 text-sm text-slate-600">{section.description}</p>
	{/if}

	<div class="mt-4 space-y-4">
		{#each section.questions as q (q.id)}
			<QuestionRenderer question={q} />
		{/each}
	</div>
</section>
