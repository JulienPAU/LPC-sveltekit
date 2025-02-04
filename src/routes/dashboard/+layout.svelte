<!-- src/ routes/ dashboard/ +layout.svelte -->

<script lang="ts">
	import Navbar from '$lib/components/header/Navbar.svelte';

	import '../../app.css';
	let { children } = $props();

	let isMenuOpen = $state(false);

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	// import { page } from '$app/stores';
</script>

<Navbar />

<div class="flex flex-col">
	<!-- Barre de navigation mobile -->
	<div class="lg:hidden">
		<div class="bg-gray-700 text-gray-100 lg:hidden">
			<div class="flex items-center justify-between p-4">
				<h1 class="text-xl">Menu</h1>
				<button class="btn btn-square btn-ghost" onclick={toggleMenu} aria-label="Toggle Menu">
					{#if isMenuOpen}
						✕
					{:else}
						☰
					{/if}
				</button>
			</div>
			{#if isMenuOpen}
				<ul class="menu-compact menu bg-gray-800 p-4 font-bold text-gray-100">
					<li><a href="/dashboard" class="hover:bg-gray-600">Dashboard</a></li>
					<li><a href="/dashboard/profil" class="hover:bg-gray-600">Profil</a></li>
					<li><a href="/dashboard/publish" class="hover:bg-gray-600">Publier un article</a></li>
					<li>
						<a href="/dashboard/articles" class="hover:bg-gray-600">Voir ou modifier mes articles</a
						>
					</li>
					<li>
						<form method="POST" action="/auth/signout" class="group w-full hover:bg-gray-600">
							<button type="submit" class="deco w-full text-left group-hover:text-red-500">
								Déconnexion
							</button>
						</form>
					</li>
				</ul>
			{/if}
		</div>
		{@render children()}
	</div>
	<!-- Barre latérale pour grands écrans -->
	<div class=" hidden bg-gray-700 lg:flex lg:flex-row">
		<nav class="menu sticky top-0 h-screen w-80 space-y-2 bg-gray-700 p-4 text-gray-100">
			<li>
				<a href="/dashboard" class="text-lg font-bold hover:bg-gray-600"
					><i class="fa-solid fa-chart-pie" style="color: #eab308;"></i> Dashboard</a
				>
			</li>
			<li>
				<a href="/dashboard/profil" class="text-lg font-bold hover:bg-gray-600"
					><i class="fa-solid fa-user" style="color: #eab308;"></i> Profil</a
				>
			</li>
			<li>
				<a href="/dashboard/publish" class="text-lg font-bold hover:bg-gray-600"
					><i class="fa-solid fa-pen-clip" style="color: #eab308;"></i> Publier un article</a
				>
			</li>
			<li>
				<a href="/dashboard/articles" class="text-lg font-bold hover:bg-gray-600"
					><i class="fa-solid fa-newspaper" style="color: #eab308;"></i> Mes articles</a
				>
			</li>
			<li>
				<form method="POST" action="/auth/signout" class="group w-full hover:bg-gray-600">
					<button
						type="submit"
						class="deco w-full text-left text-lg font-bold group-hover:text-red-500"
					>
						<i class="fa-solid fa-right-from-bracket" style="color: #bd1705;"></i> Déconnexion
					</button>
				</form>
			</li>
		</nav>
		<main class="flex-1 bg-gray-100 p-4">
			{@render children()}
		</main>
	</div>
</div>
