<script lang="ts">
	import Band from '$lib/components/band/band.svelte';
	import Card from '$lib/components/card/Card.svelte';
	import Carousel from '$lib/components/carousel/carousel.svelte';
	import Glycine from '$lib/assets/watches/Glycine.png';

	import type { PageData } from './$types';
	import SectionTitle from '$lib/components/SectionTitle.svelte';

	export let data: PageData;

	const articles = data.articles;

	// Séparez les articles en deux groupes
	const firstTwoArticles = articles.slice(0, 2); // Les deux premiers
	const remainingArticles = articles.slice(2); // Tous les articles après
</script>

<SectionTitle title="Derniers articles" />
<section class="mb-20 flex w-full flex-wrap justify-center gap-10 lg:gap-20 xl:gap-20">
	{#each firstTwoArticles as article}
		<Card
			props={{
				title: article.title,
				introduction: article.introduction,
				imageUrl: Glycine,
				author: article.user.username,
				category: article.category.name,
				id: article.id
			}}
		/>
	{/each}
</section>

<Band />

<SectionTitle title="Tous les articles" />
<section class="mb-20 flex w-full flex-wrap justify-center gap-10">
	{#each remainingArticles as article}
		<Card
			props={{
				title: article.title,
				introduction: article.introduction,
				imageUrl: Glycine,
				author: article.user.username,
				category: article.category.name,
				id: article.id
			}}
		/>
	{/each}
</section>

<div class="card-actions justify-center">
	<a href="articles">
		<button
			class="btn mb-20 bg-yellow-500 text-lg hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
			>Voir plus</button
		></a
	>
</div>
<SectionTitle title="Galerie" />
<Carousel />
