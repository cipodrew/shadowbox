<!-- <svelte:options runes={true} /> ATTENZIONE: non ideomatico, potrebbe creare problemi -->
<script>
    import '../app.css'
    let { children } = $props()
  </script>
  
<nav>
  <a href="/">Home</a>
  <a href="/liveSession">live session</a>
  <a href="/history">Past sessions</a>
</nav>
  {@render children()}
  
  <style>
    nav {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
      flex-wrap: wrap;

      font-size: 1.25rem;
      font-weight: var(--fw-medium);
    }
    a {
      /* color: var(--text); */
      color: var(--secondary-500);
      text-decoration: none;
    }
    a:hover{
      opacity: 80%;
    }
  </style>