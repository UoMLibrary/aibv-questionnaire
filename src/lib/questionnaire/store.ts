// src/lib/questionnaire/store.ts
import { browser } from '$app/environment';
import { writable, type Writable } from 'svelte/store';
import { questionnaire, type Question } from './questionnaire';

export type StoredAnswer = {
	value: string | string[] | number;
	otherText?: string;
	updatedAt: string; // ISO
};

export type QuizState = {
	version: 1;
	startedAt: string;
	lastSavedAt: string;
	answers: Record<string, StoredAnswer | undefined>;
};

const STORAGE_KEY = `${questionnaire.id}:state`;

function nowIso() {
	return new Date().toISOString();
}

function safeParse(json: string | null): QuizState | null {
	if (!json) return null;
	try {
		const parsed = JSON.parse(json);
		if (!parsed || parsed.version !== 1) return null;
		return parsed as QuizState;
	} catch {
		return null;
	}
}

function createInitial(): QuizState {
	const t = nowIso();
	return { version: 1, startedAt: t, lastSavedAt: t, answers: {} };
}

export function createPersistedQuizState(): Writable<QuizState> {
	const initial = createInitial();

	const initialValue: QuizState =
		browser
			? safeParse(localStorage.getItem(STORAGE_KEY)) ?? initial
			: initial;

	const store = writable<QuizState>(initialValue);

	// Autosave on every change
	if (browser) {
		store.subscribe((v) => {
			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(v));
			} catch {
				// ignore (storage full / disabled)
			}
		});
	}

	return store;
}


export const quizState = createPersistedQuizState();

export function setAnswer(
	questionId: string,
	value: StoredAnswer['value'],
	otherText?: string
) {
	quizState.update((s) => {
		const t = nowIso();
		s.answers[questionId] = { value, otherText, updatedAt: t };
		s.lastSavedAt = t;
		return s;
	});
}

export function clearAnswer(questionId: string) {
	quizState.update((s) => {
		const t = nowIso();
		delete s.answers[questionId];
		s.lastSavedAt = t;
		return s;
	});
}

export function resetAll() {
	quizState.set(createInitial());
}

export function allQuestions(): Question[] {
	return questionnaire.sections.flatMap((sec) => sec.questions);
}

export function isAnswered(q: Question, a?: StoredAnswer): boolean {
	if (!q.required) {
		// Optional questions count as "answered" only if they have a value
		if (!a) return false;
	}

	if (!a) return false;

	const v = a.value;

	switch (q.type) {
		case 'text': {
			return typeof v === 'string' && v.trim().length > 0;
		}
		case 'rating': {
			return typeof v === 'number' && v >= q.min && v <= q.max;
		}
		case 'single': {
			if (typeof v !== 'string' || v.length === 0) return false;
			if (q.allowOtherText && v === 'other') return (a.otherText ?? '').trim().length > 0;
			return true;
		}
		case 'multi': {
			if (!Array.isArray(v)) return false;
			const min = q.required ? (q.minSelect ?? 1) : 0;
			if (v.length < min) return false;
			if (q.allowOtherText && v.includes('other')) return (a.otherText ?? '').trim().length > 0;
			return true;
		}
	}
}

export function missingRequiredQuestions(state: QuizState): string[] {
	const missing: string[] = [];

	for (const section of questionnaire.sections) {
		for (const q of section.questions) {
			if (!q.required) continue;
			if (!state.answers[q.id]) {
				missing.push(q.id);
			}
		}
	}

	return missing;
}


export function progress(state: QuizState) {
	const qs = allQuestions();
	const required = qs.filter((q) => q.required !== false);
	const answeredRequired = required.filter((q) => isAnswered(q, state.answers[q.id]));
	const pct = required.length === 0 ? 0 : Math.round((answeredRequired.length / required.length) * 100);
	return { answered: answeredRequired.length, total: required.length, pct };
}
