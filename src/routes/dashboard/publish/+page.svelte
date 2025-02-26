<!-- routes/articles/publish/+page.svelte -->
<script lang="ts">
	import { invalidate } from '$app/navigation';
	import ArticleForm from '$lib/components/form/ArticleForm.svelte';
	import ImageUploader from '$lib/components/ImageUploader.svelte';
	import SectionTitle from '$lib/components/SectionTitle.svelte';
	import type { ArticleUploadResponse } from '$lib/types/article';
	import toast from 'svelte-5-french-toast';

	let selectedFiles: File[] = [];
	let isSubmitting = false;
	let articleId: number | null = null;

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

		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);

		// Utilise selectedFiles pour ajouter les fichiers au formData
		if (selectedFiles.length === 0) {
			toast('Minimum une photo requise', {
				duration: 5000
			});
			isSubmitting = false;
			return;
		}

		selectedFiles.forEach((file) => {
			formData.append('files', file);
		});

		try {
			const response = await fetch('/api/_public/articles/publish', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				const errorData = await response.json();
				const errorMessage = errorData.message || 'Erreur lors de la soumission';

				toast.error(errorMessage, {
					duration: 5000
				});
				isSubmitting = false;
				return;
			}

			const result: ArticleUploadResponse = await response.json();

			if (result.articleId) {
				articleId = result.articleId;
				isSubmitting = false;
				await invalidate('app:user');

				toast.success('Article créé avec succès, fichiers téléchargés.', {
					duration: 5000
				});
			} else {
				toast.error("ID de l'article manquant dans la réponse.", {
					duration: 5000
				});
				isSubmitting = false;
				return;
			}
		} catch (error) {
			console.error('Erreur:', error);
			isSubmitting = false;

			// Ici on utilise le message de l'erreur si disponible
			const errorMessage = (error as Error).message || 'Erreur lors de la soumission';
			toast.error(errorMessage, {
				duration: 5000
			});
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
			acceptedTypes="image/jpeg,image/png, image/webp"
			onFilesSelected={handleFilesSelected}
		/>
	</ArticleForm>
</section>
