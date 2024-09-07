<script>
	import { onMount } from 'svelte';

	// import * as Types from "$lib/myTypes.js"
	// import * from "$lib/myTypes.js"
	/**
	 * @typedef {import('$lib/myTypes.js').Training} Training
	 */
	const { data } = $props();

	let { slug, trainingSession: session } = $derived(data);

	$effect(() => {
		console.log(data.trainingSession);
	});

	// let storage;
	// onMount(() => {
	// 	localStorage.getItem('historyMap');
	// });
	// /**
	//  * @type {Map<string,Training> | undefined}
	//  */
	// let allTrainings = undefined;
	// /**
	//  * @type {Training | undefined}
	//  */
	// let training = undefined;
	// if (storage) {
	// 	allTrainings = JSON.parse(storage);
	// 	training = allTrainings?.get(slug);
	// }
</script>

<svelte:head>
	<title>Your past training session</title>
</svelte:head>
<div class="wrapper">
	<h1>Your past session</h1>
	<div class="date">{session?.date}</div>
	<div class="stats">total punches: {session?.readings.length}</div>
	<div class="best">
		<h2>Best:</h2>
		<div class="grid-best-header">modulus</div>
		<div class="grid-best-header">hand</div>
		<div class="grid-best-header">xAccel</div>
		<div class="grid-best-header">yAccel</div>
		<div class="grid-best-header">zAccel</div>
		<!-- <div class="grid-best-item">punch N°</div> -->
		<!-- <div class="best">{readings[findMax(readings)]}</div> -->

		{#if session?.best}
			<div></div>
			<div class="best-item">{session.best.modulus}</div>
			<div class="best-item">{session.best.side}</div>
			<div class="best-item">{session.best.xAccel}</div>
			<div class="best-item">{session.best.yAccel}</div>
			<div class="best-item">{session.best.zAccel}</div>
			<!-- <div class="best-item">{Math.abs(index - readings.length)}</div> -->
		{/if}
	</div>
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

	.best {
		display: grid;
		grid-auto-flow: row;
		/*grid-template-columns: 1fr 1fr 1fr 1fr 1fr;*/
		grid-template-columns: repeat(6, 1fr);
		gap: 20px;

		text-align: center;
	}

	.grid-best-header {
		background-color: var(--accent-200);
		text-align: center;
	}
</style>
