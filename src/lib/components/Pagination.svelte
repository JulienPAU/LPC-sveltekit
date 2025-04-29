<script lang="ts">
	export let currentPage: number;
	export let totalPages: number;
	export let onPageChange: (page: number) => void;

	function changePage(page: number) {
		if (page >= 1 && page <= totalPages) {
			onPageChange(page);
			window.scrollTo({
				top: 0,
				behavior: 'auto'
			});
		}
	}

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
	{#if totalPages > 1}
		<button
			on:click={() => changePage(currentPage - 1)}
			disabled={currentPage === 1}
			class="rounded-md border border-slate-300 px-2 py-2 text-sm text-slate-600 shadow-sm transition-all hover:bg-slate-800 hover:text-white hover:shadow-lg disabled:opacity-50 sm:px-3"
		>
			<span class="hidden sm:inline">Précédent</span>
			<span class="sm:hidden">&lt;</span>
		</button>
	{/if}

	{#each paginationButtons as page}
		{#if page === '...'}
			<span class="px-2 text-slate-600">...</span>
		{:else}
			<button
				on:click={() => typeof page === 'number' && changePage(page)}
				class="ml-1 min-w-8 rounded-md border px-2 py-2 text-sm shadow-sm transition-all sm:ml-2 sm:min-w-9 sm:px-3
                    {page === currentPage
					? 'border-transparent bg-slate-800 text-white shadow-md hover:bg-slate-700'
					: 'border-slate-300 text-slate-600 hover:bg-slate-800 hover:text-white'}"
			>
				{page}
			</button>
		{/if}
	{/each}

	{#if totalPages > 1}
		<button
			on:click={() => changePage(currentPage + 1)}
			disabled={currentPage === totalPages}
			class="rounded-md border border-slate-300 px-2 py-2 text-sm text-slate-600 shadow-sm transition-all hover:bg-slate-800 hover:text-white hover:shadow-lg disabled:opacity-50 sm:px-3"
		>
			<span class="hidden sm:inline">Suivant</span>
			<span class="sm:hidden">&gt;</span>
		</button>
	{/if}
</div>
