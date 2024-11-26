<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h2>Home</h2>
{#each data.articles as article}
	<article>
		<h3>{article.title}</h3>
		<p>Par {article.user.last_name} dans {article.category.name}</p>
		<div>{article.content}</div>
	</article>
{/each}
