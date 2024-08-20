<script>
	import { onMount } from 'svelte';
	import Crono from './Crono.svelte';
	import WSdashboard from './WSdashboard.svelte';
	import { read } from '$app/server';
	/**
	 * @typedef {import('$lib/myTypes.js').TrainingStatus} TrainingStatus
	 */
	/**
	 * @typedef {import('$lib/myTypes.js').Reading} Reading
	 */

	/**
	 * @type WebSocket | undefined
	 */
	let sock = $state();
	///**
	// * @type number
	// */ let sockState;

	/**
	 * @type {Reading[]}
	 */
	//TODO: controllare se server funzione da passare a componente per fare push di readings o basta passare le reading direttamente
	let readings = $state([
		{
			side: 'R',
			module: 1,
			xAccel: 9.81,
			yAccel: 0.0,
			zAccel: -9.81
		},
		{
			side: 'L',
			xAccel: 3.5,
			yAccel: 4.2,
			zAccel: 1.1
		},
		{
			side: 'R',
			module: 2,
			xAccel: -1.5,
			yAccel: 2.3,
			zAccel: 0.0
		}
	]);
	// let invertedReadings = $derived(readings.reverse);

	// const READINGS_KEY = 'readings_key';
	/*  save every single reading or only on training end? 
	maybe save readings until training end for recovery and delete them on traning end
	(on traning end we save the whole traning info) */
	// $effect(function saveLocal() {
	// 	localStorage.setItem(READINGS_KEY, JSON.stringify(readings));
	// });

	onMount(() => {
		return function cleanup() {
			if (trainingStatus === 'in progress') {
				/* prompt user for confirmation on leaving */
				alert('Do you really want to leave? Your progress will be lost!');
			}
		};
	});

	function endTraning() {
		//TODO:
		saveTraning();
	}

	function saveTraning() {} //TODO:

	//let canStart = $state(true);
	let canStart = $derived(sock?.readyState === 1); //true se socket é connessa
	/**
	 * @type {TrainingStatus}
	 */
	let trainingStatus = $state('not started');

	/**
	 * @param {MouseEvent & { currentTarget: EventTarget & HTMLButtonElement; }} event
	 */
	function startTraining(event) {
		trainingStatus = 'in progress';
	}

	// /**
	//  *@type {{currentBest: Reading, index: number} | undefined}
	//  */
	// let { currentBest, index } = $state();

	// /**
	//  *
	//  * @param {Reading[]} readings
	//  * @returns {{currentBest:Reading, index: number}}
	//  */
	// function bestPunch(readings) {
	// 	for (let i = 0; i < readings.length; i++) {
	// 		let currentReading = readings[i];
	// 		if (currentBest === undefined || currentReading?.module > currentBest?.module) {
	// 			currentBest = currentReading;
	// 			return { currentBest: currentBest, index: Math.abs(i - readings.length) };
	// 		}
	// 	}
	// }
</script>

<svelte:head>
	<title>Live Session</title>
</svelte:head>
<div class="wrapper">
	<WSdashboard {readings} {sock} />
	<main class="stats-dashboard">
		<button class="btn-primary" disabled={!canStart} onclick={startTraining}>Start Traning</button>
		<div class="best">
			<h2>Current best:</h2>
			<div class="best">1 R 2 3 1</div>
			<!-- {#if currentBest}
				<div class="grid-best-item">module</div>
				<div class="grid-best-item">hand</div>
				<div class="grid-best-item">xAccel</div>
				<div class="grid-best-item">yAccel</div>
				<div class="grid-best-item">zAccel</div>
				<div class="grid-best-item">punch N°</div>
				<div class="best-item">{currentBest.module}</div>
				<div class="best-item">{currentBest.side}</div>
				<div class="best-item">{currentBest.xAccel}</div>
				<div class="best-item">{currentBest.yAccel}</div>
				<div class="best-item">{currentBest.zAccel}</div>
				<div class="best-item">{Math.abs(index - readings.length)}</div>
			{/if} -->
		</div>
		<div class="readings-feed">
			<button
				class="btn-secondary"
				onclick={() => {
					readings.unshift({
						side: 'R',
						module: 2,
						xAccel: -1.5,
						yAccel: 2.3,
						zAccel: 0.0
					});
				}}>Add a synthetic reading</button
			>
			<h2>Readings above treshold:</h2>
			<div class="readings-grid">
				<div class="grid-header-item">module</div>
				<div class="grid-header-item">hand</div>
				<div class="grid-header-item">xAccel</div>
				<div class="grid-header-item">yAccel</div>
				<div class="grid-header-item">zAccel</div>
				<div class="grid-header-item">punch N°</div>
				<!-- {#each readings.toReversed() as reading, i } if using push instead of unshift -->
				{#each readings as reading, i}
					<!--					<li>{reading}</li> -->
					<div class="reading-item">{reading.module}</div>
					<div class="reading-item">{reading.side}</div>
					<div class="reading-item">{reading.xAccel}</div>
					<div class="reading-item">{reading.yAccel}</div>
					<div class="reading-item">{reading.zAccel}</div>
					<div class="reading-item">{Math.abs(i - readings.length)}</div>
					<!--add number of reading? -->
				{/each}
			</div>
		</div>
		<div class="graph">
			<p>Graph</p>
		</div>
		<div>test</div>
	</main>
	<div class="dashboard-footer">
		<!-- Rate your tiredness <br /> -->
		Time since session start: <span>{trainingStatus}</span>
		<Crono {trainingStatus} />
	</div>
</div>

<style>
	:global(body) {
		margin-bottom: 20px;
	}
	.stats-dashboard {
		display: grid;
		grid-template-columns: 1fr 1fr;
	}

	.dashboard-footer {
		position: fixed;
		display: flex;
		left: 0;
		bottom: 0;
		width: 100%;
		background-color: var(--accent-300);
		text-align: center;
	}
	/*.readings-grid {*/
	/*	display: flex;*/
	/*	flex-direction: row;*/
	/*	gap: 20px;*/
	/*	overflow-x: auto;*/
	/*}*/
	.readings-grid {
		display: grid;
		grid-auto-flow: row;
		/*grid-template-columns: 1fr 1fr 1fr 1fr 1fr;*/
		grid-template-columns: repeat(6, 1fr);
		gap: 20px;

		text-align: center;
	}

	/*.grid-header {*/
	/*	display: flex;*/
	/*	background-color: var(--accent-300);*/
	/*	gap: 20px;*/
	/*}*/
	/*.reading {*/
	/*	display: flex;*/
	/*	flex-grow: inherit;*/
	/*	gap: 20px;*/
	/*}*/
	.grid-header-item {
		background-color: var(--accent-200);
	}
</style>
