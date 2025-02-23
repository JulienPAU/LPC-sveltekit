<script lang="ts">
	import Card from '$lib/components/card/Card.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import SectionTitle from '$lib/components/SectionTitle.svelte';
	import Skeleton from '$lib/components/skeleton.svelte';

	export let data;

	let { allArticles } = data;

	let currentPage = 1;
	const itemsPerPage = 12;

	$: totalPages = Math.ceil(allArticles.length / itemsPerPage);

	$: paginatedArticles = allArticles.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);
</script>

<div class=" flex flex-col items-center">
	<SectionTitle title="Modifier les articles" />
	<Pagination {currentPage} {totalPages} onPageChange={(page) => (currentPage = page)} />

	<section class="mb-20 flex w-full flex-wrap justify-center gap-10 lg:gap-20 xl:gap-20">
		{#if !allArticles}
			{#each Array(allArticles.length) as _}
				<Skeleton
					containerClass="xl:w-1/5 card w-96 bg-base-100 p-2  sm:w-1/6 md:w-2/5 lg:w-1/6 "
					imageClass="h-[100px] "
				/>
			{/each}
		{:else if allArticles.length === 0}
			<div class="flex flex-col items-center justify-center space-y-6">
				<p class="text-center text-2xl font-semibold italic">
					Vous n'avez pas encore publié d'article.
				</p>
				<p class="border-b-4 border-warning text-xl font-bold">
					C'est le moment d'en proposer un !
				</p>
				<div class=" flex justify-center space-x-4">
					<a
						href="/dashboard/publish"
						class="rounded-md bg-yellow-500 px-6 py-3 font-bold text-black hover:bg-yellow-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
					>
						Proposer un article
					</a>
				</div>
			</div>
		{:else}
			{#each paginatedArticles as a}
				<Card
					props={{
						title: a.title,
						introduction: a.introduction,
						imageUrl: a.images[0],
						author: a.user.username,
						article_type: a.article_type,
						category: '',
						submit_date: a.submit_date,
						publish_date: a.publish_date,
						id: a.id,
						isDashboard: true,
						isModerator: false,
						isAdmin: true,
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
