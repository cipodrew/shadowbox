<script>
	//to debug use chrome devtools ->Network tab -> WS
	import Button from '$lib/components/Button.svelte';
	import { onMount } from 'svelte';
	import { COMMUNICATION_PROTOCOL_VERSION } from '$lib/constants';

	/**
	 * @typedef {import('$lib/myTypes.js').Reading} Reading
	 * @typedef {import('$lib/myTypes.js').TrainingStatus} TrainingStatus
	 */

	/** @type {{ trainingStatus: TrainingStatus, sockState: any, allowStart: () => void, updateReadings: (reading: Reading) => void , sock: WebSocket | undefined, onClose: () => void }}
	 */
	let {
		trainingStatus,
		allowStart,
		sockState = $bindable(),
		updateReadings,
		sock = $bindable(),
		onClose
	} = $props();

	let localIP = $state('192.168.1.105');
	let wsPort = $state('3000');

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
		if (sock?.readyState === 1) {
			sock?.close();
		}
	}

	function connect() {
		// default IP 192.168.1.105
		//default port 3000
		if (wsPort === '') {
			wsPort = '3000';
		}
		sock = new WebSocket('ws://' + localIP + ':' + wsPort); //use wss for TLS channel
		// console.log(sock);
		sock.onopen = function () {
			console.log('Connected to WebSocket server.');
			sockState = 'connected';
			allowStart();
		};
		sock.onclose = function () {
			sockState = 'closed';
			onClose();
		};
		sock.onerror = function () {
			sockState = 'comunication error';
			console.log('connection error');
			alert('websocket connection lost! (is the embedded device running?)');
		};
		sock.onmessage = function (/** @type {{ data: string; }} */ event) {
			if (trainingStatus != 'in progress') {
				return; //early return if the training is not in progress
			}
			console.log('Received: ' + event.data);
			let messageFields = event.data.split('|');
			//Validation-----------
			if (messageFields.length != 6) {
				console.log('unxpected number of fields in message!');
			}
			if (messageFields[0] != COMMUNICATION_PROTOCOL_VERSION) {
				console.log('protocol version mismatch!');
				return;
			}
			if (messageFields[1] != 'R' && messageFields[1] != 'L') {
				console.log('unexpected side value!');
			}
			//----------Validation
			updateReadings({
				// @ts-ignore
				side: messageFields[1],
				xAccel: parseFloat(messageFields[2]),
				yAccel: parseFloat(messageFields[3]),
				zAccel: parseFloat(messageFields[4]),
				modulus: parseFloat(messageFields[5])
			});
			//TODO: implement update logic to replace current best if needed
		};
	}
</script>

<section class="ws-info">
	<!-- <h1>{trainingStatus}</h1> -->
	<div>Websocket state: {sockState}</div>
	<div>ready State: {sock?.readyState}</div>
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
