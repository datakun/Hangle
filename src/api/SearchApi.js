import Hangul from 'hangul-js';
import { getDatabase, ref, onValue, get, child, Database } from 'firebase/database';
import { FIREBASE_CONFIG } from '../Environment';
import { initializeApp } from 'firebase/app';
import { getDateString } from '../Utils';

// import words from './words';
import valids from './Valids';

const fbApp = initializeApp(FIREBASE_CONFIG);

/**
 * 단어의 자음 모을을 문자열 배열로 반환한다.
 * @returns {string[]}
 */
export async function getTodayWord() {
	const now = new Date();
	const nowDate = getDateString(now);

	const dbRef = ref(getDatabase(fbApp, 'https://hangle-5db1b-default-rtdb.asia-southeast1.firebasedatabase.app'));
	try {
		const snapshot = await get(child(dbRef, `words/${nowDate}`));
		if (snapshot.exists()) {
			return Hangul.d(snapshot.val());
		} else {
			console.log('No data available:', nowDate);
		}
	} catch (error) {
		console.error(error);
	}

	return null;
}

export function isValidWord(word) {
	if (valids.indexOf(word) !== -1) {
		return true;
	}

	return false;
}

// export function parseAndCreateWords() {
// 	const now = new Date();
// 	let nowDate = getDateString(now);

// 	const useWordList = [];

// 	const letterListSet = new Set();
// 	const wordSet = new Set();
// 	const wordList = words;
// 	// wordList 섞기
// 	wordList.sort(() => Math.random() - 0.5);
// 	for (let i = 0, ilen = wordList.length; i < ilen; i++) {
// 		const word = wordList[i];
// 		if (Hangul.isCompleteAll(word) === false) {
// 			continue;
// 		}

// 		const disassembledWord = Hangul.d(word);
// 		if (disassembledWord.length !== 6) {
// 			continue;
// 		}

// 		if (wordSet.has(word) === false) {
// 			wordSet.add(word);
// 			letterListSet.add(disassembledWord);

// 			useWordList[nowDate] = word;

// 			useWordList.push({
// 				nowDate,
// 				word,
// 			});

// 			// nowDate 에서 하루 더한 후 yyyy-MM-dd 로 변경
// 			const date = new Date(nowDate);
// 			date.setDate(date.getDate() + 1);
// 			nowDate = date.getFullYear() + '-' + (date.getMonth() + 1 + '').padStart(2, '0') + '-' + (date.getDate() + '').padStart(2, '0');
// 		}
// 	}

// 	// 랜덤 숫자 배열 생성
// 	const shakeArray = [];
// 	for (let i = 0; i < useWordList.length; i++) {
// 		shakeArray.push(i);
// 	}
// 	for (let i = shakeArray.length - 1; i > 0; i--) {
// 		const j = Math.floor(Math.random() * (i + 1));
// 		[shakeArray[i], shakeArray[j]] = [shakeArray[j], shakeArray[i]];
// 	}

// 	const resultJson = {};
// 	for (let i = 0; i < shakeArray.length; i++) {
// 		const index = shakeArray[i];
// 		const json = useWordList[index];
// 		resultJson[json.nowDate] = json.word;
// 	}

// 	console.log([...wordSet]);
// 	console.log(resultJson);
// 	console.log(Object.keys(resultJson).length);
// }
