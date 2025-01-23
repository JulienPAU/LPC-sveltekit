<!-- src/lib/components/ImageUploader.svelte -->

<script lang="ts">
	export let maxFiles = 6;
	export let acceptedTypes = 'image/jpeg,image/png,image/webp';

	export let onUploadComplete: (data: any) => void;
	export let onUploadError: (error: Error) => void;

	let files: File[] = [];
	const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 Mo en octets
	let errorMessage = '';

	function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files) {
			errorMessage = ''; // Réinitialiser le message d'erreur

			const selectedFiles = Array.from(input.files).filter((file) => {
				if (file.size > MAX_FILE_SIZE) {
					errorMessage = `${file.name} dépasse la taille maximale de 5 Mo`;
					return false;
				}
				return true;
			});

			if (selectedFiles.length > maxFiles) {
				errorMessage = `Maximum ${maxFiles} fichiers autorisés`;
				return;
			}

			files = selectedFiles;
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

	{#if files.length > 0}
		<div class="preview mt-4">
			<label for="file-upload" class="mb-1 block text-lg font-bold text-gray-700">
				Vos photos :
			</label>
			<ul class="list-disc pl-5">
				{#each files as file}
					<li>{file.name} ({Math.round(file.size / 1024)}KB)</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
