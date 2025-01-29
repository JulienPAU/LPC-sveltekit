<script lang="ts">
	import Band from '$lib/components/band/band.svelte';
	import Card from '$lib/components/card/Card.svelte';
	import Carousel from '$lib/components/carousel/carousel.svelte';

	import type { PageData } from './$types';
	import SectionTitle from '$lib/components/SectionTitle.svelte';
	import Loader from '$lib/components/loader.svelte';

	export let data: PageData;

	let loading = true;

	if (data) {
		loading = false;
	}
	const articles = data.articles;
	// console.log('data reçue:', articles);

	// Extraire les images de tous les articles
	const imageUrls = articles.flatMap((article: { images: string[] }) => article.images);

	// console.log(imageUrls); // Vérification des URLs

	// Séparez les articles en deux groupes
	const firstTwoArticles = articles.slice(0, 4); // Les deux premiers
	const remainingArticles = articles.slice(4); // Tous les articles après
</script>

{#if loading}
	<Loader />
{:else}
	<SectionTitle title="Derniers articles" />
	<section class="mb-20 flex w-full flex-wrap justify-center gap-20 lg:gap-20 xl:gap-10">
		{#each firstTwoArticles as article}
			<Card
				props={{
					title: article.title,
					introduction: article.introduction,
					imageUrl: article.images[0],
					author: article.user.username,
					category: article.article_type,
					id: article.id,
					isDashboard: false,
					status: 'PUBLISHED',
					style:
						'xl:w3/5 tranform card w-96 bg-base-100 shadow-xl transition duration-500 hover:scale-105  md:w-4/5 lg:w-1/5 h-[400px]'
				}}
			/>
		{/each}
	</section>

	<Band />

	<SectionTitle title="Tous les articles" />
	<section class="mb-20 flex w-full flex-wrap justify-center gap-14">
		{#each remainingArticles as article}
			<Card
				props={{
					title: article.title,
					introduction: article.introduction,
					imageUrl: article.images[0],
					author: article.user.username,
					category: article.article_type,
					id: article.id,
					isDashboard: false,
					status: 'PUBLISHED',
					style:
						'xl:w3/5 tranform card w-96 bg-base-100 shadow-xl transition duration-500 hover:scale-105 sm:w-4/5 md:w-96 lg:w-2/6'
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
	<Carousel images={imageUrls} />
{/if}
