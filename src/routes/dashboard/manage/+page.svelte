<script lang="ts">
	import Card from '$lib/components/card/Card.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import SectionTitle from '$lib/components/SectionTitle.svelte';
	import Skeleton from '$lib/components/skeleton.svelte';
	export let data;
	let { submittedArticles } = data;

	submittedArticles = Array.isArray(submittedArticles) ? submittedArticles : [];

	let currentPage = 1;
	const itemsPerPage = 12;

	$: totalPages = Math.ceil(submittedArticles.length / itemsPerPage);

	$: paginatedArticles = submittedArticles.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);
</script>

<div class="flex flex-col items-center">
	<SectionTitle title="Gérer les articles" />

	<section class="mb-20 flex w-full flex-wrap justify-center gap-10 px-4 lg:gap-20 xl:gap-20">
		{#if !submittedArticles}
			{#each Array(submittedArticles.length) as _}
				<Skeleton
					containerClass="xl:w-1/5 card w-96 bg-base-100 p-2  sm:w-1/6 md:w-2/5 lg:w-1/6 "
					imageClass="h-[100px] "
				/>
			{/each}
		{:else if submittedArticles.length === 0}
			<div class="flex flex-col items-center justify-center space-y-6">
				<p class="text-center text-2xl font-semibold italic">
					Vous êtes à jour, aucun article à valider.
				</p>
			</div>
		{:else}
			{#each paginatedArticles as a}
				<Card
					props={{
						title: a.title,
						introduction: a.introduction,
						imageUrl: a.images[0],
						author: '',
						article_type: a.article_type,
						category: '',
						submit_date: a.submit_date,
						publish_date: '',
						id: a.id,
						isDashboard: false,
						isModerator: true,
						isAdmin: false,
						carouselClasses: false,

						status: a.status,
						imgStyle: 'h-[150px]',
						style:
							'card w-96 bg-base-100  shadow-lg transition-shadow  duration-500  hover:shadow-xl  md:w-2/5 lg:w-2/6 '
					}}
				/>
			{/each}
		{/if}
	</section>
	<Pagination {currentPage} {totalPages} onPageChange={(page) => (currentPage = page)} />
</div>
