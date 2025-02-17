<script lang="ts">
	import SectionTitle from '$lib/components/SectionTitle.svelte';
</script>

<div class=" flex flex-col items-center">
	<SectionTitle title="Lexique" />

	<div
		class=" mx-auto mb-5 flex w-2/4 flex-col items-center justify-center gap-5 rounded-lg bg-gray-300 p-4"
	>
		<div class="w-full">
			<label for="titre-article" class="mb-1 block text-lg font-bold text-gray-700">
				Titre lexique
			</label>
			<input
				id="titre-article"
				name="titre-article"
				type="text"
				class="input input-warning mb-5 w-full"
			/>
		</div>

		<div class="w-full">
			<label for="titre-article" class="mb-1 block text-lg font-bold text-gray-700">
				Contenu lexique
			</label>
			<textarea
				id="titre-article"
				name="titre-article"
				class=" textarea textarea-warning mb-5 w-full"
			>
			</textarea>
		</div>
	</div>
</div>
