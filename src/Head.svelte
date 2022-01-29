<script>
	import { onMount } from 'svelte/internal';
	import { LETTER_BOX_COUNT, MIN_SCREEN_WIDTH } from './Environment';

	let boxSize = 0;

	onMount(() => {
		const screenWidth = window.innerWidth;
		const containerWidth = screenWidth > MIN_SCREEN_WIDTH ? MIN_SCREEN_WIDTH - 60 : screenWidth - 60;
		boxSize = containerWidth / 10;
	});

	const handleHelpClick = () => {
		const container = document.querySelector('.how-to-play');
		container.classList.add('open');

		container.querySelectorAll('.how-to-play .flipper').forEach((element) => {
			element.style.display = 'block';
		});

		container.querySelectorAll('.how-to-play .flipper .box').forEach((element) => {
			element.classList.add('flip');
		});
	};

	const handleLeaderboardClick = () => {
		// TODO:
	};

	const handleSettingsClick = () => {
		// TODO:
	};

	const handleCloseClick = () => {
		const container = document.querySelector('.how-to-play');
		container.classList.remove('open');

		container.querySelectorAll('.how-to-play .flipper').forEach((element) => {
			element.style.display = 'none';
		});

		container.querySelectorAll('.how-to-play .flipper .box').forEach((element) => {
			element.classList.remove('flip');
		});
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
<div class="how-to-play">
	<div class="container">
		<div class="head-button" title="Close" on:click={handleCloseClick}>
			<span class="material-icons">clear</span>
		</div>
		<div class="title">게임 방법</div>
		<p>6 번의 시도에서 한글 단어를 맞춰보세요.</p>
		<p>각 추측은 유효한 6 글자 단어여야 합니다.</p>
		<p>확인 버튼을 눌러 단어를 제출하세요.</p>
		<p>각 추측 후에 타일의 색상이 변경되어 정답 단어에 얼마나 가까웠는지 보여줍니다.</p>
		<hr />
		<p>예시</p>
		<div id="line" class="flip-container">
			{#each new Array(LETTER_BOX_COUNT) as _, j}
				<div class="flipper" style="width: {boxSize}px; height: {boxSize}px; line-height: {boxSize}px;">
					<div class="box letter-{j} border front {j === 0 ? 'correct' : ''}">{'ㅌㅗㅣㄱㅡㄴ'.substring(j, j + 1)}</div>
					<div class="box letter-{j} border back {j === 0 ? 'correct' : ''}">{'ㅌㅗㅣㄱㅡㄴ'.substring(j, j + 1)}</div>
				</div>
			{/each}
		</div>
		<p>자음 'ㅌ'은 단어에 포함되어있고 위치까지 맞습니다.</p>
		<div class="example-2" />
		<p>모음 'ㅡ'는 단어에 포함되어있지만 위치는 틀렸습니다.</p>
		<div class="example-3" />
		<p>자음 'ㅇ'은 단어에 포함되지 않습니다.</p>
		<hr />
		<p>매일 새로운 한:글 문제를 맞출 수 있습니다.</p>
	</div>
</div>

<style>
	.head {
		padding-top: 8px;
		padding-bottom: 8px;
		height: 48px;
		display: flex;
		justify-content: space-between;
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
		border-color: rgb(58, 58, 58);
	}

	.head-button {
		display: flex;
		align-items: center;
		padding: 4px;
		cursor: pointer;
	}

	.how-to-play {
		visibility: hidden;
		position: absolute;
		left: 0;
		top: 0;
		width: 100vw;
		height: 100vh;
		display: flex;
		justify-content: center;
		z-index: 3;

		background-color: rgb(18, 18, 18);
	}

	.how-to-play.open {
		visibility: visible;
	}

	.how-to-play .container {
		padding: 8px;
		max-width: 460px;
	}

	.how-to-play .container .head-button {
		justify-content: end;
		color: rgb(130, 130, 130);
	}

	.how-to-play .title {
		align-self: center;
		text-align: center;
		font-size: 2em;
		font-weight: 800;
		letter-spacing: 3px;
	}

	.how-to-play p {
		word-break: keep-all;
	}

	.how-to-play .box {
		width: 100%;
		height: 100%;
		margin: 2px;
		display: flex;
		justify-content: center;
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
</style>
