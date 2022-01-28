export async function searchWord(word) {
	try {
		const url = `https://stdict.korean.go.kr/api/search.do?&key=80E105230FCD3224499425D80C5B6037&req_type=json&q=${word}`;

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
