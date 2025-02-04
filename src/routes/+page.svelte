<!-- src/routes/+page.svelte -->

<script lang="ts">
	import Band from '$lib/components/band/band.svelte';
	import Card from '$lib/components/card/Card.svelte';
	import Carousel from '$lib/components/carousel/carousel.svelte';

	import type { PageData } from './$types';
	import SectionTitle from '$lib/components/SectionTitle.svelte';
	import Loader from '$lib/components/loader.svelte';
	import { invalidate } from '$app/navigation';

	export let data: PageData;

	let loading = data ? false : true;
	const articles = data.articles;
	// console.log('Données reçues:', articles);

	// Extraire toutes les images pour la galerie
	const imageUrls = articles.flatMap((article: any) =>
		Array.isArray(article.images) ? article.images : []
	);

	// Séparer les articles en deux groupes
	const firstTenArticles = articles.slice(0, 10);
	const remainingArticles = articles.slice(10);

	async function refreshData() {
		await invalidate('articles');
	}
</script>

{#if loading}
	<Loader />
{:else}
	<SectionTitle title="Derniers articles" />
	<Carousel items={firstTenArticles} type="articles" />

	<Band />

	<SectionTitle title="Tous les articles" />
	<section class="mb-20 flex w-full flex-wrap justify-center gap-14">
		{#each remainingArticles as article}
			<Card
				props={{
					title: article.title,
					introduction: article.introduction,
					imageUrl:
						Array.isArray(article.images) && article.images.length > 0
							? article.images[0]
							: undefined, // Fallback géré dans Card
					author: article.user.username,
					category: article.article_type,
					id: article.id,
					isDashboard: false,
					status: 'PUBLISHED',
					imgStyle: 'h-[400px]',
					style:
						'xl:w3/5 transform card w-96 bg-base-100 shadow-xl transition duration-500 hover:scale-105 sm:w-4/5 md:w-96 lg:w-2/6'
				}}
			/>
		{/each}
	</section>

	<div class="card-actions justify-center">
		<a href="articles">
			<button
				class="btn mb-20 bg-yellow-500 text-lg hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
			>
				Voir plus
			</button>
		</a>
	</div>

	<SectionTitle title="Galerie" />
	<Carousel items={imageUrls} type="images" />
{/if}
