<script>
	import { onMount } from 'svelte';

	/**
	 * @type {string[]}
	 */
	let readings = $state([]);
	let localIP = $state('');

	/**
	 * @type WebSocket | undefined
	 */
	let sock = $state();
	/**
	 * @type number
	 */ let sockState;

	// $inspect(sock);
	onMount(() => {
		const host = '192.168.1.105';
		const port = '3000';
		sock = new WebSocket('ws://' + host + ':' + port); //use wss for TLS channel
		console.log(sock);
		sock.onopen = function (event) {
			console.log('Connected to WebSocket server.');
		};
		sock.onmessage = function (event) {
			console.log('Received: ' + event.data);
			readings.push(event.data);
		};
		return disconnect; //disconnect as a cleanup
	});

	function disconnect() {
		console.log('closing connection');
		sock?.close();
	}

	function connect() {
		const port = '3000';
		sock = new WebSocket('ws://' + localIP + ':' + port); //use wss for TLS channel
		console.log(sock);
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
		console.log(sock?.readyState);
		switch (sock?.readyState) {
			case 0:
				return 'connecting';
			case 1:
				return 'open';
			case 2:
				return 'closing';
			case 3:
				return 'closed';
			default:
				return '';
		}
	}
</script>

<svelte:head>
	<title>Live Session</title>
</svelte:head>
<div class="wrapper">
	<h1>Session in progress</h1>
	<div>Weboscket state: {resolveSockState(sock)}</div>

	<div>
		Readings above treshold:
		<ul>
			{#each readings as reading}
				<li>{reading}</li>
			{/each}
		</ul>
	</div>
	<!-- <input type="text" value:bind={localIP}>
<button onclick={connect}>connect WS</button>
<div>current socket status: {sockStatus}</div> -->
	<button onclick={disconnect}>Disconnect WS</button>
</div>
