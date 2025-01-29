<script lang="ts">
	import Card from '$lib/components/card/Card.svelte';

	export let data;
	const { articles } = data;
</script>

<!-- <SectionTitle title="Articles" /> -->

<section class="mb-20 mt-20 flex w-full flex-wrap justify-center gap-10 lg:gap-20">
	{#each articles as article}
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

<div class="card-actions justify-evenly">
	<a href="/">
		<button
			class="btn mb-20 bg-yellow-500 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
		>
			Accueil
		</button></a
	>

	<a href="/articles">
		<button
			class="btn mb-20 bg-yellow-500 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
			>Charger +
		</button></a
	>
</div>
