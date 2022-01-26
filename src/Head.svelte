<script>
	const handleHelpClick = () => {
		// TODO:
	};

	const handleLeaderboardClick = () => {
		// TODO:
	};

	const handleSettingsClick = () => {
		// TODO:
	};
</script>

<div class="head">
	<div class="head-button" title="How To Play" on:click={handleHelpClick}>
		<span class="material-icons">help</span>
	</div>
	<div class="title">HANGLE</div>
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

<style>
	.head {
		padding-top: 8px;
		padding-bottom: 8px;
		display: flex;
		justify-content: space-between;
		color: white;
	}

	.title {
		position: fixed;
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
</style>
