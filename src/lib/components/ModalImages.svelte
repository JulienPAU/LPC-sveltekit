<!-- src/lib/components/ModalImages.svelte -->

<script lang="ts">
	export let isOpen: boolean = false;
	export let imageSrc: string = '';
	export let onClose: () => void;
</script>

{#if isOpen}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm transition-opacity duration-300"
	>
		<div class="relative flex h-full w-full items-center justify-center p-4">
			<img
				src={imageSrc}
				class="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
				alt="Full size"
			/>
			<button
				class="absolute right-4 top-4 text-6xl text-white"
				on:click={onClose}
				aria-label="Fermer la modale"
			>
				&times;
			</button>
		</div>
	</div>
{/if}
