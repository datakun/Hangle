export const MIN_SCREEN_WIDTH = 480;
export const LETTER_BOX_COUNT = 6;
export const TOTAL_TRY_COUNT = 6;
export const STARTED_DATE = '2022-02-01';
export const FIREBASE_CONFIG = {
	apiKey: 'AIzaSyD0M3JbqxZk8au--8Efwgke9plv4GR-4Bc',
	authDomain: 'hangle-5db1b.firebaseapp.com',
	projectId: 'hangle-5db1b',
	storageBucket: 'hangle-5db1b.appspot.com',
	messagingSenderId: '851830293451',
	appId: '1:851830293451:web:2a90389b8f9635ac736c4e',
	measurementId: 'G-3SB31VVPV5',
};

/**
 * 검증 결과
 * @readonly
 * @enum {number}
 */
export const ValidateResult = {
	Correct: -1, // 정답
	Incorrect: -2, // 오답
	NotEnoughLetters: -3, // 글자 수가 부족함
	DifferentWordLength: -4, // 단어의 길이가 다름
	NotExistWord: -5, // 단어가 존재하지 않음
};

/**
 * 검증 타입
 * @readonly
 * @enum {string}
 */
export const ValidateType = {
	All: 'All', // 모든 시도 검증
	Current: 'Current', // 현재 시도만 검증
	None: 'None', // 검증 안 함
};
