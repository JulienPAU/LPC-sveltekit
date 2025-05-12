<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { pushState } from '$app/navigation';

	export let isOpen: boolean = false;
	export let imageSrc: string = '';
	export let onClose: () => void;

	let modalElement: HTMLElement;
	let imageElement: HTMLImageElement;
	onMount(() => {
		if (browser && isOpen) {
			document.body.style.overflow = 'hidden';
			window.addEventListener('popstate', handlePopState);
			pushState('', '');

			window.addEventListener('keydown', handleKeydown);
		}
	});

	onDestroy(() => {
		if (browser) {
			document.body.style.overflow = '';
			window.removeEventListener('popstate', handlePopState);
			window.removeEventListener('keydown', handleKeydown);
		}
	});
	$: if (browser && isOpen) {
		document.body.style.overflow = 'hidden';
		pushState('', '');
		window.addEventListener('popstate', handlePopState);
		window.addEventListener('keydown', handleKeydown);
	} else if (browser && !isOpen) {
		document.body.style.overflow = '';
		window.removeEventListener('popstate', handlePopState);
		window.removeEventListener('keydown', handleKeydown);
	}

	function handlePopState(event: PopStateEvent) {
		onClose();
		pushState('', '');
	}

	function handleBackdropClick(event: MouseEvent) {
		if (imageElement && !imageElement.contains(event.target as Node)) {
			onClose();
		}
	}
	function handleBackdropKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			onClose();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onClose();
		}
	}
</script>

{#if isOpen}
	<dialog
		bind:this={modalElement}
		open={isOpen}
		class="fixed inset-0 z-50 m-0 flex h-full w-full items-center justify-center bg-transparent p-0 outline-none"
		style="background: rgba(0, 0, 0, 0.75); backdrop-filter: blur(4px);"
	>
		<div
			role="button"
			tabindex="0"
			aria-label="Fermer en cliquant en dehors de l'image"
			class="relative flex h-full w-full items-center justify-center p-4"
			on:click={handleBackdropClick}
			on:keydown={handleBackdropKeydown}
		>
			<img
				bind:this={imageElement}
				src={imageSrc}
				class="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
				alt="agrandie"
			/>
			<button
				class="absolute right-8 top-8 cursor-pointer text-6xl text-white hover:bg-opacity-75"
				on:click={onClose}
				aria-label="Fermer la modale"
			>
				&times;
			</button>
		</div>
	</dialog>
{/if}
