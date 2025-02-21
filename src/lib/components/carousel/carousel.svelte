<script lang="ts">
	import { onMount } from 'svelte';
	import Card from '../card/Card.svelte';
	import Skeleton from '../skeleton.svelte';

	let carousel: HTMLDivElement | null = null;

	export let items: (string | any)[];
	export let type: 'images' | 'articles' = 'images';

	let loading = true;

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
		type === 'images' ? 'gap-2   ' : 'gap-6 py-10'
	}`;

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

<div class="relative mb-10 flex items-center justify-center px-4">
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
					<div class="carousel-item w-[350px] flex-shrink-0 snap-center lg:w-[420px]">
						<Card
							props={{
								title: item.title,
								introduction: item.introduction,
								imageUrl:
									Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : undefined,
								author: item.user.username,
								category: item.article_type,
								submit_date: '',
								publish_date: '',
								id: item.id,
								isDashboard: false,
								isModerator: false,
								isAdmin: false,
								status: 'PUBLISHED',
								imgStyle: 'h-[250px]',
								style:
									'transform card w-full bg-base-100 shadow-xl transition duration-500 hover:scale-105  overflow-hidden '
							}}
						/>
					</div>
				{/if}
			{/each}
		{/if}
	</div>

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
		<button id="closeModal" class="absolute right-4 top-4 text-6xl text-white">&times;</button>
	</div>
</div>
