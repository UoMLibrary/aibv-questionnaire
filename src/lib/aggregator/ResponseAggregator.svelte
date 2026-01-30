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

<section class="space-y-6">
	<h2 class="text-xl font-semibold">Questionnaire analysis</h2>

	<input
		type="file"
		multiple
		webkitdirectory
		accept=".json"
		on:change={onFilesSelected}
	/>

	<p class="text-sm text-slate-600">
		Select the folder containing the response JSON files.
	</p>

	{#if submissions.length > 0}
		<p class="text-sm">
			Loaded <strong>{submissions.length}</strong> responses
		</p>
	{/if}

	{#each Object.entries(aggregated) as [qid, data]}
		<QuestionResult {qid} {data} />
	{/each}
</section>
