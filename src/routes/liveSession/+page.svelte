<script>
	import { onMount } from 'svelte';

	/**
	 * @type {string[]}
	 */
	let readings = $state([]);
	let localIP = $state('');
	let wsPort = $state('');

	/**
	 * @type WebSocket | undefined
	 */
	let sock = $state();
	/**
	 * @type number
	 */ let sockState;

	// $inspect(sock);
	onMount(() => {
		//const host = '192.168.1.105';
		//const port = '3000';
		//sock = new WebSocket('ws://' + host + ':' + port); //use wss for TLS channel
		//console.log(sock);
		//sock.onopen = function (event) {
		//	console.log('Connected to WebSocket server.');
		//};
		//sock.onmessage = function (event) {
		//	console.log('Received: ' + event.data);
		//	readings.push(event.data);
		//};
		let previousWsInfo = sessionStorage.getItem('wsInfo');
		if (previousWsInfo){
			let info = JSON.parse(previousWsInfo)
			localIP = info.ip;
			wsPort = info.port
		}
		return cleanup; //save ws info and disconnect as a cleanup
	});

	function cleanup(){
		saveAddress();
		disconnect();
	}

	function saveAddress(){
		let wsInfo = {
			ip: localIP,
			port: wsPort
		}
		sessionStorage.setItem('wsInfo', JSON.stringify(wsInfo))
	}

	function disconnect() {
		console.log('closing connection');
		sock?.close();
	}

	function connect() {
		// default IP 192.168.1.105
		//dfeault port 3000
		if (wsPort === '') {
			wsPort = '3000';
		}
		sock = new WebSocket('ws://' + localIP + ':' + wsPort); //use wss for TLS channel
		// console.log(sock);
		sock.onopen = function (event) {
			console.log('Connected to WebSocket server.');
		};
		sock.onmessage = function (event) {
			console.log('Received: ' + event.data);
			readings.push(event.data);
		};
	}

	/**
	 *@param {WebSocket | undefined} sock
	 *@returns {string}
	 */
	function resolveSockState(sock) {
		// console.log(sock?.readyState);
		switch (sock?.readyState) {
			case 0:
				return 'attempting to connect';
			case 1:
				return 'open';
			case 2:
				return 'closing';
			case 3:
				return 'closed';
			default:
				return 'not started';
		}
	}
</script>

<svelte:head>
	<title>Live Session</title>
</svelte:head>
<div class="wrapper">
	<section class="ws-info">
		<h1>Session in progress</h1>
		<div>Websocket state: {resolveSockState(sock)}</div>
		<label for="IP-input">Web socket IP:</label>
		<input type="text" id="IP-input" bind:value={localIP} />
		<label for="port-input">Web socket port:</label>
		<input type="text" id="port-input" bind:value={wsPort} />
		<button onclick={connect}>Connect WS</button>
		<button onclick={disconnect}>Disconnect WS</button>	
	</section>
	<main class="stats-dashboard">
		<div class="best">Your best punch this session was:</div>
		<div class="readings-feed">
			Readings above treshold:
			<ul>
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
		Rate your tiredness <br>
		Time since session start:
	</div>
</div>

<style>
	.ws-info {
		display: flex;
		flex-wrap: wrap;
		/* gap: 20px; */
		justify-content: space-around;
		}
	.stats-dashboard {
		display: grid;
		grid-template-columns: 1fr 1fr;
	}
</style>
