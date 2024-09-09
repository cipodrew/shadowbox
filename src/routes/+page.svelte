<script>
	//const test = "test"

	import Button from '$lib/components/Button.svelte';
</script>

<svelte:head>
	<title>Home Page</title>
</svelte:head>
<div class="wrapper">
	<h1 class="heading-1">Welcome to ShadowBox!</h1>
	<div class="hero">
		<h2 class="heading-2">What do you want to do Today?</h2>
		<main class="cards">
			<a href="/liveSession" class="btn-primary">Track my session</a>
			<a href="/history" class="btn-secondary">View previous statistics</a>
		</main>
	</div>
	<div class="about">
		<h2 class="heading-2">About this app</h2>
		<section class="about-text">
			This Application is a fitness tracker that keeps track of your progress in a session or over
			time. It needs an Arduino Board connected to the your local Wifi network to function
			<br />
			The name is a play on the term "shadow-boxe" which refers to a practice of training alone used
			in boxing in which one tries to visualize an opponent.
			<br />
			This application is supposed to "shadow" your training and record each punch your throw by using
			a device located inside a "box" (and secured on your arm or wrist)
		</section>
	</div>
</div>

<style>
	/*for debug*/
	/** {*/
	/*	border: 2px solid tomato;*/
	/*}*/

	.wrapper {
		/* display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center; */
		display: grid;
		place-items: center;
		gap: 20px;
	}
	.hero {
		background-color: var(--accent-200);
		border-radius: 5px;
		text-align: center;
	}
	.cards {
		display: grid;
		grid-template-columns: 1fr 1fr;
		/* grid-template-rows: repeat(1fr); */
		place-items: center;
	}

	.cards a {
		font-weight: var(--fw-bold);
		text-decoration: none;
	}

	@media (min-width: 600px) {
		.hero {
			grid-auto-flow: column;
			grid-auto-columns: 1fr;
		}
	}

	.about {
		background-color: var(--background-200);
		color: var(--text);
		border-radius: 3px;
		margin: 0 20px;
		padding: 20px;
	}
</style>
