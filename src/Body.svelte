<script>
	import { onMount } from 'svelte';
	import { gameState } from './store/GameStore';
	import { LETTER_BOX_COUNT } from './Environment';
	import Hangul from 'hangul-js';

	let answerList;
	let answer;
	let tryIndex;

	let containerWidth = 0;
	let boxSize = 0;

	gameState.subscribe((value) => {
		answerList = value.answerList;
		answer = value.answer;
		tryIndex = value.tryIndex;
	});

	onMount(() => {
		const screenWidth = window.innerWidth;
		containerWidth = screenWidth > 480 ? 480 - 60 : screenWidth - 60;
		boxSize = containerWidth / 7;
	});
</script>

<div class="body">
	{#each answerList as _answer, i}
		<!-- <div id="line-{i}" class="flip-container {tryIndex === i ? 'current' : ''}" style="width: {containerWidth}px"> -->
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
		border-bottom: solid 4px rgb(58, 58, 58);
	}

	.box {
		width: 100%;
		height: 100%;
		margin: 2px;
		display: flex;
		justify-content: center;
	}

	.word-container .box {
		font-size: 2.5em;
	}

	.flip-container .box {
		font-size: 2em;
	}

	.border {
		border: solid 2px rgb(58, 58, 58);
	}

	.flip-container {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-self: center;
	}

	.flipper {
		margin: 4px;

		position: relative;
		transform-style: preserve-3d;
	}

	.flipper .box {
		position: absolute;
		backface-visibility: hidden;
		transition: 0.75s;
		perspective: 300px;
	}

	.flipper .box.front {
		transform: rotateX(0deg);

		z-index: 2;
	}

	.flipper .box.back {
		transform: rotateX(180deg);
	}

	.flipper .box.front.flip {
		transform: rotateX(180deg);
	}

	.flipper .box.back.flip {
		transform: rotateX(0deg);
	}

	.flipper:hover .box.front {
		transform: rotateX(180deg);
	}

	.flipper:hover .box.back {
		transform: rotateX(0deg);
	}
</style>
