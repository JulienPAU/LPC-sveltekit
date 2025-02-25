<script lang="ts">
	import Band from '$lib/components/band/band.svelte';
	import Card from '$lib/components/card/Card.svelte';
	import Carousel from '$lib/components/carousel/carousel.svelte';
	import Skeleton from '$lib/components/skeleton.svelte';
	import type { PageData } from './$types';
	import SectionTitle from '$lib/components/SectionTitle.svelte';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	export let data: PageData;

	let loading = true; // Initialiser à true pour montrer le skeleton
	const articles = Array.isArray(data.articles) ? data.articles : [];

	const imageUrls = (Array.isArray(articles) ? articles : []).flatMap((article: any) =>
		Array.isArray(article.images) ? article.images : []
	);

	const firstFiveArticles = articles.slice(0, 5);
	const remainingArticles = articles.slice(5, 11);

	$: if (data && data.articles) {
		loading = false;
	}

	// Sur la page d'accueil, stockez les IDs des articles affichés
	const viewedArticleIds = firstFiveArticles
		.concat(remainingArticles)
		.map((article: any) => article.id);

	onMount(() => {
		localStorage.setItem('viewedArticleIds', JSON.stringify(viewedArticleIds));
	});

	// Simuler un délai de chargement
	// setTimeout(() => {
	// 	loading = false;
	// }, 10000); // Délai de 2 secondes pour montrer le skeleton

	async function refreshData() {
		await invalidate('articles');
	}
</script>

<SectionTitle title="Derniers articles" />
<Carousel items={firstFiveArticles} type="articles" />

<Band />

<section class="mb-20 flex w-full flex-wrap justify-center gap-14">
	{#if loading}
		{#each Array(remainingArticles.length) as _}
			<Skeleton containerClass="flex-col sm:w-4/5 md:w-96 lg:w-2/6 p-4" imageClass="h-[490px]" />
		{/each}
	{:else}
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
					article_type: article.article_type,
					category: article.category,
					submit_date: '',
					publish_date: '',
					id: article.id,
					isDashboard: false,
					isModerator: false,
					isAdmin: false,
					status: 'PUBLISHED',
					imgStyle: 'h-[400px]',
					style:
						'xl:w3/5 card w-96 bg-base-100 shadow-lg transition-shadow duration-500 hover:shadow-xl sm:w-4/5 md:w-96 lg:w-2/6'
				}}
			/>
		{/each}
	{/if}
</section>

<div class="card-actions justify-center">
	<a href="/articles?from=home">
		<button
			class="btn mb-20 bg-yellow-500 text-xl font-bold hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
		>
			Voir plus
		</button>
	</a>
</div>

<SectionTitle title="Galerie" />
<Carousel items={imageUrls} type="images" />
