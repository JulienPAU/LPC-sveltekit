<!-- \src\routes\articles\publish\+page.svelte -->

<script lang="ts">
	import ImageUploader from '$lib/components/ImageUploader.svelte';
	import SectionTitle from '$lib/components/SectionTitle.svelte';

	let articleId: Number | null = null;

	let files: File[] = [];

	// function handleFileUpload(event: Event) {
	// 	const target = event.target as HTMLInputElement;
	// 	if (target.files) {
	// 		files = Array.from(target.files); // Met à jour la liste des fichiers
	// 	}
	// }

	function formatFileSize(size: number): string {
		return (size / 1024).toFixed(2) + ' Ko'; // Convertit en kilooctets avec 2 décimales
	}

	async function handleUploadComplete(data: any) {
		// articleId = data.articleId;
		console.log('Upload réussi !', data);
	}

	function handleUploadError(error: Error) {
		console.error('Erreur de téléchargement', error);
		alert('Une erreur est survenue lors du téléchargement.');
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);

		try {
			const response = await fetch('/api/_public/articles/publish', {
				method: 'POST',
				body: formData
			});

			// Vérification de la réponse
			if (!response.ok) {
				throw new Error(`Erreur lors de la soumission : ${response.statusText}`);
			}

			const result = await response.json();
			if (result.articleId) {
				articleId = result.articleId;
				console.log('Article créé avec succès. ID:', articleId);
			} else {
				throw new Error("ID de l'article manquant dans la réponse.");
			}
		} catch (error) {
			console.error('Erreur:', error);
			alert('Erreur lors de la soumission');
		}
	}
</script>

<section class="flex flex-col items-center justify-evenly px-5 pb-5">
	<SectionTitle title="Proposer un article" />

	<form on:submit={handleSubmit} class="mx-auto mb-10 w-full max-w-4xl rounded-xl bg-gray-200 p-10">
		<div class="mb-5 flex flex-col gap-5 md:flex-row">
			<div class="w-full">
				<label for="titre-article" class="mb-1 block text-lg font-bold text-gray-700">
					Titre de l'article
				</label>
				<input
					id="titre-article"
					name="titre-article"
					type="text"
					class="input input-bordered input-warning w-full"
				/>
			</div>

			<div class="w-full">
				<label for="type" class="mb-1 block text-lg font-bold text-gray-700"> Type </label>

				<select id="type" name="type" class="select select-warning w-full text-lg">
					<option disabled selected>Choisir une catégorie</option>
					<option value="ARTICLE">Article</option>
					<option value="REVIEW">Review</option>
					<option value="TECHNICAL">Technique</option>
					<option value="LEXIQUE">Lexique</option>
					<option value="GUIDE">Guide</option>
				</select>
			</div>

			<!-- <div class="w-full">
				<label for="categorie" class="mb-1 block text-lg font-bold text-gray-700">
					Catégorie
				</label>

				<select id="categorie" name="categorie" class="select select-warning w-full text-lg">
					<option disabled selected>Choisir une catégorie</option>
					<option value="LUXURY">Montres de luxe</option>
					<option value="SMARTWATCH">Montres connectées</option>
					<option value="DIGITAL">Montres digitales</option>
					<option value="ANALOG">Montres analogiques</option>
					<option value="HYBRID">Montres hybrides</option>
				</select>
			</div> -->
		</div>

		<div>
			<label for="introduction" class="mb-1 block text-lg font-bold text-gray-700">
				Introduction de l'article
			</label>
			<textarea
				id="introduction"
				name="introduction"
				class="textarea textarea-warning mb-5 h-32 w-full"
			></textarea>
		</div>

		<div>
			<label for="corps-article" class="mb-1 block text-lg font-bold text-gray-700">
				Corps de l'article
			</label>
			<textarea
				id="corps-article"
				name="corps-article"
				class="textarea textarea-warning mb-5 h-72 w-full"
			></textarea>
		</div>

		<div>
			<label for="end" class="mb-1 block text-lg font-bold text-gray-700"> Le mot de la fin </label>
			<textarea id="end" name="end" class="textarea textarea-warning mb-5 h-32 w-full"></textarea>
		</div>

		<div class="flex-col">
			<div class="w-full">
				<label for="upload-files" class="mb-1 block text-lg font-bold text-gray-700">
					Télécharger des fichiers
				</label>

				<ImageUploader
					maxFiles={10}
					acceptedTypes="image/jpeg,image/png"
					onUploadComplete={handleUploadComplete}
					onUploadError={handleUploadError}
				/>
			</div>

			{#if files.length > 0}
				<ul class="mt-3 text-sm text-gray-700">
					{#each files as file}
						<li>
							{file.name} - {formatFileSize(file.size)}
						</li>
					{/each}
				</ul>
			{/if}
		</div>
		<!-- <input type="hidden" id="articleId" name="articleId" value={articleId} /> -->
		<button type="submit" class="iems-center btn btn-warning mt-20 text-xl">Valider</button>
	</form>
</section>
