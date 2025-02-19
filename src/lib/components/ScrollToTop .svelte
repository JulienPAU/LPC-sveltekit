<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, scale } from 'svelte/transition';

	let isVisible = false;

	onMount(() => {
		const toggleVisibility = () => {
			isVisible = window.pageYOffset > 300;
		};

		window.addEventListener('scroll', toggleVisibility);

		return () => {
			window.removeEventListener('scroll', toggleVisibility);
		};
	});

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	};
</script>

{#if isVisible}
	<button
		on:click={scrollToTop}
		class="fixed bottom-8 right-8 z-50 rounded-full bg-yellow-500 p-3 text-black
             shadow-lg transition-all duration-300 hover:scale-110 hover:bg-yellow-400
             focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
		aria-label="Retour en haut de page"
		transition:fade={{ duration: 200 }}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="m18 15-6-6-6 6" />
		</svg>
	</button>
{/if}
