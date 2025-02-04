<!-- src/routes/articles/[id]/+page.svelte -->
<script lang="ts">
	import Carousel from '$lib/components/carousel/carousel.svelte';
	import SectionTitle from '$lib/components/SectionTitle.svelte';
	import { formatDate } from '$lib/utils.js';

	export let data;
	export let { article } = data;

	// console.log('article:', article);
</script>

{#if article}
	<section class="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
		<SectionTitle title={article.title} />

		<div class="px-4 pb-10 sm:px-6 sm:pb-14 lg:px-10 lg:pb-20">
			<h3>Introduction</h3>
			<p
				class="mb-6 text-base font-semibold leading-relaxed sm:mb-8 sm:text-lg lg:mb-10 lg:text-xl"
			>
				{article.introduction}
			</p>
			<div class="mx-auto mb-6 flex h-[300px] sm:mb-8 lg:mb-10">
				<img
					src={article.images.length > 0 ? article.images[0] : '/LPC_FAV_BLT.png'}
					alt="Article illustration"
					class=" h-full w-full rounded-xl object-cover"
				/>
			</div>

			<p
				class="mb-6 whitespace-pre-line text-base leading-relaxed sm:mb-8 sm:text-lg lg:mb-10 lg:text-xl"
			>
				{article.body}
			</p>

			<div class="mx-auto mb-6 flex h-[300px] sm:mb-8 lg:mb-10">
				<img
					src={article.images.length > 0 ? article.images[1] : '/LPC_FAV_BLT.png'}
					alt="Article illustration"
					class=" h-full w-full rounded-xl object-cover"
				/>
			</div>
			<h3>Conclusion</h3>
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
	<Carousel items={article.images} type="images" />
{:else}
	<p>L'article est introuvable ou une erreur s'est produite.</p>
{/if}
