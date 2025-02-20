<script lang="ts">
	export let currentPage: number;
	export let totalPages: number;
	export let onPageChange: (page: number) => void;

	// Fonction pour changer de page
	function changePage(page: number) {
		if (page >= 1 && page <= totalPages) {
			onPageChange(page);
		}
	}

	// Génération des boutons de pagination dynamiques
	$: paginationButtons = (() => {
		const pages = [];
		if (totalPages <= 5) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			pages.push(1);

			if (currentPage > 3) {
				pages.push('...');
			}

			for (
				let i = Math.max(2, currentPage - 1);
				i <= Math.min(totalPages - 1, currentPage + 1);
				i++
			) {
				pages.push(i);
			}

			if (currentPage < totalPages - 2) {
				pages.push('...');
			}

			pages.push(totalPages);
		}
		return pages;
	})();
</script>

<div class="my-10 flex justify-center space-x-1">
	<!-- Bouton précédent -->
	<button
		on:click={() => changePage(currentPage - 1)}
		disabled={currentPage === 1}
		class="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-600 shadow-sm transition-all hover:bg-slate-800 hover:text-white hover:shadow-lg disabled:opacity-50"
	>
		Précédent
	</button>

	<!-- Pages -->
	{#each paginationButtons as page}
		{#if page === '...'}
			<span class="px-3 text-slate-600">...</span>
		{:else}
			<button
				on:click={() => typeof page === 'number' && changePage(page)}
				class="ml-2 min-w-9 rounded-md border px-3 py-2 text-sm shadow-sm transition-all
					{page === currentPage
					? 'border-transparent bg-slate-800 text-white shadow-md hover:bg-slate-700'
					: 'border-slate-300 text-slate-600 hover:bg-slate-800 hover:text-white'}"
			>
				{page}
			</button>
		{/if}
	{/each}

	<!-- Bouton suivant -->
	<button
		on:click={() => changePage(currentPage + 1)}
		disabled={currentPage === totalPages}
		class="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-600 shadow-sm transition-all hover:bg-slate-800 hover:text-white hover:shadow-lg disabled:opacity-50"
	>
		Suivant
	</button>
</div>
