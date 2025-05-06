<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import ArticleForm from '$lib/components/form/ArticleForm.svelte';
	import ImageUploader from '$lib/components/ImageUploader.svelte';
	import SectionTitle from '$lib/components/SectionTitle.svelte';
	import { DEFAULT_FILE_VALIDATION } from '$lib/types/article';
	import toast from 'svelte-5-french-toast';

	let selectedFiles: File[] = [];
	let isSubmitting = false;
	let articleId: number | null = null;
	let uploadProgress = 0;
	let currentFileIndex = 0;
	let processingStep = ''; // Pour afficher l'étape actuelle

	let selectedStraps: string[] = [];

	function handleStrapsChange(straps: string[]) {
		selectedStraps = straps;
	}

	function handleFilesSelected(files: File[]) {
		selectedFiles = files;
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();
		isSubmitting = true;
		uploadProgress = 0;
		processingStep = "Création de l'article...";

		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);

		// Vérifier qu'il y a au moins une image
		if (selectedFiles.length === 0) {
			toast('Minimum une photo requise', { duration: 5000 });
			isSubmitting = false;
			return;
		}

		try {
			// ÉTAPE 1: Créer l'article sans les images
			const response = await fetch('/api/_public/articles/publish', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				const errorData = await response.json();
				toast.error(errorData.message || "Erreur lors de la création de l'article", {
					duration: 5000
				});
				isSubmitting = false;
				return;
			}

			const result = await response.json();
			articleId = result.articleId;

			if (!articleId) {
				toast.error("ID de l'article manquant dans la réponse", { duration: 5000 });
				isSubmitting = false;
				return;
			}

			// ÉTAPE 2: Télécharger les images une par une
			processingStep = 'Téléchargement des images...';
			const uploadedUrls = [];
			currentFileIndex = 0;

			for (const file of selectedFiles) {
				currentFileIndex++;
				uploadProgress = Math.round((currentFileIndex / selectedFiles.length) * 100);
				processingStep = `Téléchargement de l'image ${currentFileIndex}/${selectedFiles.length}: ${file.name}`;

				const imageFormData = new FormData();
				imageFormData.append('file', file);

				const uploadResponse = await fetch(`/api/_public/article_id/${articleId}/upload-image`, {
					method: 'POST',
					body: imageFormData
				});

				if (!uploadResponse.ok) {
					console.error(`Échec du téléchargement pour ${file.name}`);
					continue;
				}

				const uploadResult = await uploadResponse.json();
				if (uploadResult.imageUrl) {
					uploadedUrls.push(uploadResult.imageUrl);
				}
			}

			processingStep = "Finalisation de l'article...";
			await fetch(`/api/_public/article_id/${articleId}/finalize`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ imageUrls: uploadedUrls })
			});

			isSubmitting = false;
			await invalidate('app:user');
			await invalidate('app:ariclesSubmitted');
			toast.success('Article créé avec succès, fichiers téléchargés.', { duration: 5000 });
			goto(`/dashboard/articles`);
		} catch (error) {
			console.error('Erreur:', error);
			isSubmitting = false;
			const errorMessage = (error as Error).message || 'Erreur lors de la soumission';
			toast.error(errorMessage, { duration: 5000 });
		}
	}
</script>

<section class="flex flex-col items-center justify-evenly px-5 pb-5">
	<SectionTitle title="Proposer un article" />

	<ArticleForm
		{isSubmitting}
		onSubmit={handleSubmit}
		onFilesSelected={handleFilesSelected}
		on:strapsChange={handleStrapsChange}
	>
		<ImageUploader
			slot="imageUploader"
			maxFiles={6}
			minFiles={1}
			maxFileSize={DEFAULT_FILE_VALIDATION.maxFileSize}
			acceptedTypes="image/jpeg,image/png, image/webp"
			onFilesSelected={handleFilesSelected}
		/>
	</ArticleForm>

	{#if isSubmitting}
		<div class="mb-6 w-full max-w-md rounded-lg bg-white p-5 shadow-md">
			<h3 class="mb-2 text-lg font-medium text-gray-800">Traitement en cours...</h3>
			<p class="mb-3 text-sm text-gray-600">{processingStep}</p>

			{#if uploadProgress > 0}
				<div class="mb-2">
					<div class="mb-1 flex justify-between text-xs text-gray-600">
						<span>{currentFileIndex} sur {selectedFiles.length}</span>
						<span>{uploadProgress}%</span>
					</div>
					<div class="h-2 overflow-hidden rounded-full bg-gray-200">
						<div
							class="h-2 rounded-full bg-blue-600 transition-all duration-300"
							style="width: {uploadProgress}%"
						></div>
					</div>
				</div>
				<p class="text-xs italic text-gray-500">
					{#if currentFileIndex < selectedFiles.length}
						Veuillez patienter pendant le téléchargement...
					{:else}
						Traitement final en cours...
					{/if}
				</p>
			{:else}
				<div class="flex items-center justify-center">
					<svg
						class="h-5 w-5 animate-spin text-blue-600"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
						></circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
					<span class="ml-2">Initialisation du processus...</span>
				</div>
			{/if}
		</div>
	{/if}
</section>
