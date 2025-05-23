<script lang="ts">
	import { toast } from 'svelte-5-french-toast';

	import Carousel from '$lib/components/carousel/carousel.svelte';
	import SectionTitle from '$lib/components/SectionTitle.svelte';
	import { formatDate, getArticleType, getCategory, getPublicationStatus } from '$lib/utils.js';
	import DOMPurify from 'dompurify';
	import { onMount } from 'svelte';

	import LPC_FAV_BLT from '$lib/assets/logos/LPC_FAV_BLT.png';
	import logoC from '$lib/assets/logos/logoC.svg';
	import { goto, invalidate } from '$app/navigation';
	import WatchDetails from '$lib/components/WatchDetails.svelte';

	let sanitize: (input: string) => string;

	export let data;
	export let { article, user } = data;

	const metaDescription = article.introduction
		? `${article.introduction.substring(0, 157)}...`
		: `Découvrez cet article sur ${article.title} sur Les Petits Cadrans`;

	const userRole = Array.isArray(user?.User_Role) ? user.User_Role[0]?.role : user?.User_Role;

	let showDropdown = false;
	let selectedReason = '';

	const refusalReasons = [
		'Contenu inapproprié',
		"Manque d'informations",
		'Non conforme aux règles',
		'Autres raisons, merci de prendre contact'
	];

	async function updateStatus(newStatus: 'PUBLISHED' | 'REFUSED' | 'SUBMITTED', reason?: string) {
		try {
			const response = await fetch(`/api/_public/articles/manage/${article.id}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status: newStatus, reason })
			});

			if (response.ok) {
				toast.success("Statut de l'article mis à jour avec succès", {
					duration: 5000
				});
				invalidate('app:article');
				invalidate('app:articles');

				setTimeout(() => goto('/dashboard/manage'), 1000);
			}
		} catch (err) {
			console.error('Erreur lors de la mise à jour:', err);
			toast.error("Une erreur est survenue lors de la mise à jour de l'article.", {
				duration: 5000
			});
		}
	}

	function handleRefuseClick() {
		showDropdown = !showDropdown;
	}

	function submitRefusal() {
		if (!selectedReason) {
			toast.error('Veuillez sélectionner une raison de refus.', {
				duration: 5000
			});
			return;
		}
		updateStatus('REFUSED', selectedReason);
	}

	onMount(() => {
		sanitize = DOMPurify.sanitize;
	});
</script>

<svelte:head>
	<title>{article.title} | Les Petits Cadrans</title>
	<meta name="description" content={metaDescription} />
	<meta name="author" content={article.user?.username || 'Les Petits Cadrans'} />
	<meta
		name="keywords"
		content="montres, horlogerie, {article.category?.name || ''}, {article.title}"
	/> <meta property="og:title" content="{article.title} | Les Petits Cadrans" />
	<meta property="og:description" content={metaDescription} />
	<meta
		property="og:image"
		content={article.images && article.images.length
			? article.images[0]
			: '/default-article-image.jpg'}
	/>
	<meta property="og:type" content="article" />
	<meta property="og:url" content="https://lespetitscadrans.com/articles/{article.slug}" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="author" content={article.user?.username || 'Les Petits Cadrans'} />
	<meta
		name="keywords"
		content="montres, horlogerie, {article.category?.name || ''}, {article.title}"
	/>

	<!-- Structured Data for Article -->
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "Article",
			"headline": "{article.title}",
			"description": "{metaDescription}",
			"image": "{article.images && article.images.length ? article.images[0] : '/default-article-image.jpg'}",
			"datePublished": "{article.publish_date}",
			"author": {
				"@type": "Person",
				"name": "{article.user?.username || 'Les Petits Cadrans'}"
			},
			"publisher": {
				"@type": "Organization",
				"name": "Les Petits Cadrans",
				"logo": {
					"@type": "ImageObject",
					"url": "https://lespetitscadrans.com/favicon.svg"
				}
			},
			"mainEntityOfPage": {
				"@type": "WebPage",
				"@id": "https://lespetitscadrans.com/articles/{article.slug}"
			}
		}
	</script>
</svelte:head>

{#if article}
	<article class="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
		<SectionTitle title={article.title} level={1} />

		<div class="px-4 pb-10 sm:px-6 sm:pb-14 lg:px-10 lg:pb-10">
			{#if sanitize}
				<h2 class="mb-4">Introduction</h2>
				<p
					class="article-link mb-6 text-justify text-base font-semibold leading-relaxed sm:mb-8 sm:text-lg lg:mb-10 lg:text-xl"
				>
					{@html sanitize(article.introduction)}
				</p>
				<div class="mx-auto mb-6 flex h-[300px] sm:mb-8 lg:mb-10">
					<img
						src={article.images.length > 0 ? article.images[0] : LPC_FAV_BLT}
						alt="Article illustration"
						class=" h-full w-full rounded-xl object-cover {article.images === LPC_FAV_BLT
							? 'object-contain'
							: 'object-cover'}"
					/>
				</div>

				<p
					class="article-link mb-6 whitespace-pre-line text-justify text-base leading-relaxed sm:mb-8 sm:text-lg lg:mb-10 lg:text-xl"
				>
					{@html sanitize(article.body)}
				</p>

				<div class="mx-auto mb-6 flex h-[300px] sm:mb-8 lg:mb-10">
					{#if article.images && article.images.length > 1}
						<img
							src={article.images[1]}
							alt="Article illustration"
							class="h-full w-full rounded-xl object-cover"
						/>
					{:else}
						<img
							src={logoC}
							alt="Article illustration"
							class="h-full w-full rounded-xl bg-slate-900 object-fill p-8"
						/>
					{/if}
				</div>
				<h2 class="mb-4">Conclusion</h2>
				<p
					class="article-link mb-6 text-justify text-base leading-relaxed sm:mb-8 sm:text-lg lg:mb-10 lg:text-xl"
				>
					{@html sanitize(article.ending)}
				</p>
				<div class="text-sm sm:text-base">
					{#if article?.article_type}
						<a
							href="/articles?type={article.article_type}"
							class="font-normal italic text-black hover:text-black hover:underline"
						>
							{getArticleType(article.article_type)}
						</a>
					{/if}
					{#if article?.user?.username}
						Par <strong>{article.user.username}</strong>
					{/if}
					{#if article?.publish_date}
						le {formatDate(article.publish_date)}
					{/if}
					{#if article?.category?.name}
						dans <a
							href="/articles?category={article.category?.name}"
							class="font-normal italic text-black hover:text-black hover:underline"
						>
							{getCategory(article.category?.name)}
						</a>
					{/if}
				</div>
			{/if}
		</div>

		{#if userRole === 'ADMIN' || (userRole === 'MODERATOR' && article.status === 'SUBMITTED')}
			<div
				class="mx-auto mb-20 flex w-full flex-col flex-wrap items-center justify-center gap-10 rounded-lg bg-gray-100 p-10 lg:w-1/2"
			>
				<h3 class="text-center">
					Status actuel : <span class="font-extralight italic"
						>{getPublicationStatus(article.status)}</span
					>
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
						class="btn bg-red-400 text-xl font-bold hover:bg-red-300"
						on:click={handleRefuseClick}
					>
						Refuser
					</button>

					{#if showDropdown}
						<div class="mt-4 rounded-lg bg-gray-200 p-4">
							<label for="reason" class="mb-2 block font-semibold">Sélectionner une raison :</label>
							<select
								bind:value={selectedReason}
								id="reason"
								class="w-full rounded border border-gray-300 p-2"
							>
								<option value="" disabled>Sélectionnez une raison</option>
								{#each refusalReasons as reason}
									<option value={reason}>{reason}</option>
								{/each}
							</select>
							<button
								class="btn mt-4 w-full bg-red-500 font-bold text-white hover:bg-red-400"
								on:click={submitRefusal}
							>
								Confirmer le refus
							</button>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</article>

	<Carousel items={article.images} type="images" />

	<div class="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
		<WatchDetails {article} />
	</div>
{:else}
	<p>L'article est introuvable ou une erreur s'est produite.</p>
{/if}
