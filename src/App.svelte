<script>
	import Head from './Head.svelte';
	import Body from './Body.svelte';
	import Keyboard from './Keyboard.svelte';
	import { tryIndex, letterBoxCount, totalTryCount } from './store/GameStore';
	import { onDestroy, onMount } from 'svelte/internal';
	import { searchWord } from './WordChecker';

	/** @type {string[]} */
	let answerList = new Array($totalTryCount);
	for (let i = 0; i < $totalTryCount; i++) {
		answerList[i] = '';
	}

	let snackbarMessage = '';

	onMount(() => {
		// 애니메이션 종료 후 클래스를 제거하기 위해 이벤트 등록
		for (let i = 0; i < answerList.length; i++) {
			const rowContainer = document.getElementById(`line-${i}`);
			rowContainer.addEventListener('animationend', handleAnimationEnd, false);
		}
	});

	onDestroy(() => {
		// 컴포넌트가 파괴되면 이벤트 연결 해제
		for (let i = 0; i < answerList.length; i++) {
			const rowContainer = document.getElementById(`line-${i}`);
			rowContainer.removeEventListener('animationend', handleAnimationEnd, false);
		}
	});

	const runShakeAnimation = (index) => {
		const rowContainer = document.getElementById(`line-${index}`);
		rowContainer.classList.add('shake');
	};

	const showSnackbar = (message, timeout = 2000) => {
		snackbarMessage = message;
		const snackbar = document.getElementById('snackbar');
		snackbar.className = 'show';
		setTimeout(function () {
			snackbar.className = snackbar.className.replace('show', '');
		}, timeout);
	};

	const handleAnimationEnd = (e) => {
		if (e.type === 'animationend') {
			e.target.classList.remove('shake');
		}
	};

	const handleKeyInsert = async (e) => {
		const character = e.detail;
		if (character.length === 1) {
			// 한글 자음 모음 삽입
			if (character.match(/[ㄱ-ㅎㅏ-ㅣ]/)) {
				let currentAnswer = answerList[$tryIndex];
				if (currentAnswer.length < $letterBoxCount) {
					currentAnswer += character;
					const newAnswerList = [...answerList];
					newAnswerList[$tryIndex] = currentAnswer;
					answerList = newAnswerList;
				}
			}
		} else if (character === 'enter') {
			// 단어 검증
			const currentAnswer = answerList[$tryIndex];
			if (currentAnswer.length !== $letterBoxCount) {
				runShakeAnimation($tryIndex);
				showSnackbar('글자 수가 부족합니다.');

				return;
			}

			const result = await searchWord(currentAnswer);
			if (result === null) {
				// TODO: 사전에서 단어 검색. 특정 시간 동안 단어 시도할 수 있는 횟수를 제한한다.
				runShakeAnimation($tryIndex);
				showSnackbar('올바른 단어를 입력하세요.');

				return;
			}

			return;

			tryIndex.set($tryIndex + 1);
		} else if (character === 'backspace' || character === 'delete') {
			// 문자 삭제
			let currentAnswer = answerList[$tryIndex];
			if (currentAnswer.length > 0) {
				currentAnswer = currentAnswer.substring(0, currentAnswer.length - 1);
				const newAnswerList = [...answerList];
				newAnswerList[$tryIndex] = currentAnswer;
				answerList = newAnswerList;
			}
		}
	};
</script>

<main>
	<Head />
	<Body {answerList} />
	<Keyboard on:keyInsert={handleKeyInsert} />
	<div id="snackbar">{snackbarMessage}</div>
</main>

<style>
	main {
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		padding: px;
		margin: 0 auto;
	}

	@media (min-width: 480px) {
		main {
			max-width: 480px;
		}
	}
</style>
