<!-- src/routes/%2Blayout.svelte -->

<script lang="ts">
	import Footer from '$lib/components/footer/Footer.svelte';
	import Header from '$lib/components/header/Header.svelte';
	import '../app.css';
	import { page } from '$app/state';
	import Navbar from '$lib/components/header/Navbar.svelte';
	import ScrollToTop from '$lib/components/ScrollToTop .svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';

	let { children, data } = $props();

	let { watches } = data;

	const isHome = $derived(page.url.pathname === '/');

	const hiddenPages = ['/auth', '/dashboard'];

	const content = `Passionné(e) par l'univers des montres, qu'elles soient classiques, modernes ou uniques ? Ce
				site est fait pour vous ! Découvrez des articles dédiés aux garde-temps qui marquent les
				heures et les esprits, et partagez votre passion en proposant vos propres articles. Ici,
				chaque cadran raconte une histoire, et la vôtre mérite d'être entendue.`;
</script>

{#if isHome}
	<Header title="Bienvenue sur Les Petits Cadrans !" {content} {watches} />
{:else}
	<Navbar {watches} />
	<div class="container mx-auto px-4">
		{#if !hiddenPages.includes(page.url.pathname)}
			<div class="container mx-auto px-4">
				<Breadcrumbs />
			</div>
		{/if}
	</div>
{/if}

{@render children()}

<ScrollToTop />

<div class="container mx-auto px-4">
	<Breadcrumbs />
</div>

<Footer />
