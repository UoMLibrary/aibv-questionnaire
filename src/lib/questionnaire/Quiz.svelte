<script lang="ts">
	import { questionnaire } from './questionnaire';
	import { quizState, progress, resetAll } from './store';
	import SectionBlock from './SectionBlock.svelte';
	import ProgressHeader from './ProgressHeader.svelte';
	import { exportSubmission } from '$lib/questionnaire/export';

	function submit() {
		exportSubmission($quizState);
		alert('Your responses have been downloaded. Please send the file as instructed.');
	}

	$: prog = progress($quizState);

	function onReset() {
		if (confirm('Reset all answers? This will clear your saved progress on this device.')) {
			resetAll();
			scrollTo({ top: 0, behavior: 'smooth' });
		}
	}
</script>

<div class="min-h-screen bg-slate-50 text-slate-900">
	<ProgressHeader {prog} lastSavedAt={$quizState.lastSavedAt} {onReset} />

	<main class="mx-auto max-w-3xl px-4 pb-24 pt-6">
		<header class="mb-6">
			<h1 class="text-2xl font-semibold tracking-tight">{questionnaire.title}</h1>
			<p class="mt-2 text-sm text-slate-600">{questionnaire.intro}</p>
			{#if questionnaire.estimatedMinutes}
				<p class="mt-2 text-sm text-slate-500">
					Estimated completion time: {questionnaire.estimatedMinutes} minutes
				</p>
			{/if}
		</header>

		<div class="space-y-6">
			{#each questionnaire.sections as section (section.id)}
				<SectionBlock {section} />
			{/each}
		</div>

		<div class="mt-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
			<h2 class="text-base font-semibold">Finish</h2>
			<p class="mt-1 text-sm text-slate-600">
				Your progress is saved automatically on this device.
			</p>

			<div class="mt-4 flex flex-wrap items-center gap-3">
				<button
					on:click={submit}
					class="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
					type="button"
					disabled={prog.pct < 100}
					title={prog.pct < 100 ? 'Complete required questions to enable submission.' : 'Ready'}
				>
					Continue
				</button>

				<button
					class="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
					type="button"
					on:click={onReset}
				>
					Reset
				</button>

				<span class="text-sm text-slate-500">
					Required answered: {prog.answered} / {prog.total} ({prog.pct}%)
				</span>
			</div>
		</div>
	</main>
</div>
