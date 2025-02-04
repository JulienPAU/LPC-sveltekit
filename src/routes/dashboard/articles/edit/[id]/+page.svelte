<!-- routes/articles/[id]/edit/+page.svelte -->
<script lang="ts">
	import { invalidate } from '$app/navigation';
	import ArticleForm from '$lib/components/form/ArticleForm.svelte';
	import ImageUploader from '$lib/components/ImageUploader.svelte';
	import SectionTitle from '$lib/components/SectionTitle.svelte';
	import type { ArticleUploadResponse } from '$lib/types/article.js';

	let isSubmitting = false;
	let selectedFiles: File[] = [];

	export let data;
	export let { article } = data;

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
				throw new Error(`Erreur lors de la suppression : ${response.statusText}`);
			}

			const result: ArticleUploadResponse = await response.json();

			if (result) {
				isSubmitting = false;
				await invalidate('app:user');
				invalidate('app:articles'); // Pour les articles du layout

				alert('Article supprimé avec succès');
			} else {
				throw new Error("Erreur lors de la suppression de l'article");
			}
		} catch (error) {
			console.error('Erreur:', error);
			isSubmitting = false;
			throw new Error('Erreur lors de la soumission');
		}
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		isSubmitting = true;

		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);

		// Vérifie qu'il y a bien des fichiers sélectionnés
		// if (selectedFiles.length === 0) {
		// 	alert('Ajoutez au moins une image');
		// 	isSubmitting = false;
		// 	return;
		// }

		// Ajoute les fichiers à FormData
		selectedFiles.forEach((file) => {
			formData.append('files', file);
		});

		try {
			const response = await fetch(`/api/_public/articles/edit/${article.id}`, {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				throw new Error(`Erreur lors de la soumission : ${response.statusText}`);
			}

			const result: ArticleUploadResponse = await response.json();

			if (result) {
				isSubmitting = false;
				await invalidate('app:user');
				invalidate('app:articles'); // Pour les articles du layout

				alert('Article mis à jour avec succès');
			} else {
				throw new Error("Erreur lors de la mise à jour de l'article");
			}
		} catch (error) {
			console.error('Erreur:', error);
			isSubmitting = false;
			throw new Error('Erreur lors de la soumission');
		}
	}
</script>

<section class="flex flex-col items-center justify-evenly px-5 pb-5">
	<SectionTitle title="Modifier l'article" />
	<ArticleForm isEditing={true} {article} onSubmit={handleSubmit} onDelete={handleDelete}>
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
