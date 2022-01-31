<script>
	import { onMount } from 'svelte/internal';
	import { LETTER_BOX_COUNT, MIN_SCREEN_WIDTH, TOTAL_TRY_COUNT } from './Environment';
	import { animate, getDateString, showSnackbar } from './Utils';
	import Hangul from 'hangul-js';
	import Switch from './Switch.svelte';

	export let totalGameState;

	let played = 0;
	let winCount = 0;
	let currentStreak = 0;
	let maxStreak = 0;
	let distribution = [0, 0, 0, 0, 0, 0];
	let distributionMode = 0;
	let todayTryIndex = -1;
	let isCorrect = false;
	let remainTime = '';

	let hardMode = false;
	let darkMode = true;
	let colorBlindMode = false;

	let shareText = '';

	let boxSize = 0;

	const now = new Date();
	const nowDate = getDateString(now);

	let settings = localStorage.getItem('Hangle_settings');
	let settingsJson = {};
	if (settings) {
		// 저장된 설정 데이터 가져오기
		settingsJson = JSON.parse(settings);
		hardMode = settingsJson.hardMode;
		darkMode = settingsJson.darkMode;
		colorBlindMode = settingsJson.colorBlindMode;
	} else {
		// 설정 데이터 없으면 기본값 설정
		settingsJson = {
			hardMode: false,
			darkMode: true,
			colorBlindMode: false,
		};

		if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
			settingsJson.darkMode = true;
		} else {
			settingsJson.darkMode = false;
		}

		hardMode = settingsJson.hardMode;
		darkMode = settingsJson.darkMode;
		colorBlindMode = settingsJson.colorBlindMode;

		// 설정 데이터 저장
		localStorage.setItem('Hangle_settings', JSON.stringify(settingsJson));

		// 사이트에 처음 접속했다면 help 화면 보여주기
		setTimeout(() => {
			handleHelpClick();
		}, 1000);
	}

	$: {
		// 설정 데이터 업데이트 되면 local storage 에 데이터 저장
		const settingsJson = {
			hardMode: hardMode,
			darkMode: darkMode,
			colorBlindMode: colorBlindMode,
		};

		localStorage.setItem('Hangle_settings', JSON.stringify(settingsJson));

		// 다크 테마 설정
		if (darkMode === true) {
			document.body.classList.add('dark-mode');
		} else {
			document.body.classList.remove('dark-mode');
		}

		// 색약 테마 설정
		if (colorBlindMode === true) {
			document.body.classList.add('color-blind-mode');
		} else {
			document.body.classList.remove('color-blind-mode');
		}
	}

	const calculateRemainTime = () => {
		// 매 초 내일까지 남은 시간 계산. HH:mm:ss
		let remainTimeInterval = setInterval(() => {
			const now = new Date();
			const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
			const diff = tomorrow - now;
			const sec = Math.floor(diff / 1000);
			const min = Math.floor(sec / 60);
			const hour = Math.floor(min / 60);
			const hour2 = hour % 24;
			const min2 = min % 60;
			const sec2 = sec % 60;
			remainTime = (hour2 < 10 ? '0' + hour2 : hour2) + ':' + (min2 < 10 ? '0' + min2 : min2) + ':' + (sec2 < 10 ? '0' + sec2 : sec2);
		}, 1000);
	};

	calculateRemainTime();

	// 통계 계산. totalGameState 가 변경되면 실행 됨.
	$: {
		const updateDateList = Object.keys(totalGameState);
		// 게임 횟수
		played = updateDateList.filter((date) => totalGameState[date].isFinished === true).length;
		// 승리 횟수
		winCount = 0;
		// 현재 연승 횟수
		currentStreak = -1;
		// 최대 연승 횟수
		maxStreak = 0;

		// 오늘 시도한 횟수 계산
		const todayGameState = totalGameState[nowDate];
		if (todayGameState !== undefined) {
			todayTryIndex = todayGameState.tryIndex;

			if (todayGameState.isFinished === true && Hangul.a(todayGameState.answerList[todayGameState.tryIndex]) === todayGameState.answer) {
				isCorrect = true;
			} else {
				isCorrect = false;
			}

			// 공유용 메시지 생성
			const correctLetters = Hangul.d(todayGameState.answer);
			shareText = `한:글 ${isCorrect === true ? todayTryIndex + 1 : 'X'}/${TOTAL_TRY_COUNT}\n`;
			for (let i = 0; i <= todayTryIndex; i++) {
				const currentAnswer = todayGameState.answerList[i];
				const validateResult = new Array(currentAnswer.length);
				for (let i = 0; i < currentAnswer.length; i++) {
					if (currentAnswer[i] === correctLetters[i]) {
						// correct
						validateResult[i] = '🟩';
					} else if (correctLetters.includes(currentAnswer[i])) {
						// contain
						validateResult[i] = '🟨';
					} else {
						// 그 외에는 not-contain
						validateResult[i] = '⬛';
					}
				}

				shareText += `\n`;
				for (let j = 0; j < validateResult.length; j++) {
					shareText += `${validateResult[j]}`;
				}
			}
			shareText += `\n`;
		}

		let isStreak = true;
		let tempStreakCount = 0;
		for (let i = updateDateList.length - 1; i >= 0; i--) {
			const updateDate = updateDateList[i];
			const gameState = totalGameState[updateDate];
			if (gameState.isFinished === true && Hangul.a(gameState.answerList[gameState.tryIndex]) === gameState.answer) {
				// 게임이 끝났고, 마지막으로 시도한 단어가 정답이면 승리 횟수 증가
				winCount++;

				// 분포 계산
				distribution[gameState.tryIndex] = distribution[gameState.tryIndex] + 1;

				// 최빈값 계산
				if (distributionMode < distribution[gameState.tryIndex]) {
					distributionMode = distribution[gameState.tryIndex];
				}

				// 연승 계산
				isStreak = true;

				if (isStreak === true) {
					tempStreakCount++;
				}

				if (maxStreak < tempStreakCount) {
					maxStreak = tempStreakCount;
				}
			} else {
				// 연승이 끝난 경우
				isStreak = false;

				// 현재 연승 설정
				if (currentStreak === -1) {
					currentStreak = tempStreakCount;
				}

				tempStreakCount = 0;
			}
		}

		if (currentStreak === -1 && isStreak === true) {
			// 현재 연승을 처음부터 유지하고 있는 경우
			currentStreak = tempStreakCount;
		}
	}

	onMount(() => {
		const screenWidth = window.innerWidth;
		const containerWidth = screenWidth > MIN_SCREEN_WIDTH ? MIN_SCREEN_WIDTH - 60 : screenWidth - 60;
		boxSize = containerWidth / 10;
	});

	const timing = (timeFraction) => {
		return timeFraction;
	};

	const handleHelpClick = () => {
		const container = document.querySelector('.how-to-play');
		container.classList.add('open');

		const draw = (progress) => {
			container.style.opacity = progress;

			if (parseInt(progress + '') === 1) {
				container.querySelectorAll('.how-to-play .flipper .box').forEach((element) => {
					element.classList.add('flip');
				});
			}
		};

		animate(timing, draw, 300);
	};

	const handleLeaderboardClick = () => {
		const container = document.querySelector('.leaderboard');
		container.classList.add('open');

		const draw = (progress) => {
			container.style.opacity = progress;
		};

		animate(timing, draw, 300);
	};

	const handleShareClick = () => {
		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
			// 모바일 기기는 Web Share API 먼저 사용
			if (navigator.share) {
				const shareData = {
					// title: '한:글',
					text: shareText,
					url: 'https://hangle.vercel.app/',
				};
				navigator.share(shareData).then(() => {
					showSnackbar('문제 풀이 결과를 공유합니다.');
				});
			} else if (navigator.clipboard) {
				navigator.clipboard.writeText(shareText).then(() => {
					showSnackbar('문제 풀이 결과가 클립보드에 복사되었습니다.');
				});
			} else {
				const tempElem = document.createElement('textarea');
				tempElem.value = shareText;
				document.body.appendChild(tempElem);

				tempElem.select();
				document.execCommand('copy');
				document.body.removeChild(tempElem);

				showSnackbar('문제 풀이 결과가 클립보드에 복사되었습니다.');
			}
		} else {
			// 그 외에는 Clipboard 사용
			if (navigator.clipboard) {
				navigator.clipboard.writeText(shareText).then(() => {
					showSnackbar('문제 풀이 결과가 클립보드에 복사되었습니다.');
				});
			} else {
				const tempElem = document.createElement('textarea');
				tempElem.value = shareText;
				document.body.appendChild(tempElem);

				tempElem.select();
				document.execCommand('copy');
				document.body.removeChild(tempElem);

				showSnackbar('문제 풀이 결과가 클립보드에 복사되었습니다.');
			}
		}
	};

	const handleSettingsClick = () => {
		const container = document.querySelector('.settings');
		container.classList.add('open');

		const draw = (progress) => {
			container.style.opacity = progress;
		};

		animate(timing, draw, 300);
	};

	const handleHowToPlayClose = () => {
		const container = document.querySelector('.how-to-play');

		const draw = (progress) => {
			container.style.opacity = 1.0 - progress;

			if (parseInt(progress + '') === 1) {
				container.classList.remove('open');

				container.querySelectorAll('.how-to-play .flipper .box').forEach((element) => {
					element.classList.remove('flip');
				});
			}
		};

		animate(timing, draw, 300);
	};

	const handleLeaderboardClose = () => {
		const container = document.querySelector('.leaderboard');

		const draw = (progress) => {
			container.style.opacity = 1.0 - progress;

			if (parseInt(progress + '') === 1) {
				container.classList.remove('open');
			}
		};

		animate(timing, draw, 300);
	};

	const handleSettingsClose = () => {
		const container = document.querySelector('.settings');

		const draw = (progress) => {
			container.style.opacity = 1.0 - progress;

			if (parseInt(progress + '') === 1) {
				container.classList.remove('open');
			}
		};

		animate(timing, draw, 300);
	};

	const handleHardModeClick = (e) => {
		if (hardMode === false && todayTryIndex > 0) {
			showSnackbar('난이도 변경은 첫 시도에만 가능합니다.');
		}
	};
</script>

<div class="head">
	<div class="head-button" title="How To Play" on:click={handleHelpClick}>
		<span class="material-icons">help</span>
	</div>
	<h1 class="title">한:글</h1>
	<div class="right">
		<div class="head-button" title="Leaderboard" on:click={handleLeaderboardClick}>
			<span class="material-icons">leaderboard</span>
		</div>
		<div class="head-button" title="Settings" on:click={handleSettingsClick}>
			<span class="material-icons"> settings </span>
		</div>
	</div>
</div>
<hr />
<div class="how-to-play head-container">
	<div class="container">
		<div style="display: flex; justify-content: end;">
			<div class="head-button" title="Close" style="display: block;" on:click={handleHowToPlayClose}>
				<span class="material-icons">clear</span>
			</div>
		</div>
		<div class="title">게임 방법</div>
		<p>여섯 시도 안에 <b>한:글</b> 단어를 맞춰보세요.</p>
		<p>각 추측은 유효한 6 글자 단어여야 합니다.</p>
		<p>확인 버튼을 눌러 단어를 제출하세요.</p>
		<p>각 추측 후에 타일의 색상이 변경되어 정답 단어에 얼마나 가까웠는지 보여줍니다.</p>
		<p>키보드 위의 밑줄(_) 개수는 정답 단어의 글자 수를 의미합니다.</p>
		<hr />
		<p><b>예시</b></p>
		<div class="flip-container">
			{#each new Array(LETTER_BOX_COUNT) as _, j}
				<div class="flipper" style="width: {boxSize}px; height: {boxSize}px; line-height: {boxSize}px;">
					<div class="box letter-{j} border front {j === 0 ? 'correct' : ''}">{'ㅌㅗㅣㄱㅡㄴ'.substring(j, j + 1)}</div>
					<div class="box letter-{j} border back {j === 0 ? 'correct' : ''}">{'ㅌㅗㅣㄱㅡㄴ'.substring(j, j + 1)}</div>
				</div>
			{/each}
		</div>
		<p>단어 <b>'퇴근'</b>에는 자음 'ㅌ'은 단어에 포함되어있고 위치까지 맞습니다.</p>
		<div class="flip-container">
			{#each new Array(LETTER_BOX_COUNT) as _, j}
				<div class="flipper" style="width: {boxSize}px; height: {boxSize}px; line-height: {boxSize}px;">
					<div class="box letter-{j} border front {j === 1 ? 'contain' : ''}">{'ㅎㅣㅁㄲㅓㅅ'.substring(j, j + 1)}</div>
					<div class="box letter-{j} border back {j === 1 ? 'contain' : ''}">{'ㅎㅣㅁㄲㅓㅅ'.substring(j, j + 1)}</div>
				</div>
			{/each}
		</div>
		<p>단어 <b>'힘껏'</b>에는 모음 'ㅣ'는 단어에 포함되어있지만 위치는 틀렸습니다.</p>
		<div class="flip-container">
			{#each new Array(LETTER_BOX_COUNT) as _, j}
				<div class="flipper" style="width: {boxSize}px; height: {boxSize}px; line-height: {boxSize}px;">
					<div class="box letter-{j} border front {j === 3 ? 'not-contain' : ''}">{'ㅇㅓㅂㅅㄷㅏ'.substring(j, j + 1)}</div>
					<div class="box letter-{j} border back {j === 3 ? 'not-contain' : ''}">{'ㅇㅓㅂㅅㄷㅏ'.substring(j, j + 1)}</div>
				</div>
			{/each}
		</div>
		<p>단어 <b>'없다'</b>에는 자음 'ㅅ'은 단어에 포함되지 않습니다.</p>
		<hr />
		<p><b>한:글</b>은 매일 새로운 문제를 제출합니다.</p>
		<p><b>한국어기초사전</b>에 등록된 단어를 문제로 제출합니다.</p>
	</div>
</div>
<div class="leaderboard head-container">
	<div class="container">
		<div style="display: flex; justify-content: end;">
			<div class="head-button" title="Close" style="display: block;" on:click={handleLeaderboardClose}>
				<span class="material-icons">clear</span>
			</div>
		</div>
		<div class="title">통계</div>
		<div style="padding: 16px; display: flex; flex-direction: row; justify-content: center;">
			<div class="score-container">
				<div class="score">{played}</div>
				<p class="sub-title">게임 횟수</p>
			</div>
			<div class="score-container">
				<div class="score">{winCount}</div>
				<p class="sub-title">맞춘 횟수</p>
			</div>
			<div class="score-container">
				<div class="score">{currentStreak}</div>
				<p class="sub-title">현재 연승 횟수</p>
			</div>
			<div class="score-container">
				<div class="score">{maxStreak}</div>
				<p class="sub-title">최대 연승 횟수</p>
			</div>
		</div>
		<div class="title">추측 성공 분포</div>
		{#if played > 0}
			<div style="padding: 16px; padding-left: 32px; padding-right: 32px; display: flex; flex-direction: column; justify-content: center;">
				{#each distribution as item, i}
					<div style="display: flex; margin: 3px; height: 20px; line-height: 16px;">
						{i}
						<div
							class="bar"
							style="background-color: {isCorrect === true && todayTryIndex === i ? 'rgb(97, 140, 85)' : 'rgb(58, 58, 58)'}; width: {item === 0
								? '4'
								: (item / distributionMode) * 100}%; "
						>
							{item}
						</div>
					</div>
				{/each}
			</div>
			{#if totalGameState[nowDate].isFinished === true}
				<div style="display: flex; justify-content: center;">
					<div class="bottom-container">
						<div style="font-size: 1.25em; width: 140px;">다음 한:글</div>
						<div style="font-size: 2em; width: 140px;">{remainTime}</div>
					</div>
					<hr class="vertical" style="height: 80px;" />
					<div class="bottom-container">
						<div class="share-button" style="width: 120px; cursor: pointer;" on:click={handleShareClick}>
							공유 <span class="material-icons" style="font-size: 20px;">share</span>
						</div>
					</div>
				</div>
			{/if}
		{:else}
			<p style="text-align: center;">데이터 없음.</p>
		{/if}
	</div>
</div>
<div class="settings head-container">
	<div class="container">
		<div style="display: flex; justify-content: end;">
			<div class="head-button" title="Close" style="display: block;" on:click={handleSettingsClose}>
				<span class="material-icons">clear</span>
			</div>
		</div>
		<div class="title">설정</div>
		<div class="setting-container">
			<div>
				<div class="sub-title">난이도 어려움</div>
				<div class="description">공개된 힌트를 다음 추측 때 반드시 사용해야 합니다.</div>
			</div>
			<Switch bind:checked={hardMode} disabled={hardMode === false && todayTryIndex > 0} on:click={handleHardModeClick} />
		</div>
		<hr style="margin-top: 8px; margin-bottom: 8px;" />
		<div class="setting-container">
			<div>
				<div class="sub-title">어두운 테마</div>
				<div class="description">어두운 색상 테마를 적용합니다.</div>
			</div>
			<Switch bind:checked={darkMode} />
		</div>
		<hr style="margin-top: 8px; margin-bottom: 8px;" />
		<div class="setting-container">
			<div>
				<div class="sub-title">색약 모드</div>
				<div class="description">고대비 색상 테마를 적용합니다.</div>
			</div>
			<Switch bind:checked={colorBlindMode} />
		</div>
		<hr style="margin-top: 8px; margin-bottom: 8px;" />
		<div class="setting-container">
			<div>
				<div class="sub-title">의견</div>
			</div>
			<div style="display: flex; ">
				<a href="mailto:kimdatagoon@gmail.com" style="margin-right: 4px;">Email</a>
				/
				<a href="https://twitter.com/intent/tweet?screen_name=dnt_knw_whr_i_m" style="margin-left: 4px;">Twitter</a>
			</div>
		</div>
		<hr style="margin-top: 8px; margin-bottom: 8px;" />
	</div>
</div>

<style>
	.head {
		padding-top: 8px;
		padding-bottom: 8px;
		height: 48px;
		display: flex;
		justify-content: space-between;

		-ms-user-select: none;
		-moz-user-select: none;
		-webkit-user-select: none;
		user-select: none;
	}

	.head .title {
		position: sticky;
		left: 50%;
		transform: translate(-50%);
		align-self: center;
		text-align: center;
		font-size: 2.3em;
		font-weight: 800;
		letter-spacing: 3px;
	}

	.right {
		display: flex;
		flex-direction: row;
	}

	hr {
		margin: 0px;
	}

	hr.vertical {
		border: none;
		border-left: 1px solid hsla(200, 10%, 50%, 100);
		width: 1px;
	}

	.head-button {
		display: flex;
		align-items: center;
		padding: 4px;
		cursor: pointer;
	}

	.head-container {
		display: none;
		opacity: 0;
		position: absolute;
		left: 0;
		top: 0;
		width: 100vw;
		height: 100vh;
		justify-content: center;
		z-index: 3;
	}

	.head-container.open {
		display: flex;
	}

	.head-container .container {
		padding: 8px;
		max-width: 460px;
		width: 100%;
	}

	.head-container .container .head-button {
		justify-content: end;
	}

	.head-container .title {
		align-self: center;
		text-align: center;
		font-size: 2em;
		font-weight: 800;
		letter-spacing: 3px;
	}

	.head-container p {
		word-break: keep-all;
	}

	.how-to-play .box {
		width: 100%;
		height: 100%;
		margin: 2px;
		display: flex;
		justify-content: center;

		-ms-user-select: none;
		-moz-user-select: none;
		-webkit-user-select: none;
		user-select: none;
	}

	.how-to-play .border {
		border: solid 2px rgb(58, 58, 58);
	}

	.how-to-play .flip-container {
		display: flex;
		flex-direction: row;
	}

	.how-to-play .flip-container .box {
		font-size: 1.5em;
	}

	.leaderboard .score-container {
		max-width: 24%;
		width: 24%;
		text-align: center;
	}

	.leaderboard .score {
		font-size: 2em;
	}

	.leaderboard .sub-title {
		margin: 0px;
	}

	.leaderboard .bar {
		margin-left: 4px;
		padding-right: 8px;
		height: 22px;
		line-height: 20px;
		text-align: end;

		color: white;
	}

	.leaderboard .bottom-container {
		width: 48%;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.share-button {
		text-align: center;
		height: 32px;
		line-height: 32px;
		font-size: 24px;
		font-weight: 700;
		padding: 10px;
		border-radius: 4px;

		-ms-user-select: none;
		-moz-user-select: none;
		-webkit-user-select: none;
		user-select: none;

		color: white;
	}

	.settings .setting-container {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.settings div {
		word-break: keep-all;
	}

	.settings .sub-title {
		font-size: 1.25em;
	}

	.settings .description {
		font-size: 0.75em;
	}

	.settings .setting-container a {
		color: rgb(130, 130, 130);
	}
</style>
