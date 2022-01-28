export async function searchWord(word) {
	try {
		const url = `https://stdict.korean.go.kr/api/search.do?&key=80E105230FCD3224499425D80C5B6037&req_type=json&type_search=search&q=${word}`;

		// fetch get request
		const response = await fetch(encodeURI(url), {
			method: 'GET',
			mode: 'no-cors',
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
		});
		const json = await response.json();
		console.log(json);

		return json;
	} catch (error) {
		console.error(error);
	}

	return null;
}
