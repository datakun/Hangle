<script>
	import Head from './Head.svelte';
	import Body from './Body.svelte';
	import Keyboard from './Keyboard.svelte';
</script>

<main>
	<Head />
	<Body />
	<Keyboard />
</main>

<style>
	main {
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		padding: px;
		margin: 0 auto;
	}

	@media (min-width: 500px) {
		main {
			max-width: 500px;
		}
	}
</style>
