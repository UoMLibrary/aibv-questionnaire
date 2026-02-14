<script lang="ts">
	import { questionnaire, type Question } from '$lib/questionnaire/questionnaire';
	import QuestionResult from './QuestionResult.svelte';

    let totalFiles = 0;
    let jsonFiles = 0;
    let validResponses = 0;

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
        if (!input.files || input.files.length === 0) return;

        submissions = [];
        aggregated = {};
        totalFiles = input.files.length;
        jsonFiles = 0;
        validResponses = 0;

        // Check if this looks like a folder selection
        const fromFolder = Array.from(input.files).some(
            f => f.webkitRelativePath && f.webkitRelativePath.includes('/')
        );

        if (!fromFolder) {
            alert('Please select a folder containing the response files.');
            return;
        }

        for (const file of Array.from(input.files)) {
            if (!file.name.toLowerCase().endsWith('.json')) continue;

            jsonFiles++;

            try {
                const data = JSON.parse(await file.text());
                submissions.push(data);
                validResponses++;
            } catch {
                console.warn('Skipping invalid JSON:', file.name);
            }
        }

        if (validResponses === 0) {
            alert('No valid questionnaire JSON files were found in this folder.');
            return;
        }

        aggregate();
    }



    const STOP_WORDS = new Set([
        'the', 'and', 'to', 'of', 'a', 'in', 'for', 'is', 'on', 'that',
        'with', 'as', 'are', 'it', 'be', 'or', 'by', 'this', 'an',
        'at', 'from', 'if', 'but', 'we', 'they', 'their', 'our'
    ]);

    function extractKeywords(texts: string[]) {
        const freq: Record<string, number> = {};

        for (const text of texts) {
            const words = text
                .toLowerCase()
                .replace(/[^a-z0-9\s]/g, '')
                .split(/\s+/)
                .filter(w => w.length > 2 && !STOP_WORDS.has(w));

            for (const w of words) {
                freq[w] = (freq[w] || 0) + 1;
            }
        }

        return freq;
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
                        freeText: [],
                        keywords: {}
                    };
				}

				const entry = result[qid];
				entry.count++;

				if (q.type === 'rating' && typeof answer.value === 'number') {
					entry.sum += answer.value;
				}

				if (q.type === 'single' && typeof answer.value === 'string') {
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

        for (const entry of Object.values(result)) {
            if (entry.freeText.length > 0) {
                entry.keywords = extractKeywords(entry.freeText);
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
					Select the folder containing downloaded questionnaire response JSON files. Other files (for example system or hidden files) will be ignored automatically.
				</p>
			</div>

            {#if validResponses > 0}
                <div class="text-sm text-slate-700 space-y-1">
                    <div>
                        <strong>{validResponses}</strong> valid response file{validResponses === 1 ? '' : 's'} processed
                    </div>
                    <div class="text-xs text-slate-500">
                        ({jsonFiles} JSON file{jsonFiles === 1 ? '' : 's'} found in {totalFiles} total file{totalFiles === 1 ? '' : 's'})
                    </div>
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
