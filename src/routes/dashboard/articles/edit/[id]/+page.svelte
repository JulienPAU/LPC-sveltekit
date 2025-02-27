<!-- routes/articles/[id]/edit/+page.svelte -->
<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import ArticleForm from '$lib/components/form/ArticleForm.svelte';
	import ImageUploader from '$lib/components/ImageUploader.svelte';
	import SectionTitle from '$lib/components/SectionTitle.svelte';
	import type { ArticleUploadResponse } from '$lib/types/article.js';
	import toast from 'svelte-5-french-toast';

	let isSubmitting = false;
	let selectedFiles: File[] = [];

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

		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);

		formData.delete('straps');
		currentStraps.forEach((strap) => {
			formData.append('straps', strap);
		});

		// Ajoute les fichiers à FormData
		selectedFiles.forEach((file) => {
			formData.append('files', file);
		});

		try {
			const response = await fetch(`/api/_public/articles/edit/${article.id}`, {
				method: 'POST',
				body: formData
			});

			const result: ArticleUploadResponse = await response.json();

			if (!response.ok) {
				if (result.errors) {
					console.error('Erreurs de validation reçues:', result.errors);

					// Récupérer les messages d'erreur sans erreur de type
					const messages = Object.entries(result.errors)
						.flatMap(([key, value]) => (Array.isArray(value._errors) ? value._errors : []))
						.join('\n');

					toast.error('Erreur lors de la soumission :\n' + messages);
				} else {
					toast.error('Erreur lors de la soumission : ' + result.message || 'Erreur inconnue.');
				}
				return;
			}

			if (result) {
				isSubmitting = false;
				await invalidate('app:user');
				invalidate('app:articles');
				goto('/dashboard/articles');

				toast.success('Article mis à jour avec succès', {
					duration: 5000
				});
			} else {
				toast.error("Erreur lors de la mise à jour de l'article", {
					duration: 5000
				});
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
