// src/lib/questionnaire/export.ts
import type { QuizState } from './store';
import { questionnaire } from './questionnaire';

export function exportSubmission(state: QuizState) {
	const payload = {
		questionnaireId: questionnaire.id,
		submittedAt: new Date().toISOString(),
		answers: state.answers
	};

	const blob = new Blob([JSON.stringify(payload, null, 2)], {
		type: 'application/json'
	});

	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = `questionnaire-submission-${Date.now()}.json`;
	a.click();

	URL.revokeObjectURL(url);
}
