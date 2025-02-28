<!-- src/routes/gallery/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import SectionTitle from '$lib/components/SectionTitle.svelte';
	import logoC from '$lib/assets/logos/logoC.svg';
	import Loader from '$lib/components/loader.svelte';
	import ModalImages from '$lib/components/ModalImages.svelte';
	import Pagination from '$lib/components/Pagination.svelte';

	export let data;
	let { gallery } = data;

	gallery = Array.isArray(gallery) ? gallery : [];

	let isModalOpen = false;
	let modalImageSrc = '';
	let loading = true;
	let isMobile = false;
	let imagesLoaded = 0;
	let totalImagesToLoad = 0;
	let currentVisibleImages: {
		src: string;
		globalIndex: number;
		isPlaceholder: boolean;
		isLarge: boolean;
	}[] = [];
	let preloadingComplete = false;

	let currentPage = 1;
	const itemsPerPage = 15;

	// Cache pour les résultats coûteux
	let totalImagesCache: number | null = null;
	let cachedImages = new Map();

	$: totalPages = Math.ceil(getTotalImages() / itemsPerPage);
	$: startIndex = (currentPage - 1) * itemsPerPage;
	$: endIndex = startIndex + itemsPerPage;

	function openModal(imageSrc: string) {
		// Précharger l'image avant d'ouvrir la modale
		const img = new Image();
		img.onload = () => {
			modalImageSrc = imageSrc;
			isModalOpen = true;
		};
		img.src = imageSrc;

		// Fallback si l'image met trop de temps à charger
		setTimeout(() => {
			if (!isModalOpen && modalImageSrc !== imageSrc) {
				modalImageSrc = imageSrc;
				isModalOpen = true;
			}
		}, 300);
	}

	function closeModal() {
		isModalOpen = false;
	}

	function getTotalImages(): number {
		if (totalImagesCache !== null) return totalImagesCache;

		totalImagesCache = gallery.reduce(
			(total: number, item: { images?: string[] }) => total + (item.images?.length || 0),
			0
		);

		return totalImagesCache ?? 0;
	}

	function getVisibleImages() {
		const cacheKey = `${currentPage}-${isMobile}`;
		if (cachedImages.has(cacheKey)) {
			return cachedImages.get(cacheKey);
		}

		const images = [];
		let count = 0;
		let groupCount = 0;
		let currentCount = 0;

		// Récupérer toutes les images de la galerie
		for (const item of gallery) {
			if (item.images && item.images.length > 0) {
				for (const image of item.images) {
					// Vérifier si l'image est dans la page actuelle
					if (count >= startIndex && count < endIndex) {
						const isLarge = groupCount === 0;

						images.push({
							src: image,
							globalIndex: count,
							isPlaceholder: false,
							isLarge
						});

						currentCount++;
						groupCount = (groupCount + 1) % 8;
					}
					count++;
				}
			}
		}

		// Calculer combien d'éléments sont nécessaires pour compléter le dernier groupe
		const columnsPerRow = isMobile ? 2 : 7;
		const remainingInGroup = columnsPerRow - (groupCount % columnsPerRow || columnsPerRow);

		// Ajouter les logos pour compléter le groupe
		for (let i = 0; i < remainingInGroup; i++) {
			images.push({
				src: logoC,
				globalIndex: count + i,
				isPlaceholder: true,
				isLarge: false
			});
		}

		cachedImages.set(cacheKey, images);
		return images;
	}

	// Fonction pour gérer le changement de page
	function handlePageChange(page: number) {
		imagesLoaded = 0;
		loading = true;
		preloadingComplete = false;
		currentPage = page;

		// Petit délai pour s'assurer que l'UI se met à jour avant de commencer le préchargement
		setTimeout(() => {
			// Précalculer les images pour définir totalImagesToLoad
			currentVisibleImages = getVisibleImages().filter(
				(img: { isPlaceholder: boolean }) => !img.isPlaceholder
			);
			totalImagesToLoad = currentVisibleImages.length;

			// Si aucune image à charger, on arrête le loading
			if (totalImagesToLoad === 0) {
				loading = false;
			}

			// Force la mise à jour du DOM pour le préchargement
			preloadingComplete = true;
		}, 10);

		// Ajouter un timeout de sécurité (5 secondes max)
		setTimeout(() => {
			if (loading) {
				console.warn('Timeout de chargement atteint - Affichage forcé de la galerie');
				loading = false;
			}
		}, 3000); // Réduit à 3 secondes pour une meilleure réactivité
	}

	// Fonction pour suivre le chargement des images
	function handleImageLoad() {
		imagesLoaded++;
		// Supprimé le log de débogage pour améliorer les performances
		if (imagesLoaded >= totalImagesToLoad && totalImagesToLoad > 0) {
			loading = false;
		}
	}

	// Throttle pour limiter les appels lors du redimensionnement
	function throttle(fn: Function, delay: number) {
		let lastCall = 0;
		return function (...args: any[]) {
			const now = new Date().getTime();
			if (now - lastCall < delay) return;
			lastCall = now;
			return fn(...args);
		};
	}

	// Fonction pour vérifier si l'appareil est mobile
	function checkMobile() {
		if (browser) {
			isMobile = window.innerWidth < 1024;
		}
	}

	onMount(() => {
		checkMobile();
		const throttledCheck = throttle(checkMobile, 200);
		window.addEventListener('resize', throttledCheck);

		// Initialiser les images visibles pour la première page
		currentVisibleImages = getVisibleImages().filter(
			(img: { isPlaceholder: boolean }) => !img.isPlaceholder
		);
		totalImagesToLoad = currentVisibleImages.length;
		preloadingComplete = true;

		// Si aucune image à charger, on arrête le loading
		if (totalImagesToLoad === 0) {
			loading = false;
		}

		// Timeout de sécurité pour le chargement initial
		setTimeout(() => {
			if (loading) {
				loading = false;
			}
		}, 3000); // Réduit à 3 secondes

		return () => {
			window.removeEventListener('resize', throttledCheck);
		};
	});
</script>

<SectionTitle title="Galerie" />

<Pagination {currentPage} {totalPages} onPageChange={handlePageChange} />

<div class="container mx-auto mb-8 px-4">
	{#if loading}
		<Loader />
	{:else}
		{@const hasImages = getTotalImages() > 0}
		{#if hasImages}
			{@const images = getVisibleImages()}
			<div class="grid grid-cols-2 gap-2 lg:grid-cols-7">
				{#each images as { src, isPlaceholder, isLarge }}
					<div
						class="relative overflow-hidden rounded-lg {isLarge
							? isMobile
								? ''
								: 'col-span-2 row-span-2'
							: ''}"
					>
						{#if !isPlaceholder}
							<button
								on:click={() => openModal(src)}
								class="h-full w-full"
								aria-label="Cliquez pour agrandir l'image"
							>
								<img
									{src}
									alt="galerie"
									loading="lazy"
									width="400"
									height="300"
									fetchpriority={isLarge ? 'high' : 'auto'}
									decoding="async"
									class="h-full w-full object-cover {isLarge ? 'aspect-square' : 'aspect-video'}"
									on:load={handleImageLoad}
									style="opacity: 1; transition: opacity 0.3s ease-in-out; will-change: opacity;"
								/>
							</button>
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
	{/if}
</div>

<!-- Cette div cachée précharge les images de la page actuelle -->
{#if preloadingComplete}
	<div class="hidden">
		{#each currentVisibleImages as { src }}
			<img {src} alt="preload" on:load={handleImageLoad} />
		{/each}
	</div>
{/if}

<!-- Modal -->
<ModalImages isOpen={isModalOpen} imageSrc={modalImageSrc} onClose={closeModal} />
