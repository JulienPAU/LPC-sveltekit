<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import ArticleForm from '$lib/components/form/ArticleForm.svelte';
	import ImageUploader from '$lib/components/ImageUploader.svelte';
	import SectionTitle from '$lib/components/SectionTitle.svelte';
	import toast from 'svelte-5-french-toast';

	let selectedFiles: File[] = [];
	let isSubmitting = false;
	let articleId: number | null = null;
	let uploadProgress = 0;
	let currentFileIndex = 0;

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
			const uploadedUrls = [];
			currentFileIndex = 0;

			for (const file of selectedFiles) {
				currentFileIndex++;
				uploadProgress = Math.round((currentFileIndex / selectedFiles.length) * 100);

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

			// ÉTAPE 3: Finaliser l'article avec les URLs des images
			await fetch(`/api/_public/article_id/${articleId}/finalize`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ imageUrls: uploadedUrls })
			});

			isSubmitting = false;
			await invalidate('app:user');
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
	{#if isSubmitting && uploadProgress > 0}
		<div class="mb-4 w-full max-w-md">
			<div class="mb-1 h-2.5 rounded-full bg-gray-200">
				<div class="h-2.5 rounded-full bg-blue-600" style="width: {uploadProgress}%"></div>
			</div>
			<p class="text-center text-sm">
				Téléchargement des images: {currentFileIndex}/{selectedFiles.length}
			</p>
		</div>
	{/if}
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
			acceptedTypes="image/jpeg,image/png, image/webp"
			onFilesSelected={handleFilesSelected}
		/>
	</ArticleForm>
</section>
