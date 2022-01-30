<script>
	import Head from './Head.svelte';
	import Body from './Body.svelte';
	import Keyboard from './Keyboard.svelte';
	import { gameState, snackbarMessage } from './store/GameStore';
	import Hangul from 'hangul-js';
	import { onDestroy, onMount } from 'svelte/internal';
	import { getLetters, searchWord } from './api/SearchApi';
	import { LETTER_BOX_COUNT, TOTAL_TRY_COUNT } from './Environment';
	import { showSnackbar } from './Utils';

	let answerList = ['', '', '', '', '', ''];
	let answer;
	let tryIndex;
	let isFinished;

	let totalGameState = {};

	const now = new Date();
	const nowDate = now.getFullYear() + '' + (now.getMonth() + 1) + '' + now.getDate();
	gameState.subscribe(async (value) => {
		answer = value.answer;
		tryIndex = value.tryIndex;
		isFinished = value.isFinished;

		totalGameState = {
			...totalGameState,
			[nowDate]: value,
		};
	});

	onMount(async () => {
		// local storage 에서 게임 상태 가져오기
		// answerList, answer, tryIndex, isFinished;
		let needInitialize = false;
		let state = localStorage.getItem('Hangle_gameState');
		let stateJson = {};
		if (state !== null) {
			// 저장된 게임 데이터가 있으면 가져오기
			stateJson = JSON.parse(state);

			if (stateJson[nowDate] === undefined) {
				// 지금 날짜의 게임 데이터가 없으면 새로 생성하기
				needInitialize = true;

				// 만약 이전 날짜 게임 데이터가 있으면 모두 종료상태로 변경
				const updateDateList = Object.keys(stateJson);
				for (let i = 0; i < updateDateList.length; i++) {
					const updateDate = updateDateList[i];
					if (updateDate < nowDate) {
						stateJson[updateDate].isFinished = true;
					}
				}
			}
		} else {
			// 저장된 게임 데이터가 없다면 새로 생성하기
			needInitialize = true;
		}

		if (needInitialize === true) {
			// 새로 생성이 필요하면 answer 초기화
			const correctAnswer = await getLetters();
			const answer = Hangul.a(correctAnswer);

			stateJson = {
				...stateJson,
				[nowDate]: {
					tryIndex: 0, // 0 ~ 6. 6 은 실패를 의미한다.
					answerList: ['', '', '', '', '', ''], // [ㅈㅓㅇㄷㅏㅂ, ...]
					answer: answer, // 정답
					isFinished: false,
				},
			};

			// 새로 생성된 게임 데이터를 local storage 에 저장한다.
			localStorage.setItem('Hangle_gameState', JSON.stringify(stateJson));
		}

		answerList = stateJson[nowDate].answerList;

		totalGameState = stateJson;

		// store 저장
		gameState.set(stateJson[nowDate]);

		// 애니메이션 종료 후 클래스를 제거하기 위해 이벤트 등록
		for (let i = 0; i < TOTAL_TRY_COUNT; i++) {
			const rowContainer = document.getElementById(`line-${i}`);
			rowContainer?.addEventListener('animationend', handleShakeAnimationEnd, false);
		}

		// 이전에 입력한 답의 애니메이션 수행
		try {
			let result = false;
			for (let i = 0; i <= tryIndex; i++) {
				if (answerList[i] !== '' && answerList[i].length === LETTER_BOX_COUNT) {
					result = validateAnswer(i);
				}
			}

			if (tryIndex >= TOTAL_TRY_COUNT - 1 && result === false) {
				showSnackbar(`${answer}\n[${Hangul.d(answer).join(',')}]`);
			}
		} catch (error) {
			showSnackbar(error.message);
		}
	});

	onDestroy(() => {
		// 컴포넌트가 파괴되면 이벤트 연결 해제
		for (let i = 0; i < TOTAL_TRY_COUNT; i++) {
			const rowContainer = document.getElementById(`line-${i}`);
			rowContainer.removeEventListener('animationend', handleShakeAnimationEnd, false);
		}
	});

	const runShakeAnimation = (index) => {
		const rowContainer = document.getElementById(`line-${index}`);
		rowContainer.classList.add('shake');
	};

	const handleShakeAnimationEnd = (e) => {
		if (e.type === 'animationend') {
			e.target.classList.remove('shake');
		}
	};

	const runFlipAnimation = (lineIndex, letterIndex, state) => {
		const rowContainer = document.getElementById(`line-${lineIndex}`);
		rowContainer.querySelectorAll(`.flipper .box.letter-${letterIndex}`).forEach((element) => {
			element.classList.add(state);
			element.classList.add('flip');
		});
	};

	/**
	 * 추측 가능 횟수 내에 정답을 맞추면 true 를 반환한다.
	 * @param {number} index
	 * @returns {boolean}
	 */
	const validateAnswer = (index) => {
		// 단어 검증
		const currentAnswer = answerList[index];
		if (currentAnswer.length !== LETTER_BOX_COUNT) {
			runShakeAnimation(index);

			throw new Error('글자 수가 부족합니다.');
		}

		// const word = Hangul.a(currentAnswer);
		// const result = await searchWord(word);
		// if (result === null) {
		// 	// TODO: 사전에서 단어 검색. 특정 시간 동안 단어 시도할 수 있는 횟수를 제한한다.
		// 	runShakeAnimation($gameState.tryIndex);
		// 	showSnackbar('올바른 단어를 입력하세요.');

		// 	return;
		// }

		const validateResult = new Array(currentAnswer.length);
		const correctLetters = Hangul.d(answer);
		for (let i = 0; i < currentAnswer.length; i++) {
			if (currentAnswer[i] === correctLetters[i]) {
				// correct
				validateResult[i] = 'correct';
			} else if (correctLetters.includes(currentAnswer[i])) {
				// contain
				validateResult[i] = 'contain';
			} else {
				// 그 외에는 not-contain
				validateResult[i] = 'not-contain';
			}
		}

		const lineIndex = index;
		let letterIndex = 0;
		const intervalId = setInterval(() => {
			runFlipAnimation(lineIndex, letterIndex, validateResult[letterIndex]);

			letterIndex++;

			if (letterIndex === LETTER_BOX_COUNT) {
				clearInterval(intervalId);
			}
		}, 300);

		if (validateResult.every((data) => data === 'correct')) {
			return true;
		} else {
			return false;
		}
	};

	const handleKeyInsert = async (e) => {
		if (tryIndex >= TOTAL_TRY_COUNT || isFinished === true) {
			// 시도 횟수를 초과하면 이벤트 처리 안 함
			return;
		}

		const character = e.detail;
		if (character.length === 1) {
			// 한글 자음 모음 삽입
			if (character.match(/[ㄱ-ㅎㅏ-ㅣ]/)) {
				let currentAnswer = answerList[tryIndex];
				if (currentAnswer.length < LETTER_BOX_COUNT) {
					currentAnswer += character;
					const newAnswerList = [...answerList];
					newAnswerList[tryIndex] = currentAnswer;
					answerList = newAnswerList;
				}
			}
		} else if (character === 'backspace' || character === 'delete') {
			// 문자 삭제
			let currentAnswer = answerList[tryIndex];
			if (currentAnswer.length > 0) {
				currentAnswer = currentAnswer.substring(0, currentAnswer.length - 1);
				const newAnswerList = [...answerList];
				newAnswerList[tryIndex] = currentAnswer;
				answerList = newAnswerList;
			}
		} else if (character === 'enter') {
			let result = false;
			try {
				// 정답 검증
				result = validateAnswer(tryIndex);
				if (result === true) {
					showSnackbar('정답입니다.');
				} else {
					if (tryIndex >= TOTAL_TRY_COUNT - 1) {
						// 추측 가능 횟수를 모두 사용하면 정답을 알려주고 게임 종료
						tryIndex = TOTAL_TRY_COUNT - 1;

						result = true;

						showSnackbar(`${answer}\n[${Hangul.d(answer).join(',')}]`);
					} else {
						tryIndex = tryIndex + 1;
					}
				}

				const newState = {
					...$gameState,
					answerList: answerList,
					tryIndex: tryIndex >= TOTAL_TRY_COUNT ? TOTAL_TRY_COUNT - 1 : tryIndex,
					isFinished: result,
				};
				gameState.set(newState);

				// 저장된 게임 데이터 가져와서 새로운 데이터를 추가한다.
				let state = localStorage.getItem('Hangle_gameState');
				let stateJson = JSON.parse(state);
				stateJson = {
					...stateJson,
					[nowDate]: newState,
				};

				// local storage 에 gameState 저장
				localStorage.setItem('Hangle_gameState', JSON.stringify(stateJson));
			} catch (error) {
				showSnackbar(error.message);
			}
		}
	};
</script>

<main>
	<Head {totalGameState} />
	<Body {answerList} />
	<Keyboard on:keyInsert={handleKeyInsert} />
	<div id="snackbar">{$snackbarMessage}</div>
</main>

<style>
	main {
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		margin: 0 auto;
	}

	@media (min-width: 480px) {
		main {
			max-width: 480px;
		}
	}
</style>
