<!-- src/routes/articles/[id]/+page.svelte -->
<script lang="ts">
	import Carousel from '$lib/components/carousel/carousel.svelte';
	import SectionTitle from '$lib/components/SectionTitle.svelte';
	import { formatDate } from '$lib/utils.js';

	export let data;
	export let { article, user } = data;

	const userRole = Array.isArray(user?.User_Role) ? user.User_Role[0]?.role : user?.User_Role;

	async function updateStatus(newStatus: 'PUBLISHED' | 'REFUSED' | 'SUBMITTED') {
		try {
			const response = await fetch(`/api/_public/articles/manage/${article.id}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status: newStatus })
			});

			if (response.ok) {
				window.location.href = '/dashboard/articles';
			}
		} catch (err) {
			console.error('Erreur lors de la mise à jour:', err);
		}
	}

	console.log('article id:', article);
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

		{#if userRole === 'ADMIN' || (userRole === 'MODERATOR' && article.status === 'SUBMITTED')}
			<div
				class="mx-auto mb-20 flex w-full flex-col flex-wrap items-center justify-center gap-10 rounded-lg bg-gray-100 p-10 lg:w-1/2"
			>
				<h3 class="text-center">
					Status actuel : <span class="font-extralight italic">{article.status.toLowerCase()}</span>
				</h3>
				<div class="flex w-full flex-wrap justify-evenly gap-10">
					<button
						class="btn bg-green-400 text-xl font-bold hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
						on:click={() => updateStatus('PUBLISHED')}
					>
						Publier
					</button>

					<button
						class="btn bg-yellow-400 text-xl font-bold hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
						on:click={() => updateStatus('SUBMITTED')}
					>
						Retirer l'article
					</button>

					<button
						class="btn bg-red-400 text-xl font-bold hover:bg-red-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
						on:click={() => updateStatus('REFUSED')}
					>
						Refuser
					</button>
				</div>
			</div>
		{/if}
	</section>
	<Carousel items={article.images} type="images" />
{:else}
	<p>L'article est introuvable ou une erreur s'est produite.</p>
{/if}
