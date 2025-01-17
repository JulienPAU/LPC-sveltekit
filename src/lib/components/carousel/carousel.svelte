<script lang="ts">
	let carousel: HTMLDivElement | null = null;

	function scrollCarousel(direction: number) {
		if (carousel) {
			// direction = -1 (gauche) ou 1 (droite)
			// scrollLeft += direction * largeur du carrousel
			carousel.scrollLeft += direction * carousel.offsetWidth;
		}
	}
</script>

<div class="relative">
	<div bind:this={carousel} class="carousel carousel-end mb-20">
		<div class="carousel-item h-[500px]">
			<img
				src="/src/lib/assets/watches/Boderry_voyager.JPG"
				alt="Drink"
				class="h-full w-full object-cover"
			/>
		</div>
		<div class="carousel-item h-[500px]">
			<img src="/src/lib/assets/watches/casio.png" alt="Drink" class="h-full w-full object-cover" />
		</div>
		<div class="carousel-item h-[500px]">
			<img
				src="/src/lib/assets/watches/Glycine.png"
				alt="Drink"
				class="h-full w-full object-cover"
			/>
		</div>
		<div class="carousel-item h-[500px]">
			<img
				src="/src/lib/assets/watches/Humism.png"
				alt="Drink"
				class="h-full w-full object-cover"
			/>
		</div>
		<div class="carousel-item h-[500px]">
			<img src="/src/lib/assets/watches/olto.jpg" alt="Drink" class="h-full w-full object-cover" />
		</div>
		<div class="carousel-item h-[500px]">
			<img
				src="/src/lib/assets/watches/seagull.JPG"
				alt="Drink"
				class="h-full w-full object-cover"
			/>
		</div>
		<div class="carousel-item h-[500px]">
			<img src="/src/lib/assets/watches/seiko.JPG" alt="Drink" class="h-full w-full object-cover" />
		</div>
	</div>

	<!-- Flèches de navigation pour desktop -->
	<div class="hidden md:block">
		<button
			aria-label="boutton précédent"
			class=" btn-circle absolute bottom-0 left-5 z-10 flex -translate-y-1/2 items-center justify-center bg-gray-300 hover:bg-gray-200"
			on:click={() => scrollCarousel(-1)}
		>
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="h-6 w-6">
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
			class=" btn-circle absolute bottom-0 right-5 z-10 flex -translate-y-1/2 items-center justify-center bg-gray-300 hover:bg-gray-200"
			on:click={() => scrollCarousel(1)}
		>
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="h-6 w-6">
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
</div>
