<script>
	import { onMount } from 'svelte';
	import { gameState } from './store/GameStore';
	import { LETTER_BOX_COUNT, MIN_SCREEN_WIDTH } from './Environment';
	import Hangul from 'hangul-js';

	let answerList;
	let answer;
	let tryIndex;

	let boxSize = 0;

	gameState.subscribe((value) => {
		answerList = value.answerList;
		answer = value.answer;
		tryIndex = value.tryIndex;
	});

	onMount(() => {
		const screenWidth = window.innerWidth;
		const containerWidth = screenWidth > MIN_SCREEN_WIDTH ? MIN_SCREEN_WIDTH - 60 : screenWidth - 60;
		boxSize = containerWidth / 7;
	});
</script>

<div class="body">
	{#each answerList as _answer, i}
		<div id="line-{i}" class="flip-container {tryIndex === i ? 'current' : ''}">
			{#each new Array(LETTER_BOX_COUNT) as _, j}
				<div class="flipper" style="width: {boxSize}px; height: {boxSize}px; line-height: {boxSize}px;">
					<div class="box letter-{j} border front">{_answer.substring(j, j + 1)}</div>
					<div class="box letter-{j} border back">{_answer.substring(j, j + 1)}</div>
				</div>
			{/each}
		</div>
	{/each}
</div>
<div class="word-container">
	<div class="row-container" style="margin-top: 16px;">
		{#each new Array(answer.length) as _, i}
			<div class="box underline" style="padding-bottom: 8px; width: {boxSize}px; height: {boxSize}px;">{Hangul.a(answerList[tryIndex]).substring(i, i + 1)}</div>
		{/each}
	</div>
</div>

<style>
	.body {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.word-container {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
	}

	.row-container {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-self: center;
	}

	.underline {
		margin-left: 4px !important;
		margin-right: 4px !important;
	}

	.word-container .box {
		font-size: 2.5em;
	}

	.box {
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

	.border {
		border: rgb(22, 18, 18) d 2px rgb(58, 58, 58);
	}

	.flip-container {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-self: center;
	}

	.flip-container .box {
		font-size: 2em;
		font-weight: bold;
	}
</style>
