<script>
	import { onMount } from 'svelte';
	import Crono from './Crono.svelte';
	import WSdashboard from './WSdashboard.svelte';
	import { saveSession } from './history';
	import { beforeNavigate } from '$app/navigation';
	import { makeChartBest, makeChartLatest, makeChartOverall, registerChart } from '$lib/myChart';
	import { scale, slide } from 'svelte/transition';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
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

	function onClose() {
		console.log('onClose: Connection closed successfully');
		// console.log(sock);
	}

	registerChart();

	// let sockState = $derived.by(
	// 	/**
	// 	 *@returns {string}
	// 	 */
	// 	function resolveSockState() {
	// 		// console.log(sock?.readyState);
	// 		if (sock) {
	// 			switch (sock?.readyState) {
	// 				case 0:
	// 					return 'attempting to connect';
	// 				case 1:
	// 					return 'connected';
	// 				case 2:
	// 					return 'closing';
	// 				case 3:
	// 					return 'closed';
	// 				default:
	// 					return 'not started';
	// 			}
	// 		}
	// 		return 'not started';
	// 	}
	// );
	let sockState = $state('not started');

	/**
	 * @type {Reading[]}
	 */
	const dummyData = [
		{
			side: 'R',
			xAccel: 9.81,
			yAccel: 0.0,
			zAccel: -9.81,
			modulus: 1
		},
		{
			side: 'L',
			modulus: 1.4,
			xAccel: 3.5,
			yAccel: 4.2,
			zAccel: 1.1
		},
		{
			side: 'R',
			modulus: 2,
			xAccel: -1.5,
			yAccel: 2.3,
			zAccel: 0.0
		}
	];
	/**
	 * @type {Reading[]}
	 */
	//TODO: controllare se server funzione da passare a componente per fare push di readings o basta passare le reading direttamente
	// let readings = $state(dummyData);
	let readings = $state([]);
	// let invertedReadings = $derived(readings.reverse);

	// const READINGS_KEY = 'readings_key';
	/*  save every single reading or only on training end? 
	maybe save readings until training end for recovery and delete them on traning end
	(on traning end we save the whole traning info) */
	// $effect(function saveLocal() {
	// 	localStorage.setItem(READINGS_KEY, JSON.stringify(readings));
	// });

	/**
	 * @param {Reading} reading
	 */
	function updateReadings(reading) {
		readings.push(reading);
		setTween();
	}

	/**
	 * @returns {Reading}
	 */
	function synthReading() {
		function randomSign() {
			if (Math.random() >= 0.5) {
				return 1;
			}
			return -1;
		}
		let x = parseFloat((Math.random() * 10).toFixed(2)) * randomSign();
		let y = parseFloat((Math.random() * 10).toFixed(2)) * randomSign();
		let z = parseFloat((Math.random() * 10).toFixed(2)) * randomSign();
		let modulus = parseFloat(
			Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2)).toFixed(2)
		);
		return {
			side: 'R',
			xAccel: x,
			yAccel: y,
			zAccel: z,
			modulus: modulus
		};
	}

	let intercept = false;
	onMount(() => {
		return function cleanup() {
			//TODO: any cleanup needed here
		};
	});

	beforeNavigate(({ cancel }) => {
		if (trainingStatus != 'in progress') {
			return;
		}
		if (!confirm('Do you really want to leave? Your progress will be lost!')) {
			intercept = true;
		} else {
			intercept = false;
		}
		if (intercept === true) {
			cancel();
		}
	});

	function endTraning() {
		//TODO:
		trainingStatus = 'done';
		saveTraning();
	}

	function saveTraning() {
		if (readings.length === 0) {
			return;
		}
		let crono = hours + ':' + minutes + ':' + seconds;
		saveSession(readings, best, crono);
	} //TODO:

	//let canStart = $state(true);
	let canStart = $state(false);
	function allowStart() {
		canStart = true;
	}

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
	//  * @param {Reading[]} readings
	//  * @returns {number}
	//  */
	// function findMax(readings) {
	// 	let currentMax = 0;
	// 	let index = -1;
	// 	for (let i = 0; i < readings.length; i++) {
	// 		let currentReading = readings[i];
	// 		if (currentReading?.modulus > currentMax) {
	// 			currentMax = currentReading?.modulus;
	// 			index = Math.abs(i - readings.length);
	// 			return index;
	// 		}
	// 	}
	// 	console.log(index);
	// 	return index;
	// }

	/**
	 * @type Reading
	 */
	let best = $derived.by(function findMax() {
		return readings.reduce((max, current) => {
			return current.modulus > max.modulus ? current : max;
		}, readings[0]);
	});

	//---Crono
	let time = $state(0);
	let hours = $derived(Math.floor(time / (60 * 60)));
	let minutes = $derived(Math.floor(time / 60));
	let seconds = $derived(time % 60);

	let alreadyset = false;
	/**
	 * @type {number | undefined}
	 */
	let interval_id;
	$effect(function controlTimer() {
		//TODO: might not be needed, might be replaced by ordinary callback functions
		if (trainingStatus === 'in progress' && !alreadyset) {
			interval_id = setInterval(() => {
				time++;
			}, 1000);
			alreadyset = true;
		}
		if (trainingStatus === 'done') {
			clearInterval(interval_id);
			alreadyset = false;
		}
	});

	//transitions tweened
	const bestmodulus = tweened(0, {
		duration: 500,
		easing: cubicOut
	});

	function setTween() {
		if (best.modulus) {
			bestmodulus.set(best.modulus);
		}
	}
</script>

<svelte:head>
	<title>Live Session</title>
</svelte:head>
<div class="wrapper">
	<WSdashboard {trainingStatus} {sockState} {allowStart} {updateReadings} bind:sock {onClose} />
	<main class="stats-dashboard">
		{#if trainingStatus === 'not started'}
			<button class="btn-primary" disabled={!canStart} onclick={startTraining}>Start Traning</button
			>
		{:else if trainingStatus === 'in progress'}
			<div class="banner-primary">in progress</div>
		{:else if trainingStatus === 'done'}
			<div class="banner-secondary">
				done
				<button
					class="btn-neutral1"
					onclick={(e) => {
						readings = [];
						time = 0;
						startTraining(e);
					}}>Start new session?</button
				>
			</div>
		{/if}
		<div class="best">
			<h2>Current best:</h2>
			<div class="readings-row">
				<div class="grid-best-header">modulus</div>
				<div class="grid-best-header">hand</div>
				<div class="grid-best-header">xAccel</div>
				<div class="grid-best-header">yAccel</div>
				<div class="grid-best-header">zAccel</div>
			</div>
			<!-- <div class="grid-best-item">punch N°</div> -->
			<!-- <div class="best">{readings[findMax(readings)]}</div> -->

			{#if best}
				<div class="readings-row" out:scale={{ duration: 250 }} in:scale={{ duration: 250 }}>
					<div class="best-item">{$bestmodulus}</div>
					<div class="best-item">{best.side}</div>
					<div class="best-item">{best.xAccel}</div>
					<div class="best-item">{best.yAccel}</div>
					<div class="best-item">{best.zAccel}</div>
					<!-- <div class="best-item">{Math.abs(index - readings.length)}</div> -->
				</div>
			{/if}
		</div>
		<div class="readings-feed">
			<button
				disabled={!canStart || trainingStatus != 'in progress'}
				class="btn-secondary"
				onclick={() => {
					readings.push(synthReading());
					setTween();
				}}>Add a synthetic reading</button
			>
			<h2>Readings above treshold:</h2>
			<div class="readings-grid">
				<div class="readings-row">
					<div class="grid-header-item">modulus</div>
					<div class="grid-header-item">hand</div>
					<div class="grid-header-item">xAccel</div>
					<div class="grid-header-item">yAccel</div>
					<div class="grid-header-item">zAccel</div>
					<div class="grid-header-item">punch N°</div>
				</div>
				{#if !canStart}
					<div class="please-connect">
						Please connect to the Web Socket
						<button class="btn-neutral1" onclick={allowStart}>Start anyway</button>
					</div>
				{/if}
				{#each readings.toReversed() as reading, i (reading)}
					<!--					<li>{reading}</li> -->
					<div class="readings-row" out:slide={{ duration: 250 }} in:slide={{ duration: 250 }}>
						<div class="reading-item">
							{reading.modulus}
						</div>
						<div class="reading-item">{reading.side}</div>
						<div class="reading-item">{reading.xAccel}</div>
						<div class="reading-item">{reading.yAccel}</div>
						<div class="reading-item">{reading.zAccel}</div>
						<div class="reading-item">{Math.abs(i - readings.length)}</div>
						<!--add number of reading? -->
					</div>
				{/each}
			</div>
		</div>
		<div class="graphs">
			<div>
				<canvas use:makeChartBest={{ best: best }}></canvas>
				<canvas use:makeChartLatest={{ latest: readings[readings.length - 1] }}></canvas>
				<canvas use:makeChartOverall={{ all: readings }}></canvas>
			</div>
		</div>
	</main>
	<div class="dashboard-footer">
		<!-- Rate your tiredness <br /> -->
		<div>Training status: <span>{trainingStatus}</span></div>
		<Crono {time} {hours} {minutes} {seconds} text={'Time since session start:'} {trainingStatus}>
			<button class="btn-neutral1" onclick={endTraning} disabled={trainingStatus != 'in progress'}
				>End Session</button
			>
		</Crono>
	</div>
</div>

<style>
	:global(body) {
		margin-bottom: 60px;
	}
	.stats-dashboard {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
	}
	@media (width <= 900px) {
		.stats-dashboard {
			display: flex;
			flex-direction: column;
		}

		:global(body) {
			margin-bottom: 100px;
		}
	}
	.dashboard-footer {
		position: fixed;
		display: flex;
		left: 0;
		bottom: 0;
		width: 100%;
		max-height: clamp(auto, 70px, 90px);
		background-color: var(--accent-300);
		text-align: center;
		justify-content: space-between;
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

	.please-connect {
		grid-column: span 6;
		border-radius: 6px;
		margin: 0px 3px;
		background-color: var(--warning);
	}

	.best {
		display: grid;
		grid-auto-flow: row;
		gap: 20px;

		text-align: center;
	}

	.grid-best-header {
		background-color: var(--accent-200);
		text-align: center;
	}

	.banner-primary {
		padding: 0.75rem;
		margin: 25px;
		background-color: var(--primary-400);
		color: var(--text);

		border-style: solid;
		border-width: 2px;
		border-color: var(--border);
		border-radius: 7px;

		font-weight: 300;
	}

	.banner-secondary {
		padding: 0.75rem;
		margin: 25px;
		background-color: var(--secondary-500);
		color: var(--text-light);

		border-style: solid;
		border-width: 2px;
		border-color: var(--border);
		border-radius: 7px;

		font-weight: 300;
	}
</style>
