<!-- src/lib/components/error403.svelte -->

<script lang="ts">
	import error_403 from '$lib/assets/error_403.gif';
</script>

<div class="flex min-h-screen flex-col items-center justify-center gap-6 p-4 text-center">
	<h1 class="text-3xl font-bold sm:text-4xl">403 | Forbidden</h1>
	<p class="text-lg font-semibold sm:text-xl">
		Vous n'avez pas les droits pour accéder à cette page.
	</p>
	<p class="text-lg font-semibold sm:text-xl">You do not have permission to access this page.</p>

	<img src={error_403} alt="403" class="w-4/5 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg" />

	<div
		class="flex w-full max-w-sm flex-col items-center gap-3 sm:max-w-md sm:flex-row sm:justify-center"
	>
		<a
			href="/"
			class="w-full rounded-lg bg-warning p-4 text-lg font-bold text-black transition hover:bg-yellow-400 sm:w-52"
		>
			Retour à l'accueil
		</a>

		<a
			href="/auth/login"
			class="w-full rounded-lg bg-warning p-4 text-lg font-bold text-black transition hover:bg-yellow-400 sm:w-52"
		>
			Se connecter
		</a>
	</div>
</div>
