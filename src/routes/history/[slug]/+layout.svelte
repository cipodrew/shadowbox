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

	//TODO: make this sidebar toggle-able
</script>

<div class="columns">
	<section>
		<button class="btn-primary">Collapse</button>
		Your latest 10 trainings:
		{#each last_10_sessions as sesssion}
			<ul>
				<a href={'/history/' + sesssion.id}> <li>Training of {sesssion.date}</li></a>
			</ul>
		{/each}
	</section>
	{@render children()}
</div>

<style>
	.columns {
		display: grid;
		grid-template-columns: 1fr 3fr;
	}
</style>
