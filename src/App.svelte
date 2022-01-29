<script>
	import Head from './Head.svelte';
	import Body from './Body.svelte';
	import Keyboard from './Keyboard.svelte';
	import { gameState } from './store/GameStore';
	import Hangul from 'hangul-js';
	import { onDestroy, onMount } from 'svelte/internal';
	import { getLetters, searchWord } from './api/SearchApi';
	import { LETTER_BOX_COUNT, TOTAL_TRY_COUNT } from './Environment';

	let answerList;
	let answer;
	let tryIndex;

	let snackbarMessage = '';

	gameState.subscribe(async (value) => {
		answerList = value.answerList;
		answer = value.answer;
		tryIndex = value.tryIndex;
	});

	onMount(async () => {
		// 애니메이션 종료 후 클래스를 제거하기 위해 이벤트 등록
		for (let i = 0; i < TOTAL_TRY_COUNT; i++) {
			const rowContainer = document.getElementById(`line-${i}`);
			rowContainer.addEventListener('animationend', handleShakeAnimationEnd, false);
		}

		// local storage 에서 게임 상태 가져오기
		// answerList, answer, tryIndex, updateDate;
		const now = new Date();
		const nowDate = now.getFullYear() + '' + (now.getMonth() + 1) + '' + now.getDate();
		let needInitialize = false;
		let state = localStorage.getItem('Hangle_gameState');
		let stateJson = {};
		if (state !== null) {
			// 저장된 게임 데이터가 있으면 가져오기
			stateJson = JSON.parse(state);

			const updateDate = stateJson.updateDate;
			if (nowDate !== updateDate) {
				// 지금 날짜와 저장된 날짜가 다르면 새로 생성하기
				needInitialize = true;
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
				tryIndex: 0, // 0 ~ 6. 6 은 실패를 의미한다.
				answerList: ['', '', '', '', '', ''], // [ㅈㅓㅇㄷㅏㅂ, ...]
				answer: answer, // 정답
				updateDate: nowDate, // yyyyMMdd
			};

			// 새로 생성된 게임 데이터를 local storage 에 저장한다.
			localStorage.setItem('Hangle_gameState', JSON.stringify(stateJson));
		}

		// store 저장
		gameState.set(stateJson);
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

	const showSnackbar = (message, timeout = 3000) => {
		snackbarMessage = message;
		const snackbar = document.getElementById('snackbar');
		snackbar.className = 'show';
		setTimeout(function () {
			snackbar.className = snackbar.className.replace('show', '');
		}, 3500);
	};

	const runFlipAnimation = (lineIndex, letterIndex, state) => {
		const rowContainer = document.getElementById(`line-${lineIndex}`);
		rowContainer.querySelectorAll(`.flipper .box.letter-${letterIndex}`).forEach((element) => {
			element.classList.add(state);
			element.classList.add('flip');
		});
	};

	const handleKeyInsert = async (e) => {
		if (tryIndex >= TOTAL_TRY_COUNT) {
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
					gameState.set({
						...$gameState,
						answerList: newAnswerList,
					});
				}
			}
		} else if (character === 'backspace' || character === 'delete') {
			// 문자 삭제
			let currentAnswer = answerList[tryIndex];
			if (currentAnswer.length > 0) {
				currentAnswer = currentAnswer.substring(0, currentAnswer.length - 1);
				const newAnswerList = [...answerList];
				newAnswerList[tryIndex] = currentAnswer;
				gameState.set({
					...$gameState,
					answerList: newAnswerList,
				});
			}
		} else if (character === 'enter') {
			// 단어 검증
			const currentAnswer = answerList[tryIndex];
			if (currentAnswer.length !== LETTER_BOX_COUNT) {
				runShakeAnimation(tryIndex);
				showSnackbar('글자 수가 부족합니다.');

				return;
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

			const lineIndex = tryIndex;
			let letterIndex = 0;
			const intervalId = setInterval(() => {
				runFlipAnimation(lineIndex, letterIndex, validateResult[letterIndex]);

				letterIndex++;

				if (letterIndex === LETTER_BOX_COUNT) {
					clearInterval(intervalId);
				}
			}, 300);

			if (tryIndex < TOTAL_TRY_COUNT) {
				if (validateResult.every((data) => data === 'correct')) {
					// 추측 가능 횟수 내에 정답을 맞추면 게임 종료
					showSnackbar('정답입니다.');
				} else {
					// 정답을 못 맞추면 try index 증가
					gameState.set({
						...$gameState,
						tryIndex: tryIndex + 1,
					});
				}
			} else {
				// 추측 가능 횟수를 모두 사용하면 정답을 알려주고 게임 종료
				showSnackbar(`${$gameState.answer}\n[${correctLetters.join(',')}]`);
			}

			// 한 단어를 삽입 후 local storage 에 gameState 저장
			const stateJson = JSON.stringify($gameState);
			localStorage.setItem('Hangle_gameState', stateJson);
		}
	};
</script>

<main>
	<Head />
	<Body />
	<Keyboard on:keyInsert={handleKeyInsert} />
	<div id="snackbar">{snackbarMessage}</div>
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
