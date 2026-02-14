<script lang="ts">
	export let values: Record<string, number>;

	const entries = Object.entries(values);
	const max = Math.max(...entries.map(([, v]) => v), 1);
</script>

<div class="space-y-2 w-full  max-w-4xl ">
	{#each entries as [label, count]}
		<div class="flex items-center gap-3">
			<div class="min-w-[24rem] max-w-xs text-sm leading-snug break-words">
				{label}
			</div>


			<!-- Chart rail -->
            <div class="flex-1 bg-slate-200/60 rounded h-2">
                <div
                    class="bg-slate-700 h-2 rounded transition-all"
                    style="width: {(count / max) * 100}%"
                />
            </div>


			<div class="w-8 text-sm text-right">{count}</div>
		</div>
	{/each}
</div>
