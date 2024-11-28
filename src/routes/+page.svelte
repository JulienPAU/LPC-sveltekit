<script lang="ts">
	import Card from '$lib/components/card/Card.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h2 class="mb-16 text-center">Derniers articles</h2>
<section class="flex w-full flex-wrap justify-center gap-5">
	{#each data.articles as article}
		<Card
			title={article.title}
			content={article.content}
			imageUrl="https://via.placeholder.com/150"
			author={article.user.last_name}
			category={article.category.name}
		/>
	{/each}
</section>
