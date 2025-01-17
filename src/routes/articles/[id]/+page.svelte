<!-- src/routes/articles/[id]/+page.svelte -->
<script lang="ts">
	import Glycine from '$lib/assets/watches/Glycine.png';
	import Carousel from '$lib/components/carousel/carousel.svelte';
	import SectionTitle from '$lib/components/SectionTitle.svelte';
	import { formatDate } from '$lib/utils.js';

	export let data;
	export let { article } = data;
	console.log('data reçue:', article); // Pour debug
</script>

{#if article}
	<section class="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
		<SectionTitle title={article.title} />

		<div class="px-4 pb-10 sm:px-6 sm:pb-14 lg:px-10 lg:pb-20">
			<p
				class="mb-6 text-base font-semibold leading-relaxed sm:mb-8 sm:text-lg lg:mb-10 lg:text-xl"
			>
				Intro : Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo odit, quia ipsam unde
				dicta modi quis nesciunt, ad maiores quam placeat quos id est inventore expedita? Optio
				laudantium minima cumque! Corporis odit soluta accusantium autem explicabo, fuga illum nam
				incidunt ratione neque velit repudiandae similique qui corrupti vel dolores quas recusandae
				consequatur consectetur quo porro dolorem iure vero. Temporibus, magnam? Voluptatum cum
				voluptate aperiam, delectus velit aut quidem ut nisi eveniet, excepturi, ex ipsam facere
				harum aspernatur sint! Non consequuntur quae quis ea optio reprehenderit doloremque sed unde
				animi qui! Assumenda, et dolorum a id impedit non? Consectetur id velit expedita commodi ex
				aperiam magnam nihil modi perferendis cumque! Neque distinctio dolores atque illum odio
				voluptates eum quam quae in? Perspiciatis enim tempora nobis consequuntur laboriosam fugit
			</p>
			<img
				src={Glycine}
				alt="Article illustration"
				class="mx-auto mb-6 w-full sm:mb-8 sm:w-4/5 lg:mb-10 lg:w-3/5"
			/>
			<p class="mb-6 text-base leading-relaxed sm:mb-8 sm:text-lg lg:mb-10 lg:text-xl">
				{article.content}
			</p>
			<div class="text-sm sm:text-base">
				Par <strong>{article.user.username}</strong> le {formatDate(article.publish_date)} dans
				<i>{article.article_type}</i>
			</div>
		</div>
	</section>
	<Carousel />
{:else}
	<p>L'article est introuvable ou une erreur s'est produite.</p>
{/if}
