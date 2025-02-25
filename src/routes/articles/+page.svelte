<script lang="ts">
	import Card from '$lib/components/card/Card.svelte';
	import Filtres from '$lib/components/filtres.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import SectionTitle from '$lib/components/SectionTitle.svelte';
	import Skeleton from '$lib/components/skeleton.svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';

	export let data;
	let { articles } = data;

	let loading = true;
	let viewedArticleIds: string[] = [];
	let filteredArticles = Array.isArray(articles) ? articles : [];
	let currentPage = 1;
	const itemsPerPage = 10;

	$: totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
	$: paginatedArticles = filteredArticles.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	function handleFilterChange(newFilteredArticles: any) {
		filteredArticles = Array.isArray(newFilteredArticles) ? newFilteredArticles : [];
		currentPage = 1;
	}

	function resetArticles() {
		if (!browser) return;

		const cameFromHome = page.url.searchParams.get('from') === 'home';

		if (!cameFromHome) {
			// Si on vient de la navbar, on affiche tous les articles
			localStorage.removeItem('viewedArticleIds');
			filteredArticles = data.articles;
		} else {
			// Si on vient de l'accueil, on filtre les articles déjà vus
			viewedArticleIds = JSON.parse(localStorage.getItem('viewedArticleIds') || '[]');
			filteredArticles = articles.filter(
				(article: { id: string }) => !viewedArticleIds.includes(article.id)
			);
		}
	}

	// Utiliser afterNavigate pour réagir aux changements de navigation
	afterNavigate(() => {
		if (browser) resetArticles();
	});

	onMount(() => {
		if (!browser) return;
		resetArticles();
		loading = false;
	});
</script>

<SectionTitle title="Articles" />

<section class="container mx-auto px-4">
	<Filtres {articles} onFilterChange={handleFilterChange} />

	<Pagination {currentPage} {totalPages} onPageChange={(page) => (currentPage = page)} />

	<div class="mb-20 mt-20 flex w-full flex-wrap justify-center gap-10 lg:gap-20">
		{#if loading}
			{#each Array(itemsPerPage) as _}
				<Skeleton containerClass="flex-col sm:w-4/5 md:w-96 lg:w-2/6 p-4" imageClass="h-[490px]" />
			{/each}
		{:else}
			{#each paginatedArticles as article}
				<Card
					props={{
						title: article.title,
						introduction: article.introduction,
						imageUrl: article.images[0],
						author: article.user.username,
						article_type: article.article_type,
						category: article.category,
						id: article.id,
						isDashboard: false,
						isModerator: false,
						publish_date: '',
						submit_date: '',
						isAdmin: false,
						status: 'PUBLISHED',
						imgStyle: 'h-[400px]',
						style:
							'xl:w3/5  card w-96 bg-base-100  shadow-lg transition-shadow  duration-500  hover:shadow-xl sm:w-4/5 md:w-96 lg:w-2/6'
					}}
				/>
			{/each}
		{/if}
	</div>
	<Pagination {currentPage} {totalPages} onPageChange={(page) => (currentPage = page)} />

	<div class="card-actions justify-evenly">
		<a href="/">
			<button
				class="btn mb-20 bg-yellow-500 text-lg font-bold hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
			>
				Retour à l'accueil
			</button>
		</a>
	</div>
</section>
