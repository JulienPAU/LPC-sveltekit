<script lang="ts">
	import Card from '$lib/components/card/Card.svelte';
	import SectionTitle from '$lib/components/SectionTitle.svelte';
	import Skeleton from '$lib/components/skeleton.svelte';

	export let data;

	$: brandArticle = data.brandArticle;
	$: brand = data.brand;
	$: loading = true;

	$: {
		if (data && data.brandArticle) {
			loading = false;
		}
	}
</script>

{#if data?.brandArticle?.length === 0}
	<p
		class="mx-auto mt-20 w-4/5 rounded-lg bg-gray-200 p-4 text-center text-2xl font-bold italic md:mt-72 md:w-3/5 lg:mt-52 lg:w-1/5"
	>
		Aucun article n'a encore été publié pour la marque {brand}
	</p>
{:else}
	<SectionTitle title="Articles concernant la marque {brand}" />
{/if}

<section class="mb-20 mt-20 flex w-full flex-wrap justify-center gap-10 lg:gap-20">
	{#if loading}
		{#each Array(brandArticle.length) as _}
			<Skeleton containerClass="flex-col sm:w-4/5 md:w-96 lg:w-2/6 p-4" imageClass="h-[490px]" />
		{/each}
	{:else}
		{#each brandArticle as article}
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
						'xl:w3/5 card w-96 bg-base-100  shadow-lg transition-shadow  duration-500  hover:shadow-xl sm:w-4/5 md:w-96 lg:w-2/6 '
				}}
			/>
		{/each}
	{/if}
</section>

<div class="card-actions justify-evenly">
	<a href="/">
		<button
			class="btn mb-20 bg-yellow-500 text-lg font-bold hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
		>
			Retour à l'accueil
		</button>
	</a>
</div>
