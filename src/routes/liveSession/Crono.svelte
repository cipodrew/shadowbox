<script>
	let time = $state(0);
	let hours = $derived(Math.floor(time / (60 * 60)));
	let minutes = $derived(Math.floor(time / 60));
	let seconds = $derived(time % 60);
	setInterval(() => {
		time++;
	}, 1000);
</script>

<div class="crono">
	<div>seconds passed:{time}</div>
	<div>{hours}hh:{minutes}mm:{seconds}ss</div>
</div>

<style>
	.crono {
		display: flex;
		flex-direction: nowrap;
		gap: 20px;

		font-size: var(--fs-800);
	}
</style>
