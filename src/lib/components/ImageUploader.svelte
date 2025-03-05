<script lang="ts">
	import { DEFAULT_FILE_VALIDATION } from '$lib/types/article';

	export let maxFiles = DEFAULT_FILE_VALIDATION.maxFileCount;
	export let acceptedTypes = DEFAULT_FILE_VALIDATION.acceptedTypes.join(',');
	export let maxFileSize = DEFAULT_FILE_VALIDATION.maxFileSize;
	export let minFiles = DEFAULT_FILE_VALIDATION.minFileCount;

	let files: File[] = [];
	export let onFilesSelected = (files: File[]) => {};

	let errorMessage = '';

	function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files) {
			errorMessage = '';
			files = [];

			if (input.files.length > maxFiles) {
				errorMessage = `Maximum ${maxFiles} fichiers autorisés`;
				input.value = ''; // Reset l'input
				onFilesSelected([]);
				return;
			}
			const selectedFiles = Array.from(input.files).filter((file) => {
				if (!DEFAULT_FILE_VALIDATION.acceptedTypes.includes(file.type)) {
					errorMessage = `Type de fichier non supporté : ${file.name}`;
					return false;
				}

				if (file.size > maxFileSize) {
					errorMessage = `${file.name} dépasse 2 MO`;
					return false;
				}
				return true;
			});

			if (errorMessage) {
				input.value = '';
				onFilesSelected([]);
				return;
			}

			if (selectedFiles.length < minFiles) {
				errorMessage = `Minimum ${minFiles} fichiers requis`;
				input.value = '';
				onFilesSelected([]);
				return;
			}
			files = selectedFiles;
			onFilesSelected(files);
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
	/>
	<p class="my-1 italic">
		Minimum {minFiles} photo, maximum {maxFiles} photos, 2 Mo max par photos.
	</p>
	<p class=" italic">Formats acceptés : JPEG / PNG / WEBP</p>
	<a
		href="https://imagecompressor.11zon.com/fr/compress-webp/"
		aria-label="lien compression fichier"
		class="italic text-black"
		target="_blank"
		><i class="fa-regular fa-square-caret-right p-2"></i>Compression de fichiers en ligne</a
	>
	{#if errorMessage}
		<div class="mt-2 text-red-500">{errorMessage}</div>
	{/if}
	{#if files.length > 0}
		<div class="preview mt-4">
			<label for="file-input" class="mb-1 block text-lg font-bold text-gray-700">
				Vos photos :
			</label>
			<ul class="list-disc pl-5">
				{#each files as file}
					<li>{file.name} ({(file.size / (1024 * 1024)).toFixed(2)} Mo)</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
