<!-- routes/articles/publish/+page.svelte -->
<script lang="ts">
	import { invalidate } from '$app/navigation';
	import ArticleForm from '$lib/components/form/ArticleForm.svelte';
	import ImageUploader from '$lib/components/ImageUploader.svelte';
	import SectionTitle from '$lib/components/SectionTitle.svelte';
	import type { ArticleUploadResponse } from '$lib/types/article';

	let selectedFiles: File[] = [];
	let isSubmitting = false;
	let articleId: number | null = null;

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
			alert('Minimum une photo requise');
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
				throw new Error(`Erreur lors de la soumission : ${response.statusText}`);
			}

			const result: ArticleUploadResponse = await response.json();

			if (result.articleId) {
				articleId = result.articleId;
				isSubmitting = false;
				await invalidate('app:user');

				alert('Article créé avec succès, fichiers téléchargés.');
			} else {
				throw new Error("ID de l'article manquant dans la réponse.");
			}
		} catch (error) {
			console.error('Erreur:', error);
			isSubmitting = false;
			throw new Error('Erreur lors de la soumission');
		}
	}
</script>

<section class="flex flex-col items-center justify-evenly px-5 pb-5">
	<SectionTitle title="Proposer un article" />
	<ArticleForm {isSubmitting} onSubmit={handleSubmit} onFilesSelected={handleFilesSelected}>
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
