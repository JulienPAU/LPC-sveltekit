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

<div class="flex h-screen flex-col">
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
				<ul class="menu-compact menu bg-gray-800 p-4 text-gray-100">
					<li><a href="#">Dashboard</a></li>
					<li><a href="#">Customers</a></li>
					<li><a href="#">Milestones</a></li>
					<li><a href="#">Team</a></li>
					<li><a href="#">Tasks</a></li>
					<li><a href="#">Settings</a></li>
				</ul>
			{/if}
		</div>
		{@render children()}
	</div>
	<!-- Barre latérale pour grands écrans -->
	<div class="hidden lg:flex lg:flex-row">
		<nav class="menu h-screen w-64 space-y-2 bg-gray-700 p-4 text-gray-100">
			<li><a href="/dashboard" class="hover:bg-gray-600">Dashboard</a></li>
			<li><a href="/dashboard/profil" class="hover:bg-gray-600">Profil</a></li>
			<li><a href="#" class="hover:bg-gray-600">Milestones</a></li>
			<li><a href="#" class="hover:bg-gray-600">Team</a></li>
			<li><a href="#" class="hover:bg-gray-600">Tasks</a></li>
			<li><a href="#" class="hover:bg-gray-600">Settings</a></li>
		</nav>
		<main class="flex-1 bg-gray-100 p-4">
			{@render children()}
		</main>
	</div>
</div>
