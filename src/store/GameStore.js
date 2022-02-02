import { writable } from 'svelte/store';
import { ValidateType } from '../Environment';

// 현재 시도를 저장
export const gameState = writable({
	tryIndex: 0, // 0 ~ 5.
	answerList: ['', '', '', '', '', ''], // [ㅈㅓㅇㄷㅏㅂ, ...]
	answer: '', // 정답
	isFinished: false, // 게임 종료 여부
	validateType: ValidateType.None, // 검증 작업 진행 여부
});

export const snackbarMessage = writable('');
