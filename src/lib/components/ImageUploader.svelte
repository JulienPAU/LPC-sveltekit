<!-- src/lib/components/ImageUploader.svelte -->

<script lang="ts">
	// export let articleId: Number | null = null;

	export let maxFiles = 10;
	export let acceptedTypes = 'image/jpeg,image/png,image/webp';

	export let onUploadComplete: (data: any) => void; // Callback prop
	export let onUploadError: (error: Error) => void; // Callback prop

	let files: File[] = [];
	let uploading = false;
	let progress = 0;
	const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 Mo en octets

	async function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files) {
			const selectedFiles = Array.from(input.files).filter((file) => {
				if (file.size > MAX_FILE_SIZE) {
					alert(`${file.name} dépasse la taille maximale de 5 Mo`);
					return false;
				}
				return true;
			});

			if (selectedFiles.length > maxFiles) {
				alert(`Maximum ${maxFiles} fichiers autorisés`);
				return;
			}

			files = selectedFiles;
		}
	}

	async function uploadFiles() {
		// if (!articleId) {
		// 	alert("L'ID de l'article est manquant !");
		// 	return;
		// }
		if (files.length === 0) return;

		uploading = true;
		progress = 0;

		try {
			const formData = new FormData();
			files.forEach((file) => {
				console.log('Ajout du fichier:', file.name); // Affiche le nom du fichier
				formData.append('images', file); // Ajoute à formData
			}); // formData.append('articleId', articleId.toString());

			const response = await fetch('/api/_public/upload', {
				method: 'POST',
				body: formData
			});

			console.log('Upload response:', response);

			// Si la réponse n'est pas ok, on gère l'erreur
			if (!response.ok) throw new Error('Upload failed');

			// Essaie de parser la réponse en JSON

			// Notify parent component about successful upload
			if (onUploadComplete) {
				onUploadComplete(response.json());
			}

			// Reset state
			files = [];
			progress = 100;
		} catch (err) {
			console.error('Upload error:', err);

			// Notify parent component about the error
			if (onUploadError) {
				onUploadError(err as Error);
			}
		} finally {
			uploading = false;
		}
	}
</script>

<div class="upload-container">
	<input
		type="file"
		multiple
		accept={acceptedTypes}
		class="file-input file-input-bordered file-input-warning w-full"
		on:change={handleFileSelect}
		disabled={uploading}
	/>

	{#if files.length > 0}
		<div class="preview mt-4">
			<label for="" class="mb-1 block text-lg font-bold text-gray-700"> Vos photos : </label>
			<ul class="list-disc pl-5">
				{#each files as file}
					<li>{file.name} ({Math.round(file.size / 1024)}KB)</li>
				{/each}
			</ul>
		</div>
		<button
			class="btn btn-warning mt-4"
			on:click={uploadFiles}
			disabled={files.length === 0 || uploading}
		>
			{uploading ? 'Chargement...' : 'Chargez les fichiers'}
		</button>
	{/if}

	{#if uploading}
		<div class="progress mt-4">
			<progress class="progress progress-warning w-full" value={progress} max="100"></progress>
		</div>
	{/if}
</div>
