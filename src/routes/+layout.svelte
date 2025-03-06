<!-- src/routes/%2Blayout.svelte -->

<script lang="ts">
	import { Toaster } from 'svelte-5-french-toast';
	import { navigating } from '$app/stores';

	import Footer from '$lib/components/footer/Footer.svelte';
	import '../app.css';
	import { page } from '$app/state';
	import Navbar from '$lib/components/header/Navbar.svelte';
	import ScrollToTop from '$lib/components/ScrollToTop .svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import CookieConsent from '$lib/components/CookieConsent.svelte';
	import Header from '$lib/components/header/header.svelte';

	let { children, data } = $props();

	let { watches } = data;

	const isHome = $derived(page.url.pathname === '/');

	const hiddenPages = ['/auth', '/dashboard'];

	$effect(() => {
		if (typeof document !== 'undefined') {
			if ($navigating) {
				document.body.classList.add('loading-cursor');
			} else {
				document.body.classList.remove('loading-cursor');
			}
		}
	});
</script>

<svelte:head>
	<style>
		.loading-cursor,
		.loading-cursor * {
			cursor: wait !important;
		}
	</style>
</svelte:head>

{#if isHome}
	<Header {watches} />
{:else}
	<Navbar {watches} />
	{#if !hiddenPages.includes(page.url.pathname)}
		<div class="container mx-auto px-4">
			<Breadcrumbs />
		</div>
	{/if}
{/if}

{@render children()}

<ScrollToTop />

<Footer />

<Toaster />

<CookieConsent />
