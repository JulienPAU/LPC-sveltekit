<script lang="ts">
	import SectionTitle from '$lib/components/SectionTitle.svelte';

	export let data;
	const { definitions } = data;

	let activeLetter: string | null = 'A';
	let activeWordIndex: number | null = null;

	const normalizeChar = (char: string) => {
		return char.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
	};

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

	const sortedLetters = Object.keys(groupedDefinitions).sort((a, b) => {
		return normalizeChar(a).localeCompare(normalizeChar(b), 'fr');
	});

	if (!groupedDefinitions['A'] && sortedLetters.length > 0) {
		activeLetter = sortedLetters[0];
	}

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

	<p class=" mb-5 w-full p-4 text-justify font-semibold lg:mb-10 lg:w-4/5 lg:text-2xl">
		Bienvenue dans notre lexique horloger, votre guide complet pour découvrir et comprendre le monde
		fascinant de l'horlogerie. Que vous soyez passionné par les montres ou simplement curieux, ce
		lexique vous fournira des définitions claires et précises des termes techniques et des concepts
		essentiels utilisés dans l'industrie horlogère. Si vous ne trouvez pas un terme ou si vous
		souhaitez plus d'informations, n'hésitez pas à nous contacter !
	</p>
	<div
		class="mb-10 flex w-full flex-row flex-wrap justify-center gap-2 border-y bg-slate-900 p-4 text-white lg:w-2/3 lg:rounded-lg"
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
</div>
<!-- Content -->
<div class="w-full p-4">
	<div class="p-5 lg:p-10">
		{#if activeLetter && groupedDefinitions[activeLetter]}
			<h2 class="text-3xl font-bold">{activeLetter}</h2>
			<div class="">
				{#each groupedDefinitions[activeLetter] as { word, explanation }, index}
					<div class="mb-4 rounded-lg bg-slate-800 p-4 text-white">
						<button
							class="flex w-full items-center justify-between text-left text-2xl font-medium"
							on:click={() => toggleWordPanel(index)}
						>
							<span>{word}</span>

							<svg
								class="h-6 w-6 transition-transform duration-200 {activeWordIndex === index
									? 'rotate-180'
									: ''}"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 9l-7 7-7-7"
								/>
							</svg>
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
