<!-- routes/articles/publish/+page.svelte -->
<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import ArticleForm from '$lib/components/form/ArticleForm.svelte';
	import ImageUploader from '$lib/components/ImageUploader.svelte';
	import SectionTitle from '$lib/components/SectionTitle.svelte';
	import type { ArticleUploadResponse } from '$lib/types/article';
	import toast from 'svelte-5-french-toast';

	let selectedFiles: File[] = [];
	let isSubmitting = false;
	let articleId: number | null = null;
	let selectedStraps: string[] = [];
	let uploadProgress = 0;

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

		try {
			// 1. Vérification des fichiers
			if (selectedFiles.length === 0) {
				toast.error('Minimum une photo requise', { duration: 5000 });
				isSubmitting = false;
				return;
			}

			// 2. Première étape : Créer l'article sans images (brouillon)
			uploadProgress = 10;
			const form = event.target as HTMLFormElement;
			const formData = new FormData(form);

			// Supprimer les fichiers du formData
			formData.delete('files');

			// Indiquer qu'il n'y a pas encore d'images
			formData.append('uploadedImages', JSON.stringify([]));

			uploadProgress = 30;
			const articleResponse = await fetch('/api/_public/articles/create-draft', {
				method: 'POST',
				body: formData
			});

			if (!articleResponse.ok) {
				const errorData = await articleResponse.json();
				throw new Error(errorData.message || "Erreur lors de la création de l'article");
			}

			const articleResult = await articleResponse.json();

			if (!articleResult.success || !articleResult.articleId) {
				throw new Error("Erreur lors de la création de l'article");
			}

			const newArticleId = articleResult.articleId;

			// 3. Deuxième étape : upload des images avec l'ID de l'article
			uploadProgress = 50;
			const imageFormData = new FormData();

			// Ajouter l'ID de l'article
			imageFormData.append('articleId', newArticleId.toString());

			selectedFiles.forEach((file) => {
				imageFormData.append('files', file);
			});

			const imageUploadResponse = await fetch('/api/_public/articles/upload-images-publish', {
				method: 'POST',
				body: imageFormData
			});

			if (!imageUploadResponse.ok) {
				const errorData = await imageUploadResponse.json();
				throw new Error(errorData.message || "Erreur lors de l'upload des images");
			}

			uploadProgress = 80;
			const imageResult = await imageUploadResponse.json();

			if (!imageResult.success || !imageResult.images || imageResult.images.length === 0) {
				throw new Error("Erreur lors de l'upload des images");
			}

			// 4. Troisième étape : Mettre à jour l'article avec les URLs des images
			uploadProgress = 90;
			const updateResponse = await fetch(`/api/_public/articles/update-images/${newArticleId}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					images: imageResult.images
				})
			});

			if (!updateResponse.ok) {
				throw new Error("Erreur lors de la mise à jour des images de l'article");
			}

			const result = await updateResponse.json();

			// Finalisation
			uploadProgress = 100;
			await invalidate('app:user');

			toast.success('Article créé avec succès !', {
				duration: 5000
			});
			goto(`/dashboard/articles`);
		} catch (error) {
			console.error('Erreur:', error);
			const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la soumission';
			toast.error(errorMessage, { duration: 5000 });
		} finally {
			isSubmitting = false;
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
			maxFileSize={2 * 1024 * 1024}
			acceptedTypes="image/jpeg,image/png, image/webp, image/jpg"
			onFilesSelected={handleFilesSelected}
		/>
	</ArticleForm>

	{#if isSubmitting}
		<div class="my-4 w-full max-w-md">
			<div class="h-2.5 w-full rounded-full bg-gray-200">
				<div class="h-2.5 rounded-full bg-primary" style="width: {uploadProgress}%"></div>
			</div>
			<p class="mt-2 text-center text-sm">
				{uploadProgress < 50
					? 'Upload des images...'
					: uploadProgress < 90
						? "Création de l'article..."
						: 'Finalisation...'}
			</p>
		</div>
	{/if}
</section>
