import Hangul from 'hangul-js';

/**
 * 사전에 있는 단어라면 true 를 반환한다.
 * @param {string} word
 * @returns {boolean}
 */
export async function searchWord(word) {
	try {
		const url = `https://stdict.korean.go.kr/api/search.do?&key=80E105230FCD3224499425D80C5B6037&req_type=json&type_search=search&q=${word}`;

		// fetch get request
		const response = await fetch(encodeURI(url), {
			method: 'GET',
			// mode: 'no-cors',
			// headers: {
			// 	'Access-Control-Allow-Origin': '*',
			// },
		});
		if (response.status === 200) {
			const json = await response.json();
			console.log(json);

			return json;
		} else {
			throw new Error(response.statusText);
		}
	} catch (error) {
		console.error(error);
	}

	return null;
}

/**
 * 문자 배열의 각 문자를 정답과 비교하여 결과 문자열 배열을 반환한다.
 * @param {string[]} letters
 * @returns {string[]}
 */
export async function validateLetters(letters) {
	const result = [];

	const correctAnswer = '양말';
	const correctLetters = Hangul.d(correctAnswer);
	for (let i = 0; i < letters.length; i++) {
		if (letters[i] === correctLetters[i]) {
			// correct 검사
			result[i] = 'correct';
		} else if (correctLetters.includes(letters[i])) {
			// contain 검사
			result[i] = 'contain';
		} else {
			// 그 외에는 not-contain
			result[i] = 'not-contain';
		}
	}

	return result;
}

/**
 * 단어의 형태소를 문자열 배열로 반환한다.
 * @returns {string[]}
 */
export async function getLetters() {
	return Hangul.d('양말');
	// try {
	// 	const url = `https://localhost:1337/api/words/1`;

	// 	// fetch get request
	// 	const response = await fetch(encodeURI(url), {
	// 		method: 'GET',
	// 	});
	// 	if (response.status === 200) {
	// 		const json = await response.json();
	// 		console.log(json);

	// 		return json;
	// 	} else {
	// 		throw new Error(response.statusText);
	// 	}
	// } catch (error) {
	// 	console.error(error);
	// }

	// return null;
}
