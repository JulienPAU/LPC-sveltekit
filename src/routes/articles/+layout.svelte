<script>
	import Navbar from '$lib/components/header/Navbar.svelte';
	let { children } = $props();
</script>

<Navbar />

{@render children()}
