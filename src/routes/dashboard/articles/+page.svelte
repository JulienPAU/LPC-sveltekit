<!-- src/ routes/ dashboard/ articles/ +page.svelte -->

<script lang="ts">
	import { invalidate } from '$app/navigation';
	import Card from '$lib/components/card/Card.svelte';

	export let data;

	export let { user } = data;

	const articles = user.articles;

	async function refreshData() {
		await invalidate('articles');
	}
</script>

<div class=" flex flex-col items-center p-8">
	<h2 class="mb-10">Voir et modifier mes articles</h2>
	<section class="mb-20 flex w-full flex-wrap justify-center gap-10 lg:gap-20 xl:gap-20">
		{#each articles as a}
			<Card
				props={{
					title: a.title,
					introduction: a.introduction,
					imageUrl: a.images[0],
					author: user.username,
					category: a.article_type,
					id: a.id,
					isDashboard: true,
					status: a.status,
					imgStyle: 'h-[100px]',
					style:
						'xl:w-1/5 tranform card w-96 bg-base-100 shadow-xl transition duration-500 hover:scale-105 sm:w-1/6 md:w-2/5 lg:w-1/5 '
				}}
			/>
		{/each}
	</section>
</div>
