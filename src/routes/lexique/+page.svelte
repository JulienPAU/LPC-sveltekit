<script lang="ts">
	import SectionTitle from '$lib/components/SectionTitle.svelte';

	import error_500 from '$lib/assets/error_500.png';

	let activeLetter: string | null = null;
	let activeWordIndex: number | null = null;

	const fakeData: { [key: string]: { word: string; explanation: string }[] } = {
		A: [
			{ word: 'Apple', explanation: 'A fruit that is typically red or green.' },
			{ word: 'Apricot', explanation: 'A small, orange fruit with a stone inside.' }
		],
		B: [
			{
				word: 'Banana',
				explanation:
					'A long, yellow fruit. Banananananananananananananananananananananananannanananananananananananananananananan'
			},
			{ word: 'Blueberry', explanation: 'A small, round, blue fruit.' }
		],
		C: [
			{ word: 'Cat', explanation: 'A small, furry animal often kept as a pet.' },
			{ word: 'Cheetah', explanation: 'A large wild cat known for its speed.' }
		],
		D: [
			{ word: 'Dog', explanation: 'A domesticated carnivorous mammal.' },
			{ word: 'Dolphin', explanation: 'A highly intelligent marine mammal.' }
		],
		E: [
			{ word: 'Elephant', explanation: 'A large mammal with a long trunk.' },
			{ word: 'Eagle', explanation: 'A large bird of prey with a powerful beak.' }
		],
		F: [
			{ word: 'Fish', explanation: 'A cold-blooded vertebrate animal that lives in water.' },
			{ word: 'Falcon', explanation: 'A bird of prey known for its speed.' }
		]
	};

	const selectLetter = (letter: string) => {
		activeLetter = activeLetter === letter ? null : letter;
		activeWordIndex = null;
	};

	const toggleWordPanel = (index: number) => {
		activeWordIndex = activeWordIndex === index ? null : index;
	};
</script>

<div class="flex justify-center gap-4">
	<!-- Sidebar -->
	<div class="flex w-1/6 flex-col gap-2 border-y bg-slate-900 p-4 text-white">
		{#each Object.keys(fakeData) as letter}
			<button
				class=" rounded-lg p-2 text-xl font-bold hover:bg-slate-700"
				on:click={() => selectLetter(letter)}
			>
				{letter}
			</button>
		{/each}
	</div>

	<!-- Content -->
	<div class="flex w-full flex-col p-4">
		<SectionTitle title="Lexique" />

		<div>
			{#if activeLetter}
				<h2 class="text-3xl font-bold">{activeLetter}</h2>
				<div class="mt-4">
					{#each fakeData[activeLetter] as { word, explanation }, index}
						<div class="mb-4 rounded-lg bg-slate-800 p-4 text-white">
							<button
								class="w-full text-left text-xl font-medium"
								on:click={() => toggleWordPanel(index)}
							>
								{word}
							</button>
							{#if activeWordIndex === index}
								<p class="mt-2 text-sm text-gray-300">{explanation}</p>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<div class="flex items-center justify-center">
			<img src={error_500} alt="lexique" class="w-3/5" />
		</div>
	</div>
</div>
