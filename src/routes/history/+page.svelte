<script>
	import Button from '$lib/components/Button.svelte';
	import { onMount } from 'svelte';
	import { getHistory } from './localStorage';
	function showMore() {} //TODO:

	/**
	 * @type {Map<any,any> | null}
	 */
	let history = $state(null);
	onMount(() => {
		history = getHistory();
		if (history === null) {
			history = new Map();
		}
		const arr = Array.from(history.values());
	});

	/**
	 * @type import("$lib/myTypes").Training[]
	 */
	let lastTenHistory = $derived.by(() => {
		if (history === null) {
			return [];
		}
		const arr = Array.from(history.values());
		return arr.slice(-10, arr.length).reverse();
		//reverse does not count as a side effect here because slice returns a copy
	});

	/**
	 * @type import("$lib/myTypes").Training[]
	 */
	let restOfHistory = $derived.by(() => {
		if (history === null) {
			return [];
		}
		const arr = Array.from(history.values());
		return arr.slice(0, -11).reverse();
		//reverse does not count as a side effect here because slice returns a copy
	});

	$inspect(lastTenHistory);
</script>

<svelte:head>
	<title>Historical graph</title>
</svelte:head>
<div class="wrapper">
	<main class="container">
		<h1 class="heading-1">Your past training sessions</h1>
		<section class="table">
			<div class="table-item">ID</div>
			<div class="table-item">date</div>
			<div class="table-item">crono</div>
			<!-- <div class="table-item">score</div> -->
			<div class="table-item">best</div>
			{#if lastTenHistory}
				{#each lastTenHistory as session}
					<div class="table-item">{session.id}</div>
					<div class="table-item">
						{session.date}
					</div>
					<div class="table-item">{session.crono}</div>
					<!-- <div class="table-item">score</div> -->
					<div class="table-item">{session.best.modulus}</div>
				{/each}
			{/if}
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
		display: grid;
		grid-auto-flow: row;
		/*grid-template-columns: 1fr 1fr 1fr 1fr 1fr;*/
		grid-template-columns: repeat(4, 1fr);
		gap: 20px;

		text-align: center;
	}
	.table-item {
		border: 2px solid var(--background-950);
	}
</style>
