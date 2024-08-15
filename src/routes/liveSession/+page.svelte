<script>
	import { onMount } from 'svelte';
	import Crono from './Crono.svelte';
	import WSdashboard from './WSdashboard.svelte';
	/**
	 * @typedef {import('$lib/myTypes.js').TrainingStatus} TrainingStatus
	 */

	/**
	 * @type {string[]}
	 */
	//TODO: controllare se server funzione da passare a componente per fare push di readings o basta passare le reading direttamente
	let readings = $state([
		'1',
		'2',
		'hi',
		'yo',
		'hi',
		'yo',
		'hi',
		'yo',
		'hi',
		'yo',
		'hi',
		'yo',
		'hi',
		'yo',
		'hi',
		'yo',
		'hi',
		'yo'
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
		saveTraning();
	}

	function saveTraning() {}

	let canStart = $state(false);
	/**
	 * @type {TrainingStatus}
	 */
	let trainingStatus = $state('not started');

	/**
	 * @param {MouseEvent & { currentTarget: EventTarget & HTMLButtonElement; }} event
	 */
	function startTraining(event) {
		throw new Error('Function not implemented.');
	}
</script>

<svelte:head>
	<title>Live Session</title>
</svelte:head>
<div class="wrapper">
	<WSdashboard {readings} />
	<main class="stats-dashboard">
		<button class="btn-primary" disabled={!canStart} onclick={startTraining}>Start Traning</button>
		<div class="best">Your best punch this session was:</div>
		<div class="readings-feed">
			<button
				class="btn-secondary"
				onclick={() => {
					readings.unshift('hello!');
				}}>Add a synthetic reading</button
			>
			<h2>Readings above treshold:</h2>
			<div class="readings-grid">
				<!-- {#each readings.toReversed() as reading} -->
				<div class="grid-header-item">module</div>
				<div class="grid-header-item">hand</div>
				<div class="grid-header-item">xAccel</div>
				<div class="grid-header-item">yAccel</div>
				<div class="grid-header-item">zAccel</div>
				{#each readings as reading}
					<!--					<li>{reading}</li> -->
					<div class="reading-item">{reading}</div>
					<div class="reading-item">R</div>
					<div class="reading-item">2</div>
					<div class="reading-item">3</div>
					<div class="reading-item">1</div>
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
		Time since session start:
		<Crono />
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
		grid-template-columns: repeat(5, 1fr);
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
