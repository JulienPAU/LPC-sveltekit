<!-- src/lib/components/error403.svelte -->

<script lang="ts">
	import error_403 from '$lib/assets/error_403.gif';
</script>

<div class=" flex h-screen flex-col items-center justify-center gap-10 p-2">
	<h1 class="text-center text-4xl font-bold">403 | Forbidden</h1>
	<p class="text-center text-lg font-bold">Vous n'avez pas les droits pour accéder à cette page.</p>
	<p class="text-center text-lg font-bold">You do not have permission to access this page.</p>
	<img src={error_403} alt="403" class=" w-4/5 lg:w-1/5" />

	<div class="flex flex-wrap items-center justify-center gap-4">
		<button class="w-52 rounded-lg bg-warning p-4 hover:bg-yellow-400 hover:text-white"
			><a href="/" class="text-lg font-bold text-black hover:text-black">Retour à l'accueil</a
			></button
		>

		<button class="w-52 rounded-lg bg-warning p-4 hover:bg-yellow-400 hover:text-white"
			><a href="/auth/login" class="text-lg font-bold text-black hover:text-black">Se connecter</a
			></button
		>
	</div>
</div>
