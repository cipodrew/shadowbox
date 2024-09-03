<script>
	let { text, trainingStatus, children } = $props();

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
		if (trainingStatus === 'stopped') {
			clearInterval(interval_id);
			alreadyset = false;
		}
		if (trainingStatus === 'done') {
			clearInterval(interval_id);
			alreadyset = false;
		}
	});
</script>

<div class="crono">
	<!-- <div>seconds passed:{time}</div> -->
	<div>{text}<span class="numbers">{hours}hh:{minutes}mm:{seconds}ss</span></div>
</div>
{@render children()}

<style>
	.crono {
		display: flex;
		flex-direction: row;
		gap: 20px;
	}
	.numbers {
		font-size: var(--fs-700);
	}
</style>
