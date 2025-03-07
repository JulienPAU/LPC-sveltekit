<!-- src/lib/components/carousel/carousel.svelte -->

<script lang="ts">
	import { onMount } from 'svelte';
	import Card from '../card/Card.svelte';
	import Skeleton from '../skeleton.svelte';
	import ModalImages from '../ModalImages.svelte';

	let carousel: HTMLDivElement | null = null;

	export let items: (string | any)[];
	export let type: 'images' | 'articles' = 'images';

	let loading = true;
	let isModalOpen = false;
	let modalImageSrc = '';

	function scrollCarousel(direction: number) {
		if (carousel) {
			carousel.scrollLeft += direction * carousel.offsetWidth;
		}
	}

	$: processedItems =
		type === 'images'
			? items?.length > 0
				? items.sort(() => 0.5 - Math.random()).slice(0, 10)
				: [
						'/src/lib/assets/watches/Boderry_voyager.JPG',
						'/src/lib/assets/watches/casio.png',
						'/src/lib/assets/watches/Glycine.png',
						'/src/lib/assets/watches/Humism.png',
						'/src/lib/assets/watches/olto.jpg',
						'/src/lib/assets/watches/seagull.png',
						'/src/lib/assets/watches/seiko.JPG'
					]
			: items.slice(0, 10);

	$: carouselClasses = `carousel mx-0 flex w-full snap-x overflow-x-auto px-4 flex   md:mx-2 lg:mx-3 ${
		type === 'images' ? 'gap-2 mb-4   ' : 'gap-6 pb-8 lg:pb-10'
	}`;

	function openModal(imageSrc: string) {
		modalImageSrc = imageSrc;
		isModalOpen = true;
	}

	function closeModal() {
		isModalOpen = false;
	}

	onMount(() => {
		const closeModalButton = document.getElementById('closeModal');
		if (closeModalButton) {
			closeModalButton.addEventListener('click', closeModal);
		}
	});

	$: if (items && items.length > 0) {
		loading = false;
	}

	// Simuler un délai de chargement
	// setTimeout(() => {
	// 	loading = false;
	// }, 10000); // Délai de 2 secondes pour montrer le skeleton
</script>

<div class="relative mb-6 flex items-center justify-center px-4">
	<!-- Boutons de navigation pour desktop -->
	<button
		aria-label="boutton précédent"
		class="btn-circle ml-2 hidden bg-gray-300 hover:bg-gray-200 md:block"
		on:click={() => scrollCarousel(-1)}
	>
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="mx-auto h-6 w-6">
			<path
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M15 19l-7-7 7-7"
			/>
		</svg>
	</button>

	<div bind:this={carousel} class={carouselClasses}>
		<!-- Le contenu existant du carousel reste inchangé -->
		{#if loading}
			{#each Array(items.length) as _}
				<Skeleton
					containerClass="flex-shrink-0 flex-col md:w-96 lg:w-[420px]"
					imageClass="h-[350px]"
					{type}
				/>
			{/each}
		{:else if processedItems.length > 0}
			{#each processedItems as item}
				{#if type === 'images'}
					<div class="carousel-item h-[250px] w-[253px] flex-shrink-0 snap-center">
						<button
							type="button"
							class="h-full w-full rounded-xl object-cover"
							on:click={() => openModal(item)}
							on:keydown={(e) => e.key === 'Enter' && openModal(item)}
							aria-label="Cliquez pour agrandir l'image"
							style="background-image: url({item}); background-size: cover; background-position: center;"
						></button>
					</div>
				{:else}
					<div class="carousel-item relative w-[350px] flex-shrink-0 snap-center lg:w-[420px]">
						<Card
							props={{
								title: item.title,
								introduction: item.introduction,
								imageUrl:
									Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : undefined,
								author: item.user.username,
								article_type: item.article_type,
								category: item.category,
								submit_date: '',
								publish_date: '',
								id: item.id,
								isDashboard: false,
								isModerator: false,
								isAdmin: false,
								status: 'PUBLISHED',
								imgStyle: 'h-[250px]',
								style:
									' card w-full bg-base-100 shadow-lg transition-shadow duration-500 hover:shadow-xl overflow-hidden '
							}}
						/>
					</div>
				{/if}
			{/each}
		{/if}
	</div>

	<!-- Boutons de navigation pour mobile superposés aux cartes (uniquement pour les articles) -->
	{#if type === 'articles'}
		<div
			class="pointer-events-none absolute bottom-6 left-0 right-0 flex h-full items-center justify-between px-2 md:hidden"
		>
			<button
				aria-label="boutton précédent"
				class="btn-circle btn-sm pointer-events-auto bg-white shadow-md hover:bg-opacity-90"
				on:click={() => scrollCarousel(-1)}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					class="mx-auto h-4 w-4"
				>
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 19l-7-7 7-7"
					/>
				</svg>
			</button>
			<button
				aria-label="boutton suivant"
				class="b btn-circle btn-sm pointer-events-auto bg-white shadow-md hover:bg-opacity-90"
				on:click={() => scrollCarousel(1)}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					class="mx-auto h-4 w-4"
				>
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 5l7 7-7 7"
					/>
				</svg>
			</button>
		</div>
	{/if}

	<button
		aria-label="boutton suivant"
		class="btn-circle mr-2 hidden bg-gray-300 hover:bg-gray-200 md:block"
		on:click={() => scrollCarousel(1)}
	>
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="mx-auto h-6 w-6">
			<path
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M9 5l7 7-7 7"
			/>
		</svg>
	</button>
</div>

<ModalImages isOpen={isModalOpen} imageSrc={modalImageSrc} onClose={closeModal} />
