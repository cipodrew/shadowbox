<script>
	import Button from '$lib/components/Button.svelte';

	function showMore() {} //TODO:
</script>

<svelte:head>
	<title>Historycal graph</title>
</svelte:head>
<div class="wrapper">
	<main class="container">
		<h1 class="heading-1">Your past training sessions</h1>
		<section class="table even-columns">
			<div class="table-item">name</div>
			<div class="table-item">date</div>
			<div class="table-item">score</div>
			<div class="table-item">score</div>
			<div class="table-item">best</div>
		</section>
		<Button variant="primary" onClick={showMore}>Show more</Button>
	</main>
</div>

<style>
	:global(body) {
		height: 100svh;
	} /* Svelte rules are scoped by default so we need to specify if we want a global rule.
	 In this case it's fine because this is a page component */

	.wrapper {
		display: grid;
		place-items: center;
		/* border-style: solid;
		border-width: 5px;
		border-color: --var(--border); */
		/*grid-template-rows: minmax(100px, auto) 1fr;*/
		height: 100%;
		margin: 0;
		/*overflow: hidden;*/
	}

	.container {
		/* align-self: center;
		justify-self: center; */
		width: clamp(80px, 70%, 900px);
		text-align: center;
		background-color: var(--accent-200);
		min-height: 70%;
	}

	.table {
	}
	.table-item {
		border: 2px solid var(--background-950);
	}
</style>
