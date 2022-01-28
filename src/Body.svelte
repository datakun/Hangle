<script>
	import { onMount } from 'svelte';
	import { tryIndex, letterBoxCount, letterCount } from './store/GameStore';
	import Hangul from 'hangul-js';

	/** @type {string[]} */
	export let answerList;

	onMount(() => {
		// 컴포넌트가 마운트되면 사이즈 설정
		const screenWidth = window.innerWidth;
		const width = screenWidth > 480 ? 480 - 60 : screenWidth - 60;
		const boxSize = width / 7;

		/** @type {HTMLCollectionOf<HTMLButtonElement>}*/
		const boxes = document.getElementsByClassName('box');
		for (const box of boxes) {
			box.style.width = `${boxSize}px`;
			box.style.height = `${boxSize}px`;
			box.style.lineHeight = `${boxSize}px`;
		}
	});
</script>

<div class="body" style="color: white;">
	{#each answerList as answer, i}
		<div id="line-{i}" class="row-container {$tryIndex === i ? 'current' : ''}">
			{#each new Array($letterBoxCount) as _, j}
				<div class="box line">{answer.substring(j, j + 1)}</div>
			{/each}
		</div>
	{/each}
	<div class="row-container" style="margin-top: 16px;">
		{#each new Array($letterCount) as _, i}
			<div class="box underline">{Hangul.a(answerList[$tryIndex]).substring(i, i + 1)}</div>
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

	.row-container {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.underline {
		margin-left: 4px !important;
		margin-right: 4px !important;
		border-bottom: solid 4px rgb(58, 58, 58);
	}

	.line {
		border: solid 2px rgb(58, 58, 58);
	}

	.box {
		margin: 2px;
		display: flex;
		justify-content: center;
		font-size: 2.5em;
	}
</style>
