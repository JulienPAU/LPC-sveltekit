<script lang="ts">
	import Card from '$lib/components/card/Card.svelte';
	import Glycine from '$lib/assets/watches/Glycine.png';

	export let data;
	const { articles } = data;
</script>

<section class="mb-20 flex w-full flex-wrap justify-center gap-10">
	{#each articles as article}
		<Card
			props={{
				title: article.title,
				content: article.content,
				imageUrl: Glycine,
				author: article.user.last_name,
				category: article.category.name
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

	<a href="#">
		<button
			class="btn mb-20 bg-yellow-500 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
			>Charger +
		</button></a
	>
</div>
