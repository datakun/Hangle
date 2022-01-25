<script>
	import { onDestroy, onMount } from 'svelte';
	import Icon from 'svelte-icon';
	import Delete from './images/backspace_white_24dp.svg';

	onMount(() => {
		const screenWidth = window.innerWidth;
		const width = screenWidth > 480 ? 480 - 60 : screenWidth - 60;
		const buttonWidth = width / 10;
		const buttonHeight = buttonWidth * 1.5;

		/** @type {HTMLCollectionOf<HTMLButtonElement>}*/
		const buttons = document.getElementsByClassName('button');
		for (const button of buttons) {
			button.addEventListener('click', handleKeyClick, false);
			button.style.width = `${buttonWidth}px`;
			button.style.height = `${buttonHeight}px`;
			button.style.lineHeight = `${buttonHeight}px`;
		}
	});

	const handleKeyClick = (e) => {
		// TODO:
		console.log(e.target.id);
	};

	onDestroy(() => {
		const buttons = document.getElementsByClassName('button');
		for (const button of buttons) {
			button.removeEventListener('click', handleKeyClick, false);
		}
	});
</script>

<div class="keyboard">
	<div class="row-container">
		<div id="key-Q" class="button">ㅃ</div>
		<div id="key-W" class="button">ㅉ</div>
		<div id="key-E" class="button">ㄸ</div>
		<div id="key-R" class="button">ㄲ</div>
		<div id="key-T" class="button">ㅆ</div>
		<div class="button empty" />
		<div class="button empty" />
		<div class="button empty" />
		<div id="key-O" class="button">ㅒ</div>
		<div id="key-P" class="button">ㅖ</div>
	</div>
	<div class="row-container">
		<div id="key-q" class="button">ㅂ</div>
		<div id="key-w" class="button">ㅈ</div>
		<div id="key-e" class="button">ㄷ</div>
		<div id="key-r" class="button">ㄱ</div>
		<div id="key-t" class="button">ㅅ</div>
		<div id="key-y" class="button">ㅛ</div>
		<div id="key-u" class="button">ㅕ</div>
		<div id="key-i" class="button">ㅑ</div>
		<div id="key-o" class="button">ㅐ</div>
		<div id="key-p" class="button">ㅔ</div>
	</div>
	<div class="row-container">
		<div id="key-a" class="button">ㅁ</div>
		<div id="key-s" class="button">ㄴ</div>
		<div id="key-d" class="button">ㅇ</div>
		<div id="key-f" class="button">ㄹ</div>
		<div id="key-g" class="button">ㅎ</div>
		<div id="key-h" class="button">ㅗ</div>
		<div id="key-j" class="button">ㅓ</div>
		<div id="key-k" class="button">ㅏ</div>
		<div id="key-l" class="button">ㅣ</div>
	</div>
	<div class="row-container">
		<div id="key-enter" class="button enter">ENTER</div>
		<div id="key-z" class="button">ㅋ</div>
		<div id="key-x" class="button">ㅌ</div>
		<div id="key-c" class="button">ㅊ</div>
		<div id="key-v" class="button">ㅍ</div>
		<div id="key-b" class="button">ㅠ</div>
		<div id="key-n" class="button">ㅜ</div>
		<div id="key-m" class="button">ㅡ</div>
		<div id="key-delete" class="button delete">
			<Icon data={Delete} color="white" style="height: 100%" />
		</div>
	</div>
</div>

<style>
	.keyboard {
		background-color: #0e0e0e;
		flex: 0 1;
		padding: 8px;
	}

	.row-container {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.button {
		display: flex;
		flex-direction: column;
		justify-items: center;
		align-items: center;
		margin: 3px;
		border-radius: 4px;
		color: rgb(220, 220, 220);
		background-color: rgb(130, 130, 130);
		font-weight: 700;
		font-size: 1.35em;
		cursor: pointer;
		text-align: center;
		user-select: none;
		-moz-user-select: none;
		-webkit-user-select: none;
	}

	.empty {
		visibility: hidden;
	}

	.enter {
		font-size: 0.85em;
		flex: 1;
	}

	.delete {
		flex: 1;
	}
</style>
