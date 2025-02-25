<script lang="ts">
	import SectionTitle from '$lib/components/SectionTitle.svelte';
	import error_500 from '$lib/assets/error_500.png';

	export let data;
	const { definitions } = data;

	let activeLetter: string | null = null;
	let activeWordIndex: number | null = null;

	// Fonction pour normaliser les caractères (enlever les accents)
	const normalizeChar = (char: string) => {
		return char.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
	};

	// Créer un objet groupé par première lettre à partir des définitions
	const groupedDefinitions = definitions.reduce((acc: Record<string, any[]>, def: any) => {
		const firstLetter = def.title.trim().charAt(0).toUpperCase();
		if (!acc[firstLetter]) {
			acc[firstLetter] = [];
		}
		acc[firstLetter].push({
			word: def.title.trim(),
			explanation: def.content.trim()
		});
		return acc;
	}, {});

	// Tri personnalisé pour les lettres avec accents
	const sortedLetters = Object.keys(groupedDefinitions).sort((a, b) => {
		return normalizeChar(a).localeCompare(normalizeChar(b), 'fr');
	});

	const selectLetter = (letter: string) => {
		activeLetter = activeLetter === letter ? null : letter;
		activeWordIndex = null;
	};

	const toggleWordPanel = (index: number) => {
		activeWordIndex = activeWordIndex === index ? null : index;
	};
</script>

<div class="flex flex-col items-center">
	<SectionTitle title="Lexique" />

	<!-- Sidebar déplacée sous le titre -->
	<p class=" mb-5 w-full p-4 text-justify font-semibold lg:mb-10 lg:w-4/5 lg:text-2xl">
		Bienvenue dans notre lexique horloger, votre guide complet pour découvrir et comprendre le monde
		fascinant de l'horlogerie. Que vous soyez passionné par les montres ou simplement curieux, ce
		lexique vous fournira des définitions claires et précises des termes techniques et des concepts
		essentiels utilisés dans l'industrie horlogère. De "automatique" à "zirconium", explorez les
		secrets des mécanismes complexes et des matériaux innovants qui font battre le cœur de vos
		montres préférées. Si vous ne trouvez pas un terme ou si vous souhaitez plus d'informations,
		n'hésitez pas à nous contacter – nous sommes toujours là pour vous aider !
	</p>
	<div
		class="mb-10 flex w-full flex-row flex-wrap justify-center gap-2 border-y bg-slate-900 p-4 text-white lg:w-1/2 lg:rounded-lg"
	>
		{#each sortedLetters as letter}
			<button
				class="rounded-lg p-2 text-xl font-bold hover:bg-slate-700 hover:text-yellow-500 lg:p-4 {activeLetter ===
				letter
					? ' bg-slate-700 '
					: ''}"
				on:click={() => selectLetter(letter)}
			>
				{letter}
			</button>
		{/each}
	</div>

	{#if !activeLetter}
		<div class="flex items-center justify-center">
			<img src={error_500} alt="lexique" class="w-6/6 lg:w-3/5" />
		</div>
	{/if}
</div>
<!-- Content -->
<div class="w-full p-4">
	<div class="p-5 lg:p-10">
		{#if activeLetter}
			<h2 class="text-3xl font-bold">{activeLetter}</h2>
			<div class="">
				{#each groupedDefinitions[activeLetter] as { word, explanation }, index}
					<div class="mb-4 rounded-lg bg-slate-800 p-4 text-white">
						<button
							class="flex w-full items-center justify-between text-left text-2xl font-medium"
							on:click={() => toggleWordPanel(index)}
						>
							<span>{word}</span>
						</button>
						{#if activeWordIndex === index}
							<p class="mt-2 break-words p-4 text-lg font-semibold text-white">
								{explanation}
							</p>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
