<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import ArticleForm from '$lib/components/form/ArticleForm.svelte';
	import ImageUploader from '$lib/components/ImageUploader.svelte';
	import SectionTitle from '$lib/components/SectionTitle.svelte';
	import type { ArticleUploadResponse } from '$lib/types/article.js';
	import { DEFAULT_FILE_VALIDATION } from '$lib/types/article';

	import toast from 'svelte-5-french-toast';

	let isSubmitting = false;
	let selectedFiles: File[] = [];
	let uploadProgress = 0;
	let currentFileIndex = 0;
	let processingStep = '';

	export let data;
	export let { article } = data;

	let currentStraps: string[] = [];

	function handleStrapsChange(straps: string[]) {
		currentStraps = straps;
	}

	function handleFilesSelected(files: File[]) {
		selectedFiles = files;
	}

	async function handleDelete(event: MouseEvent) {
		event.preventDefault();
		isSubmitting = true;
		processingStep = "Suppression de l'article...";

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
				await invalidate('app:articles');
				await invalidate('app:ariclesSubmitted');

				toast.success('Article supprimé avec succès', {
					duration: 5000
				});
				processingStep = 'Redirection vers le tableau de bord...';

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
		processingStep = "Mise à jour des informations de l'article...";

		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);

		formData.delete('straps');
		currentStraps.forEach((strap) => {
			formData.append('straps', strap);
		});

		const hasNewImages = selectedFiles.length > 0;

		try {
			const updateResponse = await fetch(`/api/_public/articles/edit/${article.id}`, {
				method: 'POST',
				body: formData
			});

			if (!updateResponse.ok) {
				const errorData = await updateResponse.json();
				if (errorData.errors) {
					const messages = Object.entries(errorData.errors)
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
					toast.error('Erreur lors de la soumission : ' + (errorData.message || 'Erreur inconnue'));
				}
				isSubmitting = false;
				return;
			}

			if (hasNewImages) {
				processingStep = 'Téléchargement des nouvelles images...';
				const uploadedUrls = [];
				currentFileIndex = 0;

				for (const file of selectedFiles) {
					currentFileIndex++;
					uploadProgress = Math.round((currentFileIndex / selectedFiles.length) * 100);
					processingStep = `Téléchargement de l'image ${currentFileIndex}/${selectedFiles.length}: ${file.name}`;

					const imageFormData = new FormData();
					imageFormData.append('file', file);

					const uploadResponse = await fetch(`/api/_public/article_id/${article.id}/upload-image`, {
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

				if (uploadedUrls.length > 0) {
					processingStep = 'Finalisation des modifications...';
					await fetch(`/api/_public/article_id/${article.id}/finalize`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ imageUrls: uploadedUrls })
					});
				}
			}

			processingStep = 'Redirection vers le tableau de bord...';
			isSubmitting = false;
			await invalidate('app:user');
			await invalidate('app:articles');
			await invalidate('app:ariclesSubmitted');

			toast.success('Article mis à jour avec succès', { duration: 5000 });
			goto('/dashboard/articles');
		} catch (error) {
			console.error('Erreur:', error);
			isSubmitting = false;
			toast.error("Erreur lors de la mise à jour de l'article", { duration: 5000 });
		}
	}
</script>

<section class="flex flex-col items-center justify-evenly px-5 pb-5">
	<SectionTitle title="Modifier l'article" />

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
			maxFiles={DEFAULT_FILE_VALIDATION.maxFileCount}
			minFiles={DEFAULT_FILE_VALIDATION.minFileCount}
			maxFileSize={DEFAULT_FILE_VALIDATION.maxFileSize}
			acceptedTypes="image/jpeg,image/png, image/webp"
			onFilesSelected={handleFilesSelected}
		/>
	</ArticleForm>

	{#if isSubmitting}
		<div class="mb-6 w-full max-w-md rounded-lg bg-white p-5 shadow-md">
			<h3 class="mb-2 text-lg font-medium text-gray-800">Modification en cours...</h3>
			<p class="mb-3 text-sm text-gray-600">{processingStep}</p>

			{#if uploadProgress > 0 && selectedFiles.length > 0}
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
						Traitement final des images en cours...
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
					<span class="ml-2">Mise à jour de l'article...</span>
				</div>
			{/if}
		</div>
	{/if}
</section>
