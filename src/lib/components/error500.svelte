<script lang="ts">
	import error_500 from '$lib/assets/error_500.png';
</script>

<div class=" flex h-screen flex-col items-center justify-center gap-10 p-2">
	<h1 class="text-center text-4xl font-bold">500 | Internal Server Error</h1>
	<p class="text-center text-lg font-bold">
		Une erreur est survenue lors du traitement de votre requête.
	</p>
	<p class="text-center text-lg font-bold">An error occurred while processing your request.</p>
	<img src={error_500} alt="500" class=" w-5/5 lg:w-2/5" />

	<button class="w-52 rounded-lg bg-warning p-4 hover:bg-yellow-400 hover:text-white"
		><a href="/" class="text-lg font-bold text-black hover:text-black">Retour à l'accueil</a
		></button
	>
</div>
