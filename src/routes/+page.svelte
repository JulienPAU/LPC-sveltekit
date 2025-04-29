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

	let loading = true;
	const articles = Array.isArray(data.articles) ? data.articles : [];

	const imageUrls = (Array.isArray(articles) ? articles : []).flatMap((article: any) =>
		Array.isArray(article.images) ? article.images : []
	);

	const firstFiveArticles = articles.slice(0, 5);
	const remainingArticles = articles.slice(5, 11);

	const viewedArticleIds = firstFiveArticles
		.concat(remainingArticles)
		.map((article: any) => article.id);

	onMount(() => {
		localStorage.setItem('viewedArticleIds', JSON.stringify(viewedArticleIds));

		if (document.readyState === 'complete') {
			loading = false;
		} else {
			window.addEventListener('load', () => {
				loading = false;
			});
		}
	});

	async function refreshData() {
		await invalidate('articles');
	}
</script>

<svelte:head>
	<title>Les Petits Cadrans | Passion horlogère et montres de collection</title>
	<meta
		name="description"
		content="Découvrez Les Petits Cadrans, site dédié aux montres de collection, actualités horlogères et conseils d'experts pour les passionnés d'horlogerie."
	/>
	<meta property="og:title" content="Les Petits Cadrans | Passion horlogère" />
	<meta
		property="og:description"
		content="Site spécialisé dans les montres de collection et l'horlogerie de luxe."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://lespetitscadrans.com/" />
</svelte:head>

<SectionTitle title="Derniers articles" />
<Carousel items={firstFiveArticles} type="articles" />

<Band />

<section class="mb-20 flex w-full flex-wrap justify-center gap-14 px-4">
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
							: undefined,
					author: article.user.username,
					article_type: article.article_type,
					category: article.category,
					submit_date: '',
					publish_date: '',
					id: article.id,
					isDashboard: false,
					isModerator: false,
					isAdmin: false,
					carouselClasses: false,
					status: 'PUBLISHED',
					imgStyle: 'h-[250px] lg:h-[400px]',
					style:
						' card w-96 bg-base-100 shadow-lg transition-shadow duration-500 hover:shadow-xl sm:w-4/5 md:w-96 lg:w-2/6'
				}}
			/>
		{/each}
	{/if}
</section>

<div class="card-actions justify-center">
	<a href="/articles?from=home">
		<button
			class="mb-20 rounded-md bg-yellow-500 px-6 py-3 text-xl font-bold text-black hover:bg-yellow-400 hover:text-black"
		>
			Voir plus
		</button>
	</a>
</div>

<!-- <SectionTitle title="Galerie" /> -->
<Carousel items={imageUrls} type="images" />
