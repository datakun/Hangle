<script>
	import Icon from 'svelte-icon';
	import Info from './images/help_outline.svg';
	import Leaderboard from './images/leaderboard.svg';
	import Settings from './images/settings.svg';

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
		<Icon data={Info} size="1.6em" />
	</div>
	<div class="title">HANGLE</div>
	<div class="right">
		<div class="head-button" title="Leaderboard" on:click={handleLeaderboardClick}>
			<Icon data={Leaderboard} size="1.6em" />
		</div>
		<div class="head-button" title="Settings" on:click={handleSettingsClick}>
			<Icon data={Settings} size="1.6em" />
		</div>
	</div>
</div>
<hr />

<style>
	.head {
		padding-top: 8px;
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
		font-weight: 900;
		letter-spacing: 2px;
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
		padding: 4px;
		cursor: pointer;
	}
</style>
