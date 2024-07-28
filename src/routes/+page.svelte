<svelte:head>
    <title>Home Page</title>
</svelte:head>
<div class="wrapper">
    <h1 class="heading-1">Welcome to ShadowBox!</h1>
    <div class="hero">
        <h2 class="heading-2">What do you want to do Today?</h2>
    <main class="cards">
        <div class="button"><a href="/liveSession">Track my session</a></div>
        <div class="button"><a href="/history">View previous statistics</a></div>
    </main>
    </div>
    <div class="about">
        <h2 class="heading-2">About this app</h2>
        <section class="about">
            This Application is a fitness tracker that keeps track of your progress in a session or over time.
            It needs an Arduino Board connected to the your local Wifi network to function
        </section>
    </div>
</div>

<style>
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
        background-color: var(--secondary-200);
    }
    .cards {
        display: grid;
        grid-template-columns: 1fr 1fr;
        /* grid-template-rows: repeat(1fr); */
        place-items: center;
    }
    .button {
        padding: 1.25rem;
        background-color: var(--primary-400);
        color: var(--text);

        border-style: solid;
        border-width: 2px;
        border-color: var(--clr-neutral-dark);
        border-radius: 7px;

        font-weight: 300;
    }

    .button a {
        color: var(--text);
        font-weight: var(--fw-bold);
        text-decoration: none;
    }

    .button:hover {
        background-color: var(--primary-500);
    }

    @media (min-width: 600px) {
    .hero {
        grid-auto-flow: column;
        grid-auto-columns: 1fr;
    }
}
</style>