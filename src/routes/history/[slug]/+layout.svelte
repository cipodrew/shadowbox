<script>
	let { children } = $props();

	/**
	 *@type {[]}
	 */
	let last_10_sessions;
</script>

<div class="columns">
	<section>
		Your latest 10 trainings:
		<ul>
			<a href=""> <li>Training of 2024-08-2=02</li></a>
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
