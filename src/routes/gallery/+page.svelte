<script lang="ts">
	import { onMount } from 'svelte';
	import SectionTitle from '$lib/components/SectionTitle.svelte';
	import logoC from '$lib/assets/logos/logoC.svg';
	import Loader from '$lib/components/loader.svelte';

	export let data;
	let { gallery } = data;

	const ITEMS_PER_LOAD = 20;
	let visibleItems = ITEMS_PER_LOAD;
	let loading = false;

	function openModal(imageSrc: string) {
		const modal = document.getElementById('imageModal');
		const modalImage = document.getElementById('modalImage');
		if (modalImage) {
			(modalImage as HTMLImageElement).src = imageSrc;
		}
		if (modal) {
			modal.classList.remove('hidden');
		}
	}

	function closeModal() {
		const modal = document.getElementById('imageModal');
		if (modal) {
			modal.classList.add('hidden');
		}
	}

	function loadMore() {
		if (!loading && visibleItems < getTotalImages()) {
			loading = true;
			setTimeout(() => {
				visibleItems += ITEMS_PER_LOAD;
				loading = false;
			}, 300);
		}
	}

	function getTotalImages(): number {
		return gallery.reduce(
			(total: number, item: { images?: string[] }) => total + (item.images?.length || 0),
			0
		);
	}

	function getVisibleImages() {
		const images = [];
		let count = 0;
		let groupCount = 0;

		// Récupérer toutes les images de la galerie
		for (const item of gallery) {
			if (item.images && item.images.length > 0) {
				for (const image of item.images) {
					if (count >= visibleItems) break;

					// Une grande image tous les 6 éléments (au début de chaque groupe)
					const isLarge = groupCount === 0;

					images.push({
						src: image,
						globalIndex: count,
						isPlaceholder: false,
						isLarge
					});

					count++;
					groupCount = (groupCount + 1) % 6;
				}
			}
		}

		// Calculer combien d'éléments sont nécessaires pour compléter le dernier groupe de 6
		const remainingInGroup = 7 - (groupCount || 6);

		// Ajouter les logos pour compléter le groupe
		for (let i = 0; i < remainingInGroup; i++) {
			images.push({
				src: logoC,
				globalIndex: count + i,
				isPlaceholder: true,
				isLarge: false
			});
		}

		return images;
	}

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && !loading) {
						loadMore();
					}
				});
			},
			{ rootMargin: '100px' }
		);

		const sentinel = document.querySelector('#sentinel');
		if (sentinel) observer.observe(sentinel);

		return () => observer.disconnect();
	});
</script>

<div class="container mx-auto px-4 py-8">
	<SectionTitle title="Galerie" />

	{#if getTotalImages() > 0}
		{@const images = getVisibleImages()}
		<div class="grid grid-cols-3 gap-2 lg:grid-cols-7">
			{#each images as { src, isPlaceholder, isLarge }}
				<div class="relative overflow-hidden rounded-lg {isLarge ? 'col-span-2 row-span-2' : ''}">
					{#if !isPlaceholder}
						<button
							on:click={() => openModal(src)}
							class="h-full w-full"
							aria-label="Cliquez pour agrandir l'image"
						>
							<img
								{src}
								alt="gallery"
								loading="lazy"
								class="h-full w-full object-cover {isLarge ? 'aspect-square' : 'aspect-video'}"
							/>
						</button>
						<div class="absolute bottom-4 right-4 h-2 w-2 rounded-full bg-white"></div>
					{:else}
						<div class="flex h-full w-full items-center justify-center bg-slate-900 p-4">
							<img {src} alt="logo" class="object-contain" />
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{:else}
		<div class="flex justify-center">
			<div class="w-1/3 rounded-lg bg-slate-900 p-8 shadow-lg">
				<img src={logoC} alt="logo" class="mx-auto object-contain" />
			</div>
		</div>
	{/if}

	{#if visibleItems < getTotalImages()}
		<div id="sentinel" class="h-4 w-full"></div>
	{/if}

	{#if loading}
		<div class="flex justify-center p-4">
			<div
				class="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
			></div>
		</div>
	{/if}
</div>

<!-- Modal -->
<div
	id="imageModal"
	class="fixed inset-0 z-50 hidden items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm transition-opacity duration-300"
>
	<div class="relative flex h-full w-full items-center justify-center p-4">
		<img
			id="modalImage"
			class="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
			alt="Full size"
		/>
		<button
			class="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-4xl text-white transition-colors hover:bg-white/20"
			on:click={closeModal}
			aria-label="Fermer la modale"
		>
			&times;
		</button>
	</div>
</div>

{#if loading}
	<Loader />
{/if}
