<script>
	//to debug use chrome devtools ->Network tab -> WS
	import Button from '$lib/components/Button.svelte';
	import { onMount } from 'svelte';

	/**
	 * @typedef {import('$lib/myTypes.js').Reading} Reading
	 */

	/** @type {{ trainingStatus: string, readings: Reading[] , sock: WebSocket | undefined}}
} */
	let { trainingStatus, readings, sock } = $props();

	let localIP = $state('');
	let wsPort = $state('');

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
		if (previousWsInfo) {
			let info = JSON.parse(previousWsInfo);
			localIP = info.ip;
			wsPort = info.port;
		}
		return cleanup; //save ws info and disconnect as a cleanup
	});

	function cleanup() {
		saveAddress();
		disconnect();
	}

	function saveAddress() {
		let wsInfo = {
			ip: localIP,
			port: wsPort
		};
		sessionStorage.setItem('wsInfo', JSON.stringify(wsInfo));
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
		sock.onopen = function () {
			console.log('Connected to WebSocket server.');
		};
		sock.onmessage = function (event) {
			console.log('Received: ' + event.data);
			readings.push(event.data);
			//TODO: implement update logic to replace current best if needed
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

<section class="ws-info">
	<h1>{trainingStatus}</h1>
	<div>Websocket state: {resolveSockState(sock)}</div>
	<div>
		<label for="IP-input">Web socket IP:</label>
		<input type="text" id="IP-input" bind:value={localIP} placeholder="192.168.1.105" />
	</div>
	<div>
		<label for="port-input">Web socket port:</label>
		<input type="text" id="port-input" bind:value={wsPort} placeholder="3000" />
	</div>
	<div>
		<Button variant="primary" onClick={connect}>Connect WS</Button>
		<Button variant="secondary" onClick={disconnect}>Disconnect WS</Button>
	</div>
</section>

<style>
	.ws-info {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 20px;
		margin-left: 20px;
		/* justify-content: space-around; */
	}

	input {
		max-height: 20px;
	}
</style>
