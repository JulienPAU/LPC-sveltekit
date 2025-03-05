<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import ArticleForm from '$lib/components/form/ArticleForm.svelte';
	import ImageUploader from '$lib/components/ImageUploader.svelte';
	import SectionTitle from '$lib/components/SectionTitle.svelte';
	import type { ArticleUploadResponse } from '$lib/types/article.js';
	import toast from 'svelte-5-french-toast';

	let isSubmitting = false;
	let selectedFiles: File[] = [];
	let uploadProgress = 0;
	let deleteOldImages = false;

	export let data;
	export let { article } = data;

	let currentStraps: string[] = [];

	function handleStrapsChange(straps: string[]) {
		currentStraps = straps;
	}

	function handleFilesSelected(files: File[]) {
		selectedFiles = files;
		// Si l'utilisateur a sélectionné de nouvelles images, on présume qu'il veut remplacer les anciennes
		deleteOldImages = files.length > 0;
	}

	function handleDeleteOldImagesChange(event: Event) {
		const target = event.target as HTMLInputElement;
		deleteOldImages = target.checked;
	}

	async function handleDelete(event: MouseEvent) {
		// La fonction de suppression reste inchangée
		event.preventDefault();
		isSubmitting = true;

		try {
			const response = await fetch(`/api/_public/articles/delete/${article.id}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				isSubmitting = false;
				toast.error(`Erreur lors de la suppression : ${response.statusText}`, {
					duration: 5000
				});
				return;
			}

			const result: ArticleUploadResponse = await response.json();

			try {
				await invalidate('app:user');
				invalidate('app:articles');
				toast.success('Article supprimé avec succès', {
					duration: 5000
				});
				setTimeout(() => {
					isSubmitting = false;
					goto('/dashboard/articles');
				}, 500);
			} catch (navError) {
				console.error('Erreur de navigation:', navError);
				isSubmitting = false;
			}
		} catch (error) {
			console.error('Erreur:', error);
			isSubmitting = false;
			toast.error("Erreur lors de la suppression de l'article", {
				duration: 5000
			});
			throw new Error('Erreur lors de la soumission');
		}
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		isSubmitting = true;
		uploadProgress = 0;

		try {
			const form = event.target as HTMLFormElement;
			const formData = new FormData(form);

			// 1. Gérer les bracelets
			formData.delete('straps');
			currentStraps.forEach((strap) => {
				formData.append('straps', strap);
			});

			// 2. Étape 1 : Upload des images (si sélectionnées)
			let imageUrls: string[] = [];

			if (selectedFiles.length > 0) {
				uploadProgress = 10;
				const imageFormData = new FormData();

				selectedFiles.forEach((file) => {
					imageFormData.append('files', file);
				});

				imageFormData.append('articleId', article.id.toString());

				const imageUploadResponse = await fetch('/api/_public/articles/upload-images-edit', {
					method: 'POST',
					body: imageFormData
				});

				if (!imageUploadResponse.ok) {
					const errorData = await imageUploadResponse.json();
					throw new Error(errorData.message || "Erreur lors de l'upload des images");
				}

				uploadProgress = 50;
				const imageResult = await imageUploadResponse.json();

				if (!imageResult.success) {
					throw new Error("Erreur lors de l'upload des images");
				}

				imageUrls = imageResult.images || [];
			}

			// 3. Étape 2 : Mise à jour de l'article
			uploadProgress = 60;

			// Supprimer les fichiers du formData
			formData.delete('files');

			// Ajouter les URLs des images téléchargées
			formData.append('uploadedImages', JSON.stringify(imageUrls));
			formData.append('deleteOldImages', deleteOldImages.toString());

			uploadProgress = 70;
			const response = await fetch(`/api/_public/articles/edit/${article.id}`, {
				method: 'POST',
				body: formData
			});

			uploadProgress = 90;

			if (!response.ok) {
				const result = await response.json();

				if (result.errors) {
					console.error('Erreurs de validation reçues:', result.errors);

					const messages = Object.entries(result.errors)
						.flatMap(([key, value]) => {
							if (
								typeof value === 'object' &&
								value !== null &&
								'_errors' in value &&
								Array.isArray((value as any)._errors)
							) {
								return (value as any)._errors;
							}
							return [];
						})
						.join('\n');

					toast.error('Erreur lors de la soumission :\n' + messages);
				} else {
					toast.error('Erreur lors de la soumission : ' + result.message || 'Erreur inconnue.');
				}
				isSubmitting = false;
				return;
			}

			const result = await response.json();

			if (result.success) {
				uploadProgress = 100;
				await invalidate('app:user');
				invalidate('app:articles');

				toast.success('Article mis à jour avec succès', {
					duration: 5000
				});
				goto('/dashboard/articles');
			} else {
				toast.error("Erreur lors de la mise à jour de l'article", {
					duration: 5000
				});
				throw new Error("Erreur lors de la mise à jour de l'article");
			}
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
	<SectionTitle title="Modifier l'article" />

	{#if article.images && article.images.length > 0}
		<div class="mb-4 w-full max-w-md">
			<label class="flex items-center space-x-2 text-sm">
				<input
					type="checkbox"
					checked={deleteOldImages}
					on:change={handleDeleteOldImagesChange}
					class="form-checkbox"
				/>
				<span>Remplacer les images existantes ({article.images.length})</span>
			</label>
		</div>
	{/if}

	<ArticleForm
		isEditing={true}
		{article}
		onSubmit={handleSubmit}
		onDelete={handleDelete}
		{isSubmitting}
		onStrapsChange={handleStrapsChange}
	>
		<ImageUploader
			slot="imageUploader"
			maxFiles={6}
			minFiles={0}
			maxFileSize={2 * 1024 * 1024}
			acceptedTypes="image/jpeg,image/png, image/webp"
			existingImagesCount={deleteOldImages ? 0 : article.images.length}
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
					? 'Upload des nouvelles images...'
					: uploadProgress < 90
						? "Mise à jour de l'article..."
						: 'Finalisation...'}
			</p>
		</div>
	{/if}
</section>
