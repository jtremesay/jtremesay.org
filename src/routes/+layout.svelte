<script lang="ts">
	import Footer from './Footer.svelte';
	import Header from './Header.svelte';

	let { children } = $props();
</script>

<header>
	<Header />
</header>

<hr />

<main>
	{@render children()}
</main>

<hr />

<footer>
	<Footer />
</footer>
