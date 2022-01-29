<script>
	let isOpenHowToPlay = false;

	const handleHelpClick = () => {
		isOpenHowToPlay = !isOpenHowToPlay;
	};

	const handleLeaderboardClick = () => {
		// TODO:
	};

	const handleSettingsClick = () => {
		// TODO:
	};

	const handleCloseClick = () => {
		isOpenHowToPlay = false;
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
<div class="how-to-play {isOpenHowToPlay === true ? 'open' : ''}">
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
		background-color: rgb(18, 18, 18);
	}

	.how-to-play .container {
		padding: 8px;
		max-width: 460px;
	}

	.how-to-play.open {
		visibility: visible;
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
</style>
