<script>
	let { time, hours, minutes, seconds, text, trainingStatus, children } = $props();
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
