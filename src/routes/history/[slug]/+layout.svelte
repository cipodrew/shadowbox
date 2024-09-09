<script>
	/**
	 * @typedef {import('$lib/myTypes.js').Training} Training
	 */

	/**
	 * @property {{import('./$types').PageData}} data
	 */
	const { data, children } = $props();

	function lastTen() {
		if (data.hist === null) {
			return [];
		}
		const arr = Array.from(data.hist.values());
		return arr.slice(-10, undefined).reverse();
		//reverse do
	}

	/**
	 *@type {Training[]}
	 */
	let last_10_sessions = lastTen();

	let collapsed = $state(false);
	function collapseSidebar() {
		collapsed = !collapsed;
	}
</script>

<div class="columns">
	<section class="sidebar" class:collapsed>
		<!-- <button class="btn-collapse" onclick={collapseSidebar}>Collapse</button> -->
		<br /> Your latest 10 trainings:
		{#each last_10_sessions as sesssion}
			<ul>
				<a href={'/history/' + sesssion.id}> <li>Training of {sesssion.date}</li></a>
			</ul>
		{/each}
	</section>
	{@render children()}
</div>

<style>
	.sidebar {
		max-width: max-content;
		padding: 0 15px 0 0;
		margin: 0 15px 0 0;
		background-color: var(--accent-100);
	}
	.sidebar a {
		color: var(--text);
	}
	.sidebar a:hover {
		color: var(--text-700);
	}
	.columns {
		display: grid;
		grid-template-columns: 1fr 3fr;
	}

	@media (width <= 700px) {
		.columns {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 10px;
		}
	}

	/* .collapsed {
		max-width: 5%;
	}

	.btn-collapse {
	} */
</style>
