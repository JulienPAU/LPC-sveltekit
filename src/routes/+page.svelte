<script lang="ts">
	import Band from '$lib/components/band/band.svelte';
	import Card from '$lib/components/card/Card.svelte';
	import Carousel from '$lib/components/carousel/carousel.svelte';
	import Glycine from '$lib/assets/watches/Glycine.png';

	import type { PageData } from './$types';

	export let data: PageData;

	const articles = data.articles;

	// Séparez les articles en deux groupes
	const firstTwoArticles = articles.slice(0, 2); // Les deux premiers
	const remainingArticles = articles.slice(2); // Tous les articles après
</script>

<h2 class="mb-16 text-center">Derniers articles</h2>
<section class="mb-20 flex w-full flex-wrap justify-center gap-10">
	{#each firstTwoArticles as article}
		<Card
			props={{
				title: article.title,
				content: article.content,
				imageUrl: Glycine,
				author: article.user.last_name,
				category: article.category.name
			}}
		/>
	{/each}
</section>

<Band />
<h2 class="mb-16 text-center">Tous les articles</h2>

<section class="mb-20 flex w-full flex-wrap justify-center gap-10">
	{#each remainingArticles as article}
		<Card
			props={{
				title: article.title,
				content: article.content,
				imageUrl: Glycine,
				author: article.user.last_name,
				category: article.category.name
			}}
		/>
	{/each}
</section>

<div class="card-actions justify-center">
	<a href="articles">
		<button
			class="btn mb-20 bg-yellow-500 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
			>Voir plus</button
		></a
	>
</div>
<h2 class="mb-16 text-center">Galerie</h2>

<Carousel />
