<!-- src/ routes/dashboard/admin/lexique/%2Bpage.svelte -->

<script lang="ts">
	import Pagination from '$lib/components/Pagination.svelte';

	export let data;

	const { allDefinitions } = data;

	let currentPage = 1;
	const itemsPerPage = allDefinitions.length > 10 ? 50 : allDefinitions.length;

	$: totalPages = Math.ceil(allDefinitions.length / itemsPerPage);

	$: paginateddefinitions = allDefinitions.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);
</script>

<div class="flex flex-col justify-center gap-2 p-4">
	<div class="flex justify-center gap-2">
		<a href="/dashboard/admin/lexique/publish" class="btn btn-neutral"> Publier une définition</a>
	</div>
	<div>
		<Pagination {currentPage} {totalPages} onPageChange={(page) => (currentPage = page)} />
	</div>
	<div class="flex flex-wrap justify-center gap-2 p-4">
		{#if allDefinitions.length > 0}
			{#each paginateddefinitions as definition}
				<a
					href="/dashboard/admin/lexique/publish?id={definition.id}"
					class="flex items-center justify-center gap-5 rounded-lg bg-slate-300 p-4 text-black hover:bg-slate-200"
				>
					<h3 class="text-lg">{definition.title}</h3>
				</a>
			{/each}
		{:else}
			<p class="text-center">Aucune définition pour le moment.</p>
		{/if}
	</div>
</div>
