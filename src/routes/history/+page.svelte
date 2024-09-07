<script>
	import Button from '$lib/components/Button.svelte';
	import { onMount } from 'svelte';
	import { getHistory } from './localStorage';

	/**
	 * @type {Map<any,any> | null}
	 */
	let history = $state(null);
	onMount(() => {
		history = getHistory();
		if (history === null) {
			history = new Map();
		}
	});

	/**
	 * @type import("$lib/myTypes").Training[]
	 */
	let lastTenHistory = $derived.by(() => {
		if (history === null) {
			return [];
		}
		const arr = Array.from(history.values());
		return arr.slice(-10, undefined).reverse();
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
		return arr.slice(0, -10).reverse();
		//reverse does not count as a side effect here because slice returns a copy
	});

	let isShownMore = $state(false);
	function toggleMore() {
		isShownMore = !isShownMore;
	}
</script>

<svelte:head>
	<title>Historical graph</title>
</svelte:head>
<div class="wrapper">
	<main class="container">
		<h1 class="heading-1">Your past training sessions</h1>
		<section class="table">
			<div class="table-line">
				<div class="table-item table-header">ID</div>
				<div class="table-item table-header">date</div>
				<div class="table-item table-header">crono</div>
				<!-- <div class="table-item">score</div> -->
				<div class="table-item table-header">best</div>
			</div>
			{#if lastTenHistory}
				{#each lastTenHistory as session}
					<a href="/history/{session.id}">
						<div class="table-line">
							<div class="table-item">{session.id}</div>
							<div class="table-item">
								{session.date}
							</div>
							<div class="table-item">{session.crono}</div>
							<!-- <div class="table-item">score</div> -->
							<div class="table-item">{session.best?.modulus}</div>
							<button class="">-></button>
						</div>
					</a>
				{/each}
			{/if}
			{#if !isShownMore}
				<Button variant="primary" onClick={toggleMore}>Show more</Button>
			{:else if restOfHistory}
				{#each restOfHistory as session}
					<a href="/history/{session.id}">
						<div class="table-line">
							<div class="table-item">{session.id}</div>
							<div class="table-item">
								{session.date}
							</div>
							<div class="table-item">{session.crono}</div>
							<!-- <div class="table-item">score</div> -->
							<div class="table-item">{session.best?.modulus}</div>
							<button class="">-></button>
						</div>
					</a>
				{/each}
				<Button variant="primary" onClick={toggleMore}>Collapse</Button>
			{/if}
		</section>
	</main>
</div>

<style>
	:global(body) {
		height: 100%;
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
		gap: 10px;
		padding: 10px;

		text-align: center;
	}
	.table-header {
		font-size: var(--fs-500);
	}
	.table-line {
		column-span: 5;
		display: grid;
		grid-template-columns: repeat(4, 1fr) 40px;
		gap: 20px;
	}
	.table-item {
		border: 2px solid var(--background-950);
	}

	.table > a {
		color: inherit;
		text-decoration: none;

		transition: 200ms;
	}
	.table > a:hover {
		opacity: 50%;
	}
</style>
