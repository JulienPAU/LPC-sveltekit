<script lang="ts">
	import Footer from '$lib/components/footer/Footer.svelte';
	import Header from '$lib/components/header/Header.svelte';
	import '../app.css';
	let { children } = $props();

	const content = `Passionné(e) par l'univers des montres, qu'elles soient classiques, modernes ou uniques ? Ce
				site est fait pour vous ! Découvrez des articles dédiés aux garde-temps qui marquent les
				heures et les esprits, et partagez votre passion en proposant vos propres articles. Ici,
				chaque cadran raconte une histoire, et la vôtre mérite d'être entendue.`;
</script>

<Header title="Bienvenue sur Les Petits Cadrans !" {content} />

{@render children()}

<Footer />
