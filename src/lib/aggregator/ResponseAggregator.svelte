<script lang="ts">
	import { questionnaire, type Question } from '$lib/questionnaire/questionnaire';
	import QuestionResult from './QuestionResult.svelte';

	type StoredAnswer = {
		value: string | string[] | number;
		otherText?: string;
		updatedAt: string;
	};

	type Submission = {
		questionnaireId: string;
		submittedAt: string;
		answers: Record<string, StoredAnswer>;
	};

	let submissions: Submission[] = [];
	let aggregated: Record<string, any> = {};

	// Build question lookup from schema
	const questionMap = new Map<string, Question>();
	for (const section of questionnaire.sections) {
		for (const q of section.questions) {
			questionMap.set(q.id, q);
		}
	}

	async function onFilesSelected(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		if (!input.files) return;

		submissions = [];
		aggregated = {};

		for (const file of Array.from(input.files)) {
			if (!file.name.endsWith('.json')) continue;
			try {
				const data = JSON.parse(await file.text());
				submissions.push(data);
			} catch {
				console.warn('Skipping invalid file:', file.name);
			}
		}

		aggregate();
	}

	function aggregate() {
		const result: Record<string, any> = {};

		for (const sub of submissions) {
			for (const [qid, answer] of Object.entries(sub.answers)) {
				const q = questionMap.get(qid);
				if (!q) continue;

				if (!result[qid]) {
					result[qid] = {
						question: q,
						count: 0,
						values: {},
						sum: 0,
						freeText: []
					};
				}

				const entry = result[qid];
				entry.count++;

				if (q.type === 'rating' && typeof answer.value === 'number') {
					entry.sum += answer.value;
				}

				if (q.type === 'single') {
					entry.values[answer.value] =
						(entry.values[answer.value] || 0) + 1;
				}

				if (q.type === 'multi' && Array.isArray(answer.value)) {
					for (const v of answer.value) {
						entry.values[v] = (entry.values[v] || 0) + 1;
					}
				}

                if (q.type === 'text') {
                    if (typeof answer.value === 'string' && answer.value.trim()) {
                        entry.freeText.push(answer.value.trim());
                    }
                }

                if (answer.otherText?.trim()) {
                    entry.freeText.push(answer.otherText.trim());
                }

			}
		}

		aggregated = result;
	}
</script>

<section class="bg-slate-50 min-h-screen py-10">
	<div class="mx-auto max-w-5xl px-6 space-y-8">

		<!-- Header -->
		<header class="space-y-2">
			<h2 class="text-2xl font-semibold tracking-tight text-slate-900">
				Questionnaire analysis
			</h2>
			<p class="text-sm text-slate-600 max-w-2xl">
				Aggregated results from submitted questionnaire response files.
				Data is analysed per question and shown in summary form.
			</p>
		</header>

		<!-- File input panel -->
		<div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
			<div class="flex flex-col gap-2">
				<label class="text-sm font-medium text-slate-700">
					Response files
				</label>

				<input
					type="file"
					multiple
					webkitdirectory
					accept=".json"
					on:change={onFilesSelected}
					class="block w-full text-sm text-slate-700
						file:mr-4 file:rounded-lg file:border-0
						file:bg-slate-900 file:px-4 file:py-2
						file:text-sm file:font-medium file:text-white
						hover:file:bg-slate-800"
				/>

				<p class="text-xs text-slate-500">
					Select the folder containing downloaded questionnaire response JSON files.
				</p>
			</div>

			{#if submissions.length > 0}
				<div class="text-sm text-slate-700">
					Loaded <strong>{submissions.length}</strong> responses
				</div>
			{/if}
		</div>

		<!-- Results -->
		{#if Object.keys(aggregated).length > 0}
			<div class="space-y-6">
				{#each Object.entries(aggregated) as [qid, data]}
					<QuestionResult {qid} {data} />
				{/each}
			</div>
		{/if}

	</div>
</section>
