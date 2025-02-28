<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	export let isOpen: boolean = false;
	export let imageSrc: string = '';
	export let onClose: () => void;

	let modalElement: HTMLElement;
	let imageElement: HTMLImageElement;

	// Gestion du scroll et des touches du navigateur
	onMount(() => {
		if (browser && isOpen) {
			// Désactiver le scroll
			document.body.style.overflow = 'hidden';

			// Gérer la touche retour sur mobile
			window.addEventListener('popstate', handlePopState);
			// Sauvegarder l'état pour pouvoir revenir en arrière
			history.pushState({ modal: true }, '');

			// Ajouter un gestionnaire d'événement pour Escape
			window.addEventListener('keydown', handleKeydown);
		}
	});

	onDestroy(() => {
		// Nettoyage des événements
		if (browser) {
			document.body.style.overflow = '';
			window.removeEventListener('popstate', handlePopState);
			window.removeEventListener('keydown', handleKeydown);
		}
	});

	// Mise à jour lorsque isOpen change
	$: if (browser && isOpen) {
		document.body.style.overflow = 'hidden';
		if (typeof history !== 'undefined') {
			history.pushState({ modal: true }, '');
			window.addEventListener('popstate', handlePopState);
			window.addEventListener('keydown', handleKeydown);
		}
	} else if (browser && !isOpen) {
		document.body.style.overflow = '';
		window.removeEventListener('popstate', handlePopState);
		window.removeEventListener('keydown', handleKeydown);
	}

	// Gestionnaire pour le bouton retour
	function handlePopState(event: PopStateEvent) {
		onClose();
		// Empêcher le retour à la page précédente
		history.pushState(null, '');
	}

	// Gestionnaire pour les clics sur l'arrière-plan
	function handleBackdropClick(event: MouseEvent) {
		// Vérifier si le clic est sur l'image ou non
		if (!imageElement.contains(event.target as Node)) {
			onClose();
		}
	}
	function handleBackdropKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			onClose();
		}
	}

	// Gestionnaire pour les touches du clavier
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onClose();
		}
	}
</script>

{#if isOpen}
	<!-- Utilisation d'un dialog pour l'accessibilité -->
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
