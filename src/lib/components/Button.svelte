<script>
	/**
	 * @typedef Props
	 * @property {"primary" | "secondary"} variant
	 * @property {()=>void} [onClick]
	 * @property {import('svelte').Snippet} children
	 */
	/** @type {Props} */
	let { variant, onClick, children } = $props();
</script>

<!-- @component
- You can pass an event handler to this button.
- You can also pass Text to display in the button eg

```svelte
<Button variant="primary">
Text to display
</Button>

```
 -->

<button class={`btn-${variant}`} onclick={onClick}>
	{@render children()}
</button>
