<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1>Home</h1>
{#each data.articles as article}
	<article>
		<h2>{article.title}</h2>
		<p>Par {article.user.last_name} dans {article.category.name}</p>
		<div>{article.content}</div>
	</article>
{/each}
