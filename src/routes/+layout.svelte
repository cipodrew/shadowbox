<script>
	import '../app.css';
	let { children } = $props();
</script>

<nav>
	<a href="/">Home</a>
	<a href="/liveSession">Live session</a>
	<a href="/history">Past sessions</a>
</nav>
{@render children()}

<!-- <div class="footer">Site footer</div> -->

<style>
	nav {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 20px;
		flex-wrap: wrap;

		margin-bottom: 10px;

		font-size: 1.25rem;
		font-weight: var(--fw-medium);
	}
	a {
		/* color: var(--text); */
		color: var(--secondary-500);
		text-decoration: none;
	}
	a:hover {
		opacity: 80%;
	}

	/* .footer {
		position: absolute;
		bottom: 0;
		left: 0;
		z-index: 10;
	} */
</style>
