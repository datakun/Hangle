<script>
	import Head from './Head.svelte';
	import Body from './Body.svelte';
	import Keyboard from './Keyboard.svelte';
	import { gameState, snackbarMessage } from './store/GameStore';
	import Hangul from 'hangul-js';
	import { onDestroy, onMount } from 'svelte/internal';
	import { getTodayWord, isValidWord } from './api/SearchApi';
	import { ValidateResult, ValidateType, LETTER_BOX_COUNT, TOTAL_TRY_COUNT } from './Environment';
	import { animate, getDateString, showSnackbar } from './Utils';

	let answerList = ['', '', '', '', '', ''];
	let answer = '';
	let tryIndex = 0;
	let isFinished = false;

	let totalGameState = {};

	let validateResultList = [];

	const now = new Date();
	const nowDate = getDateString(now);

	onMount(async () => {
		gameState.subscribe(async (value) => {
			answer = value.answer;
			tryIndex = value.tryIndex;
			isFinished = value.isFinished;

			totalGameState = {
				...totalGameState,
				[nowDate]: value,
			};

			if (value.validateType === ValidateType.None) {
				return;
			}

			const isLastTry = tryIndex === TOTAL_TRY_COUNT - 1;

			// game state 가 변경되면 validate 수행 후 정답 알려줌.
			let result = ValidateResult.Incorrect;
			if (value.validateType === ValidateType.All) {
				// 모든 시도 검증
				for (let i = 0; i <= tryIndex; i++) {
					if (value.answerList[i] !== '' && value.answerList[i].length === LETTER_BOX_COUNT) {
						result = validateAnswer(i, value.answerList, value.answer);
					}
				}
			} else if (value.validateType === ValidateType.Current) {
				// 현재 시도만 검증
				result = validateAnswer(tryIndex, value.answerList, value.answer);
			}

			// 마지막 검증 결과를 토대로 작업 수행.
			if (result === ValidateResult.NotEnoughLetters) {
				runShakeAnimation(tryIndex);

				showSnackbar('글자 수가 부족합니다.');

				return;
			} else if (result === ValidateResult.DifferentWordLength) {
				runShakeAnimation(tryIndex);

				showSnackbar('정답 단어와 글자 수가 다릅니다.');

				return;
			} else if (result === ValidateResult.NotExistWord) {
				runShakeAnimation(tryIndex);

				showSnackbar('사전에 없는 단어입니다.');

				return;
			} else if (result >= 0 && result <= 5) {
				runShakeAnimation(tryIndex);

				showSnackbar(`${result + 1} 번째 글자는 '${Hangul.d(answer).substring(result, result + 1)}'가 되어야 합니다.`);

				return;
			} else if (result === ValidateResult.Correct) {
				showSnackbar('정답입니다.');

				setTimeout(() => {
					let letterIndex = 0;
					const intervalId = setInterval(() => {
						// 튀어오르는 애니메이션
						const rowContainer = document.getElementById(`line-${tryIndex}`);
						rowContainer.querySelectorAll(`.flipper .box.letter-${letterIndex}`).forEach((element) => {
							element.classList.add('jump');
						});

						letterIndex++;

						if (letterIndex === LETTER_BOX_COUNT) {
							clearInterval(intervalId);

							setTimeout(() => {
								// 애니메이션을 실행하고나서 통계 표시
								const container = document.querySelector('.leaderboard');
								container.classList.add('open');

								const timing = (timeFraction) => {
									return timeFraction;
								};

								const draw = (progress) => {
									container.style.opacity = progress;
								};

								animate(timing, draw, 300);
							}, 600);
						}
					}, 200);
				}, 1800);
			} else if (result === ValidateResult.Incorrect) {
				if (isFinished === true && isLastTry === true) {
					// 정답을 맞추지 못했는데, 시도 횟수가 초과되었을 때.
					showSnackbar(`${answer}\n[${Hangul.d(answer).join(',')}]`);
				}
			}

			updateKeyButtons(value.answerList, value.answer);

			// 정답이거나 오답일 때만 게임 데이터 업데이트
			let newTryIndex = tryIndex;
			let newIsFinished = isFinished;
			// 현재 시도만 검증하는 경우
			if (value.validateType === ValidateType.Current) {
				// 오답일 경우 새로운 시도 횟수를 설정함.
				if (result === ValidateResult.Incorrect) {
					newTryIndex = tryIndex + 1 > TOTAL_TRY_COUNT - 1 ? TOTAL_TRY_COUNT - 1 : tryIndex + 1;
				}

				// 정답이거나, 오답인데 마지막 시도인 경우 종료 여부를 설정함.
				if (result === ValidateResult.Correct || (result === ValidateResult.Incorrect && isLastTry === true)) {
					newIsFinished = true;
				}
			}

			answerList = value.answerList;

			const newState = {
				answerList: answerList, // [ㅈㅓㅇㄷㅏㅂ, ...]
				answer: answer, // 정답
				tryIndex: newTryIndex,
				isFinished: newIsFinished,
			};

			// 검증 작업 끝나고 나면 게임 데이터 저장
			let state = localStorage.getItem('Hangle_gameState');
			let stateJson = JSON.parse(state);
			stateJson = {
				...stateJson,
				[nowDate]: newState,
			};

			// local storage 에 gameState 저장
			localStorage.setItem('Hangle_gameState', JSON.stringify(stateJson));

			newState.validateType = ValidateType.None;
			gameState.set(newState);
		});

		// local storage 에서 게임 상태 가져오기
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
			const correctAnswer = await getTodayWord();
			if (correctAnswer === null) {
				return;
			}

			const answer = Hangul.a(correctAnswer);

			stateJson = {
				...stateJson,
				[nowDate]: {
					answerList: ['', '', '', '', '', ''], // [ㅈㅓㅇㄷㅏㅂ, ...]
					answer: answer, // 정답
					tryIndex: 0, // 0 ~ 5.
					isFinished: false,
				},
			};

			// 새로 생성된 게임 데이터를 local storage 에 저장한다.
			localStorage.setItem('Hangle_gameState', JSON.stringify(stateJson));
		}

		totalGameState = stateJson;

		// store 저장
		const currentGameState = {
			...stateJson[nowDate],
			validateType: needInitialize === false && stateJson[nowDate].tryIndex > 0 ? ValidateType.All : ValidateType.None, // 처음 마운트 됐을때는 초기화 하지 않았다면 모든 시도 검증, 초기화 했다면 검증 안 함
		};
		gameState.set(currentGameState);

		// 애니메이션 종료 후 클래스를 제거하기 위해 이벤트 등록
		for (let i = 0; i < TOTAL_TRY_COUNT; i++) {
			const rowContainer = document.getElementById(`line-${i}`);
			rowContainer?.addEventListener('animationend', handleShakeAnimationEnd, false);
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
	 * 입력된 answerList 에 따라 키보드의 색상을 변경한다.
	 * @param {string[]} answerList 추측 목록
	 * @param {string} answer 정답
	 */
	const updateKeyButtons = (answerList, answer) => {
		const keyboard = document.querySelector('.keyboard');
		if (!keyboard) {
			return;
		}

		const correctAnswerLetters = Hangul.d(answer);
		for (const button of keyboard.querySelectorAll('.button.key')) {
			if (button.innerText.length > 1) {
				continue;
			}

			for (const userAnswer of answerList) {
				const userAnswerLetters = Hangul.d(userAnswer);
				for (let i = 0; i < userAnswerLetters.length; i++) {
					if (userAnswerLetters[i] !== button.innerText) {
						continue;
					}

					// 추측한 단어 목록에서 현재 키가 포함되어있으면 색상이 바뀔 자격이 됨.
					if (correctAnswerLetters[i] === button.innerText) {
						// 정답 단어의 글자 위치와 같은 경우
						if (button.classList.contains('contain') === true) {
							// contain 상태일 경우, 기존 상태를 제거하고 correct 상태를 추가한다.
							button.classList.remove('contain');
						}
						button.classList.add('correct');
					} else if (correctAnswerLetters.includes(button.innerText)) {
						// 정답 단어에 글자가 포함된 경우
						if (button.classList.contains('correct') === false) {
							// correct 상태가 아닐 경우에만 contain 상태를 추가한다.
							button.classList.add('contain');
						}
					} else {
						// 정답 단어에 글자가 포함되지 않은 경우
						button.classList.add('not-contain');
					}
				}
			}
		}
	};

	/**
	 * index 째의 추측 결과를 숫자로 반환한다.
	 * -1: 정답. -2: 정답이 아님. -3: 글자 수 부족. -4: 정답 단어와 글자수가 다름. -5: 사전에 없는 단어.
	 * 0 ~ 5: 하드 모드 일때 몇 번째 글자가 제 자리가 아닌지 반환한다.
	 * @param {number} index
	 * @param {string[]} answerList
	 * @param {string} correctAnswer
	 * @returns {ValidateResult}
	 */
	const validateAnswer = (index, answerList, correctAnswer) => {
		const currentAnswer = answerList[index];
		const word = Hangul.a(currentAnswer);

		// 글자 수 검증
		if (currentAnswer.length !== LETTER_BOX_COUNT) {
			return ValidateResult.NotEnoughLetters;
		}

		// 하드 모드
		let settings = localStorage.getItem('Hangle_settings');
		if (settings) {
			const settingsJson = JSON.parse(settings);
			if (settingsJson.hardMode === true) {
				for (let i = 0; i < index; i++) {
					if (validateResultList[i] !== undefined) {
						for (let j = 0; j < LETTER_BOX_COUNT; j++) {
							if (validateResultList[i][j] === 'correct') {
								if (currentAnswer.substring(j, j + 1) !== answerList[i].substring(j, j + 1)) {
									return j;
								}
							}
						}
					}
				}
			}
		}

		// NOTE: 추측을 위해서 이 조건은 주석처리하는게 나을까?
		// if (word.length != answer.length) {
		// 	return ValidateResult.DifferentWordLength;
		// }

		// 사전에 있는 단어인지 확인
		if (isValidWord(word) === false) {
			return ValidateResult.NotExistWord;
		}

		const validateResult = new Array(currentAnswer.length);
		const correctLetters = Hangul.d(correctAnswer);
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

		// 하드 모드를 위해서 검증 결과를 저장
		validateResultList[index] = validateResult;

		// 플립 애니메이션 수행
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
			return ValidateResult.Correct;
		} else {
			return ValidateResult.Incorrect;
		}
	};

	const handleKeyInsert = async (e) => {
		if (tryIndex >= TOTAL_TRY_COUNT || isFinished === true) {
			// 시도 횟수를 초과하면 이벤트 처리 안 함
			return;
		}

		const input = e.detail;
		if (input.length === 1) {
			// 한글 자음 모음 삽입
			if (input.match(/[ㄱ-ㅎㅏ-ㅣ]/)) {
				// 한글을 입력 받았을 때
				let currentAnswer = answerList[tryIndex];
				if (currentAnswer.length < LETTER_BOX_COUNT) {
					currentAnswer += input;
					const newAnswerList = [...answerList];
					newAnswerList[tryIndex] = currentAnswer;
					answerList = newAnswerList;
				}
			}
		} else if (input === 'backspace' || input === 'delete') {
			// 문자 삭제
			let currentAnswer = answerList[tryIndex];
			if (currentAnswer.length > 0) {
				currentAnswer = currentAnswer.substring(0, currentAnswer.length - 1);
				const newAnswerList = [...answerList];
				newAnswerList[tryIndex] = currentAnswer;
				answerList = newAnswerList;
			}
		} else if (input === 'enter' || input === '확인') {
			// game state 를 업데이트하면 정답을 검증 함.
			// 페이지를 다시 로드 했을때 같은 로직을 수행할 수 있도록 하기 위해 이렇게 설정
			// 저장된 게임 데이터 가져와서 새로운 데이터를 추가한다.
			const newState = {
				...$gameState,
				answerList: answerList,
				validateType: ValidateType.Current,
			};
			gameState.set(newState);
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
