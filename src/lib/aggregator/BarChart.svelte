<script lang="ts">
	export let values: Record<string, number>;

	const entries = Object.entries(values);
	const max = Math.max(...entries.map(([, v]) => v), 1);
</script>

<div class="space-y-2">
	{#each entries as [label, count]}
		<div class="flex items-center gap-3">
			<div class="w-40 text-sm truncate">{label}</div>
			<div class="flex-1 bg-slate-100 rounded h-4">
				<div
					class="bg-slate-700 h-4 rounded"
					style="width: {(count / max) * 100}%"
				/>
			</div>
			<div class="w-8 text-sm text-right">{count}</div>
		</div>
	{/each}
</div>
