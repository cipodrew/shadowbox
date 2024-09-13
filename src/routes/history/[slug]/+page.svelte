<script>
	import Button from '$lib/components/Button.svelte';
	import { makeChartBest, makeChartOverall, registerChart } from '$lib/myChart';

	registerChart();

	// import * as Types from "$lib/myTypes.js"
	// import * from "$lib/myTypes.js"
	/**
	 * @typedef {import('$lib/myTypes.js').Training} Training
	 */
	const { data } = $props();

	let { slug, trainingSession: session } = $derived(data);

	let isReadingsShown = $state(false);
	function toggleReadings() {
		isReadingsShown = !isReadingsShown;
	}
	let average = $derived.by(function average() {
		let sum = 0;
		let avg = 0;
		if (session) {
			let length = session?.readings.length;
			for (let i = 0; i < length; i++) {
				const currMod = session.readings[i].modulus;
				sum += currMod;
			}
			if (length > 0) {
				avg = sum / length;
			}
		}
		return avg;
	});
</script>

<svelte:head>
	<title>Your past training session</title>
</svelte:head>
<div class="wrapper">
	<section>
		<h1>Session N°: {slug}</h1>
		<div class="date">Completed on: {session?.date}</div>
		<div class="stats">Total punches: {session?.readings.length}</div>
		<div class="avg">Average modulus: {average.toFixed(2)}</div>
		<div class="crono">Total time: {session?.crono}</div>
	</section>
	<h2>Best:</h2>
	<div class="best">
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
	{#if session?.best}
		<div class="graph">
			<canvas use:makeChartBest={{ best: session.best }}></canvas>
		</div>
	{/if}
	{#if !isReadingsShown}
		<Button variant="primary" onClick={toggleReadings}>Show All Readings</Button>
	{:else}
		{#if session}
			<div>
				<canvas use:makeChartOverall={{ all: session?.readings }}></canvas>
			</div>
		{/if}
		<div class="readings-grid">
			<div class="readings-row">
				<div class="grid-header-item">modulus</div>
				<div class="grid-header-item">hand</div>
				<div class="grid-header-item">xAccel</div>
				<div class="grid-header-item">yAccel</div>
				<div class="grid-header-item">zAccel</div>
				<div class="grid-header-item">punch N°</div>
			</div>
			{#if session}
				{#each session?.readings as reading, i (reading)}
					<!--					<li>{reading}</li> -->
					<div class="readings-row">
						<div class="reading-item">
							{reading.modulus}
						</div>
						<div class="reading-item">{reading.side}</div>
						<div class="reading-item">{reading.xAccel}</div>
						<div class="reading-item">{reading.yAccel}</div>
						<div class="reading-item">{reading.zAccel}</div>
						<div class="reading-item">{Math.abs(i - session?.readings.length)}</div>
						<!--add number of reading? -->
					</div>
				{/each}
			{/if}
			<Button variant="primary" onClick={toggleReadings}>Collapse Readings</Button>
		</div>
	{/if}
</div>

<style>
	.wrapper {
		justify-self: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		width: 100%;
		gap: 20px;
		max-width: 80%;
		/*overflow: hidden;*/

		/* border-style: solid;
		border-width: 0px 0px 0px 5px;
		border-color: --var(--border); */
	}

	.wrapper > * {
		width: 100%;
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

	.readings-grid {
		display: grid;
		grid-auto-flow: row;
		/*grid-template-columns: 1fr 1fr 1fr 1fr 1fr;*/
		gap: 20px;

		text-align: center;
	}
	.readings-row {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 20px;
	}
	.grid-header-item {
		background-color: var(--accent-200);
		text-align: center;
	}
</style>
