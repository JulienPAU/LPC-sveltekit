<script lang="ts">
	import Card from '$lib/components/card/Card.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import SectionTitle from '$lib/components/SectionTitle.svelte';
	import Skeleton from '$lib/components/skeleton.svelte';
	export let data;
	const { submittedArticles } = data;

	let currentPage = 1;
	const itemsPerPage = 12;

	$: totalPages = Math.ceil(submittedArticles.length / itemsPerPage);

	$: paginatedArticles = submittedArticles.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	// console.log('article soumis', submittedArticles);
</script>

<div class=" flex flex-col items-center">
	<SectionTitle title="Gérer les articles" />
	<Pagination {currentPage} {totalPages} onPageChange={(page) => (currentPage = page)} />

	<section class="mb-20 flex w-full flex-wrap justify-center gap-10 lg:gap-20 xl:gap-20">
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
						category: a.article_type,
						submit_date: a.submit_date,
						publish_date: '',
						id: a.id,
						isDashboard: false,
						isModerator: true,
						isAdmin: false,
						status: a.status,
						imgStyle: 'h-[100px]',
						style:
							' tranform card w-96 bg-base-100 shadow-xl transition duration-500 hover:scale-105  md:w-2/5 lg:w-1/6 '
					}}
				/>
			{/each}
		{/if}
		<Pagination {currentPage} {totalPages} onPageChange={(page) => (currentPage = page)} />
	</section>
</div>
