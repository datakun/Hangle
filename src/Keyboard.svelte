<script>
	import { onDestroy, onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';

	onMount(() => {
		// 컴포넌트가 마운트되면 버튼 이벤트 연결 및 사이즈 설정
		const screenWidth = window.innerWidth;
		const width = screenWidth > 480 ? 480 - 60 - 16 : screenWidth - 60 - 16; // min-width - button-margin * 20 - component-padding * 2
		const buttonWidth = width / 10; // 한 줄에 10개의 버튼
		const buttonHeight = buttonWidth * 1.5; // 버튼의 높이는 너비의 1.5배

		/** @type {HTMLCollectionOf<HTMLButtonElement>}*/
		const buttons = document.getElementsByClassName('button');
		for (const button of buttons) {
			button.addEventListener('click', handleKeyClick);
			button.style.width = `${buttonWidth}px`;
			button.style.height = `${buttonHeight}px`;
			button.style.lineHeight = `${buttonHeight}px`;
		}

		document.addEventListener('keydown', handleKeyInput);
	});

	onDestroy(() => {
		// 컴포넌트가 파괴되면 버튼 이벤트 연결 해제
		const buttons = document.getElementsByClassName('button');
		for (const button of buttons) {
			button.removeEventListener('click', handleKeyClick, false);
		}
	});

	const dispatch = createEventDispatcher();

	const handleKeyClick = (e) => {
		dispatch('keyInsert', e.target.innerText.toLowerCase());
	};

	const handleKeyInput = (e) => {
		dispatch('keyInsert', e.key.toLowerCase());
	};
</script>

<div class="keyboard">
	<div class="row-container">
		<div class="button key">ㅃ</div>
		<div class="button key">ㅉ</div>
		<div class="button key">ㄸ</div>
		<div class="button key">ㄲ</div>
		<div class="button key">ㅆ</div>
		<div class="button key empty" />
		<div class="button key empty" />
		<div class="button key empty" />
		<div class="button key">ㅒ</div>
		<div class="button key">ㅖ</div>
	</div>
	<div class="row-container">
		<div class="button key">ㅂ</div>
		<div class="button key">ㅈ</div>
		<div class="button key">ㄷ</div>
		<div class="button key">ㄱ</div>
		<div class="button key">ㅅ</div>
		<div class="button key">ㅛ</div>
		<div class="button key">ㅕ</div>
		<div class="button key">ㅑ</div>
		<div class="button key">ㅐ</div>
		<div class="button key">ㅔ</div>
	</div>
	<div class="row-container">
		<div class="button key">ㅁ</div>
		<div class="button key">ㄴ</div>
		<div class="button key">ㅇ</div>
		<div class="button key">ㄹ</div>
		<div class="button key">ㅎ</div>
		<div class="button key">ㅗ</div>
		<div class="button key">ㅓ</div>
		<div class="button key">ㅏ</div>
		<div class="button key">ㅣ</div>
	</div>
	<div class="row-container">
		<div class="button key enter">확인</div>
		<div class="button key">ㅋ</div>
		<div class="button key">ㅌ</div>
		<div class="button key">ㅊ</div>
		<div class="button key">ㅍ</div>
		<div class="button key">ㅠ</div>
		<div class="button key">ㅜ</div>
		<div class="button key">ㅡ</div>
		<div class="button key delete">
			<span class="material-icons">backspace</span>
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
	}

	.empty {
		visibility: hidden;
	}

	.enter {
		font-size: 1em;
		flex: 1;
	}

	.delete {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		flex: 1;
	}
</style>
