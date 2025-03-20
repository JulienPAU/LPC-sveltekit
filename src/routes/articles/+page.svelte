<!-- src/ routes/ articles/ +page. svelte -->

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

	$: totalPages = Array.isArray(filteredArticles)
		? Math.ceil(filteredArticles.length / itemsPerPage)
		: 0;
	$: paginatedArticles = Array.isArray(filteredArticles)
		? filteredArticles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
		: [];

	function handleFilterChange(newFilteredArticles: any) {
		filteredArticles = Array.isArray(newFilteredArticles) ? newFilteredArticles : [];
		currentPage = 1;
	}

	function resetArticles() {
		if (!browser) return;

		if (
			page.url.searchParams.has('type') ||
			page.url.searchParams.has('category') ||
			page.url.searchParams.has('brand') ||
			page.url.searchParams.has('sort')
		) {
			return;
		}

		const cameFromHome = page.url.searchParams.get('from') === 'home';

		if (!cameFromHome) {
			localStorage.removeItem('viewedArticleIds');
			filteredArticles = data.articles;
		} else {
			viewedArticleIds = JSON.parse(localStorage.getItem('viewedArticleIds') || '[]');
			filteredArticles = articles.filter(
				(article: { id: string }) => !viewedArticleIds.includes(article.id)
			);
		}
	}

	afterNavigate(({ from, to }) => {
		if (!browser) return;

		// Si la navigation vient d'un changement de filtre, ne pas réinitialiser
		const toHasFilterParams =
			to?.url.searchParams.has('type') ||
			to?.url.searchParams.has('category') ||
			to?.url.searchParams.has('brand') ||
			to?.url.searchParams.has('sort');

		if (!toHasFilterParams) {
			resetArticles();
		}
	});

	onMount(() => {
		if (!browser) return;

		// Filtrer les articles selon ces paramètres
		const typeParam = page.url.searchParams.get('type');
		const categoryParam = page.url.searchParams.get('category');
		const brandParam = page.url.searchParams.get('brand');
		const sortParam = page.url.searchParams.get('sort');

		if (typeParam || categoryParam || brandParam || sortParam) {
			let filtered = [...articles];

			if (typeParam) filtered = filtered.filter((article) => article.article_type === typeParam);
			if (categoryParam)
				filtered = filtered.filter((article) => article.category?.name === categoryParam);

			if (brandParam) {
				filtered = filtered.filter((article) =>
					article.ArticleWatches.some(
						(aw: { watch?: { brand?: string } }) => aw.watch?.brand === brandParam
					)
				);
			}

			if (sortParam) {
				filtered = filtered.sort((a, b) => {
					if (sortParam === 'newest') return b.id - a.id;
					if (sortParam === 'oldest') return a.id - b.id;
					return b.id - a.id;
				});
			}

			filteredArticles = filtered;
		} else {
			resetArticles();
		}

		if (document.readyState === 'complete') {
			loading = false;
		} else {
			// Sinon, attendre que tout soit chargé
			window.addEventListener('load', () => {
				loading = false;
			});
		}
	});
</script>

<SectionTitle title="Articles" />

<section class="mx-auto flex flex-col items-center justify-center">
	<Filtres
		{articles}
		onFilterChange={handleFilterChange}
		initialType={page.url.searchParams.get('type') || ''}
		initialCategory={page.url.searchParams.get('category') || ''}
		initialBrand={page.url.searchParams.get('brand') || ''}
		initialSort={page.url.searchParams.get('sort') || ''}
	/>
	<Pagination {currentPage} {totalPages} onPageChange={(page) => (currentPage = page)} />

	<div class="mb-20 flex w-full flex-wrap justify-center gap-14 px-4">
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
						carouselClasses: false,
						status: 'PUBLISHED',
						imgStyle: 'h-[250px] lg:h-[400px]',
						style:
							'  card w-96 bg-base-100  shadow-lg transition-shadow  duration-500  hover:shadow-xl sm:w-4/5 md:w-96 lg:w-2/6'
					}}
				/>
			{/each}
		{/if}
	</div>

	<!-- <div class="card-actions justify-evenly">
		<a href="/">
			<button
				class="btn mb-20 bg-yellow-500 text-lg font-bold hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
			>
				Retour à l'accueil
			</button>
		</a>
	</div> -->
</section>
