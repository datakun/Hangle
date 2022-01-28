import { KOREAN_SEARCH_KEY } from './Secrets';

export async function searchWord(word) {
	try {
		const url = `https://stdict.korean.go.kr/api/search.do?&key=${KOREAN_SEARCH_KEY}&req_type=json&q=${word}`;

		// fetch get request
		const response = await fetch(encodeURI(url), {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		const json = await response.json();
		alert(json);
		console.log(json);

		return json;
	} catch (error) {
		console.error(error);
	}

	return null;
}
