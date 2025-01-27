<!-- src/routes/articles/[id]/+page.svelte -->
<script lang="ts">
	import Carousel from '$lib/components/carousel/carousel.svelte';
	import SectionTitle from '$lib/components/SectionTitle.svelte';
	import { formatDate } from '$lib/utils.js';

	export let data;
	export let { article } = data;
	// console.log('data reçue:', article);
</script>

{#if article}
	<section class="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
		<SectionTitle title={article.title} />

		<div class="px-4 pb-10 sm:px-6 sm:pb-14 lg:px-10 lg:pb-20">
			<p
				class="mb-6 text-base font-semibold leading-relaxed sm:mb-8 sm:text-lg lg:mb-10 lg:text-xl"
			>
				{article.introduction}
			</p>
			<img
				src={article.images[0] || '/LPC_FAV_BLT.png'}
				alt="Article illustration"
				class="mx-auto mb-6 w-full sm:mb-8 sm:w-4/5 lg:mb-10 lg:w-3/5"
			/>
			<p class="mb-6 text-base leading-relaxed sm:mb-8 sm:text-lg lg:mb-10 lg:text-xl">
				{article.body}
			</p>

			<p class="mb-6 text-base leading-relaxed sm:mb-8 sm:text-lg lg:mb-10 lg:text-xl">
				{article.ending}
			</p>
			<div class="text-sm sm:text-base">
				Par <strong>{article.user.username}</strong> le {formatDate(article.publish_date)} dans
				<i>{article.article_type}</i>
			</div>
		</div>
		<!-- <div class="image-gallery">
			{#each article.images as image}
				<img src={image.url} alt=" l'article" class="image-item" />
			{/each}
		</div> -->
	</section>
	<Carousel images={article.images} />
{:else}
	<p>L'article est introuvable ou une erreur s'est produite.</p>
{/if}
