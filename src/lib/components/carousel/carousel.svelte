<script lang="ts">
	let carousel: HTMLDivElement | null = null;
	export let images: string[];

	function scrollCarousel(direction: number) {
		if (carousel) {
			carousel.scrollLeft += direction * carousel.offsetWidth;
		}
	}

	$: processedImages =
		images?.length > 0
			? images.sort(() => 0.5 - Math.random()).slice(0, 10)
			: [
					'/src/lib/assets/watches/Boderry_voyager.JPG',
					'/src/lib/assets/watches/casio.png',
					'/src/lib/assets/watches/Glycine.png',
					'/src/lib/assets/watches/Humism.png',
					'/src/lib/assets/watches/olto.jpg',
					'/src/lib/assets/watches/seagull.png',
					'/src/lib/assets/watches/seiko.JPG'
				];
</script>

<div class="relative mb-10 flex items-center justify-center">
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

	<div
		bind:this={carousel}
		class="carousel mx-0 flex w-full snap-x overflow-x-auto md:mx-2 lg:mx-3"
	>
		{#if processedImages.length > 0}
			{#each processedImages as image}
				<div class="carousel-item h-[250px] w-[253px] flex-shrink-0 snap-center">
					<img
						src={image}
						alt="article"
						class="h-full w-full rounded-xl border-2 border-white object-cover"
					/>
				</div>
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
