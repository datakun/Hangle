<script>
	import { createEventDispatcher } from 'svelte';

	export let checked = false;
	export let disabled = false;

	const dispatch = createEventDispatcher();

	const handleClick = (e) => {
		dispatch('click', e);
	};
</script>

<label class="switch" on:click={handleClick}>
	<input type="checkbox" bind:checked {disabled} />
	<span class="slider" />
</label>

<style>
	.switch {
		position: relative;
		display: inline-block;
		width: 40px;
		height: 24px;
	}

	.switch input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	.slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgb(130, 130, 130);
		-webkit-transition: 0.4s;
		transition: 0.4s;
		border-radius: 24px;
	}

	.slider:before {
		position: absolute;
		content: '';
		height: 18px;
		width: 18px;
		left: 3px;
		bottom: 3px;
		background-color: white;
		-webkit-transition: 0.4s;
		transition: 0.4s;
		border-radius: 50%;
	}

	input:checked + .slider:before {
		-webkit-transform: translateX(16px);
		-ms-transform: translateX(16px);
		transform: translateX(16px);
	}
</style>
