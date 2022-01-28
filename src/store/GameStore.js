import { writable } from 'svelte/store';

// 정답을 저장
export const correctAnswer = writable('밝기');

// 형태소 수를 저장
export const letterBoxCount = writable(6);

// 글자 수를 저장
export const letterCount = writable(2);

// 주어진 시도 횟수를 저장
export const totalTryCount = writable(6);

// 현재 시도를 저장
export const tryIndex = writable(0);
