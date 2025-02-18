<script lang="ts">
	import error_404 from '$lib/assets/error_404.gif';
</script>

<div class=" flex h-screen flex-col items-center justify-center gap-10 p-2">
	<h1 class="text-center text-4xl font-bold">404 | Page not found</h1>
	<p class="text-center text-lg font-bold">Cette page n'existe pas.</p>
	<p class="text-center text-lg font-bold">This page doesn't exists.</p>
	<img src={error_404} alt="500" class=" w-5/5 lg:w-1/5" />

	<button class="w-52 rounded-lg bg-warning p-4 hover:bg-yellow-400 hover:text-white"
		><a href="/" class="text-lg font-bold text-black hover:text-black">Retour à l'accueil</a
		></button
	>
</div>
