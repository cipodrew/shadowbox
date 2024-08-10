<script>
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
			Readings above treshold:
			<ul>
				<!-- {#each readings.toReversed() as reading} -->
				{#each readings as reading}
					<li>{reading}</li>
				{/each}
			</ul>
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
</style>
