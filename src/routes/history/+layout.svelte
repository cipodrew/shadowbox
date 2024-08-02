<script>
	let { children } = $props();

	/**
	 *@type {[]}
	 */
	let sessions;
</script>

<div class="columns">
	<section>
		<ul>
			<a href=""> <li>Session of 2024-08-2=02</li></a>
		</ul>
	</section>
	{@render children()}
</div>

<style>
	.columns {
		display: grid;
		grid-template-columns: 1fr 3fr;
	}
</style>
