<script lang="ts">
	import BarChart from './BarChart.svelte';

	export let qid: string;
	export let data: any;

	const q = data.question;
	const avg =
		q.type === 'rating' && data.count > 0
			? (data.sum / data.count).toFixed(2)
			: null;
</script>

<div class="rounded-xl border bg-white p-5 shadow-sm space-y-3">
	<h3 class="font-medium">
		{qid}. {q.prompt}
	</h3>

	<p class="text-sm text-slate-500">
		Responses: {data.count}
	</p>

	{#if q.type === 'rating'}
		<p class="text-sm">
			Average score: <strong>{avg}</strong> / {q.max}
		</p>
	{/if}

	{#if q.type === 'single' || q.type === 'multi'}
		<BarChart values={data.values} />
	{/if}

	{#if data.freeText.length}
		<details class="mt-2">
			<summary class="cursor-pointer text-sm">
				Free text ({data.freeText.length})
			</summary>
			<ul class="mt-1 text-sm text-slate-700">
				{#each data.freeText as txt}
					<li>• {txt}</li>
				{/each}
			</ul>
		</details>
	{/if}
</div>
