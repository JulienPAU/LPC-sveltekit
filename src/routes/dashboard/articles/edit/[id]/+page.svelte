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
	let currentFileIndex = 0;

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
				// Mettons un petit délai avant la redirection
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

		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);

		formData.delete('straps');
		currentStraps.forEach((strap) => {
			formData.append('straps', strap);
		});

		const hasNewImages = selectedFiles.length > 0;

		try {
			// ÉTAPE 1: Mettre à jour l'article sans les images
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

			// ÉTAPE 2: Si des nouvelles images sont sélectionnées, les télécharger
			if (hasNewImages) {
				const uploadedUrls = [];
				currentFileIndex = 0;

				for (const file of selectedFiles) {
					currentFileIndex++;
					uploadProgress = Math.round((currentFileIndex / selectedFiles.length) * 100);

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

				// ÉTAPE 3: Finaliser l'article avec les URLs des images
				if (uploadedUrls.length > 0) {
					await fetch(`/api/_public/article_id/${article.id}/finalize`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ imageUrls: uploadedUrls })
					});
				}
			}

			isSubmitting = false;
			await invalidate('app:user');
			await invalidate('app:articles');

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
			minFiles={1}
			maxFileSize={2 * 1024 * 1024}
			acceptedTypes="image/jpeg,image/png, image/webp"
			onFilesSelected={handleFilesSelected}
		/>
	</ArticleForm>
</section>
