import { writable } from 'svelte/store';

// 현재 시도를 저장
export const gameState = writable({
	tryIndex: 0, // 0 ~ 6. 6 은 실패를 의미한다.
	answerList: ['', '', '', '', '', ''], // [ㅈㅓㅇㄷㅏㅂ, ...]
	answer: '', // 정답
	updateDate: '', // yyyyMMdd
	isFinished: false,
});

export const snackbarMessage = writable('');
