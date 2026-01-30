<script lang="ts">
	import BarChart from './BarChart.svelte';

	export let qid: string;
	export let data: any;

    let copied = false;

    function toMarkdown() {
        let md = `### ${qid} — ${q.prompt}\n`;
        md += `Responses: ${data.count}\n\n`;

        // Rating questions
        if (q.type === 'rating' && avg !== null) {
            md += `**Average rating:** ${avg} / ${q.max}\n\n`;
        }

        // Single / multi choice questions
        if ((q.type === 'single' || q.type === 'multi') && data.values) {
            md += `**Response distribution:**\n`;

            for (const [optionId, count] of Object.entries(data.values)) {
                const label = optionLabelMap[optionId] ?? optionId;
                md += `- ${label}: ${count}\n`;
            }

            md += `\n`;
        }


        // Text questions: themes
        if (topThemes.length) {
            md += `**Top themes:**\n`;
            for (const [word, count] of topThemes) {
                md += `- ${word} (${count})\n`;
            }
            md += `\n`;
        }

        // Text questions: verbatim (limit to avoid huge prompts)
        if (data.freeText?.length) {
            md += `**Representative responses:**\n`;
            for (const txt of data.freeText.slice(0, 5)) {
                md += `- “${txt}”\n`;
            }
        }

        return md;
    }


    async function copyMarkdown() {
        try {
            await navigator.clipboard.writeText(toMarkdown());
            copied = true;
            setTimeout(() => (copied = false), 1500);
        } catch {
            alert('Unable to copy to clipboard');
        }
    }


    const topThemes = [];
    // const topThemes =
	// data.keywords
	// 	? Object.entries(data.keywords)
	// 			.sort((a, b) => b[1] - a[1])
	// 			.slice(0, 5)
	// 	: [];


	const q = data.question;
	const avg =
		q.type === 'rating' && data.count > 0
			? (data.sum / data.count).toFixed(2)
			: null;

    const optionLabelMap =
        q.options
            ? Object.fromEntries(q.options.map(o => [o.id, o.label]))
            : {};


</script>

<div class="rounded-xl border bg-white p-5 shadow-sm space-y-3">
	<div class="flex items-start justify-between gap-4">
	<h3 class="font-medium">
		{qid}. {q.prompt}
	</h3>

	<button
		type="button"
		on:click={copyMarkdown}
		class="shrink-0 text-xs rounded-md border px-2 py-1 text-slate-600 hover:bg-slate-100"
		title="Copy a Markdown summary suitable for pasting into an LLM or document"
	>
		{copied ? 'Copied ✓' : 'Copy Markdown'}
	</button>
</div>


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
        <!-- {#if topThemes.length}
            <p class="text-sm text-slate-700">
                <strong>Top themes:</strong>
                {#each topThemes as [word, count], i}
                    <span class="inline-block">
                        {word}
                        <span class="text-slate-500">({count})</span
                        >{i < topThemes.length - 1 ? ', ' : ''}
                    </span>
                {/each}
            </p>
        {/if} -->

		<details class="mt-2">
            <summary class="cursor-pointer text-sm">
	            Verbatim responses ({data.freeText.length})
            </summary>
			<ul class="mt-1 text-sm text-slate-700">
				{#each data.freeText as txt}
					<li>• {txt}</li>
				{/each}
			</ul>
		</details>
	{/if}
</div>
