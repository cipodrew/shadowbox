<script>
	let {
		time = $bindable(),
		hours = $bindable(),
		minutes = $bindable(),
		seconds = $bindable(),
		text,
		trainingStatus,
		children
	} = $props();

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
