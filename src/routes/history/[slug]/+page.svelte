<script>
	// import * as Types from "$lib/myTypes.js"
	// import * from "$lib/myTypes.js"
	/**
	 * @typedef {import('$lib/myTypes.js').Training} Training
	 */

	/**
	 * @property {{import('./$types').PageData}} data
	 */
	const { data } = $props();

	const slug = data.slug;

	let storage = localStorage.getItem('historyMap');
	/**
	 * @type {Map<string,Training> | undefined}
	 */
	let allTrainings = undefined;
	/**
	 * @type {Training | undefined}
	 */
	let training = undefined;
	if (storage) {
		allTrainings = JSON.parse(storage);
		training = allTrainings?.get(slug);
	}
</script>

<svelte:head>
	<title>Your past training sessio</title>
</svelte:head>
<div class="wrapper">
	<h1>Your past session</h1>
	<div>This is the slug: {slug}</div>
</div>

<style>
	.wrapper {
		display: grid;
		place-items: center;
		border-style: solid;
		border-width: 5px;
		border-color: --var(--border);
		/*grid-template-rows: minmax(100px, auto) 1fr;*/
		height: 100svh;
		/*overflow: hidden;*/
	}
</style>
