<div class="body">
	{#each new Array(6) as n}
		<div class="row-container line-{n}">
			<div class="box" />
			<div class="box" />
			<div class="box" />
			<div class="box" />
			<div class="box" />
		</div>
	{/each}
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

	.box {
		width: 64px;
		height: 64px;
		margin: 4px;
		border: solid 2px rgb(58, 58, 58);
		color: white;
		font-weight: bold;
		font-size: xx-large;
		text-align: center;
		line-height: 64px;
		user-select: none;
		-moz-user-select: none;
		-webkit-user-select: none;
	}
</style>
