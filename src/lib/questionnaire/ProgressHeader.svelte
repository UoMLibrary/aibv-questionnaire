<script lang="ts">
	export let prog: { answered: number; total: number; pct: number };
	export let lastSavedAt: string;
	export let onReset: () => void;

	function fmt(t: string) {
		const d = new Date(t);
		// keep it simple; you can format with Intl if you prefer
		return d.toLocaleString();
	}
</script>

<div class="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
	<div class="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
		<div class="flex-1">
			<div class="flex items-baseline justify-between">
				<div class="text-sm font-medium text-slate-900">{prog.pct}% complete</div>
				<div class="text-xs text-slate-500">Saved: {fmt(lastSavedAt)}</div>
			</div>

			<div class="mt-2 h-2 w-full rounded-full bg-slate-100">
				<div
					class="h-2 rounded-full bg-slate-900 transition-[width] duration-300"
					style="width: {prog.pct}%"
				></div>
			</div>
		</div>

		<button
			type="button"
			class="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
			on:click={onReset}
		>
			Reset
		</button>
	</div>
</div>
