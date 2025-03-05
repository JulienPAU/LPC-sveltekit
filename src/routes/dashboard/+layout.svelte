<!-- src/ routes/ dashboard/ +layout.svelte -->

<script lang="ts">
	import Navbar from '$lib/components/header/Navbar.svelte';

	import '../../app.css';

	let { children, data } = $props();

	const { user } = data;

	let isMenuOpen = $state(false);

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	// import { page } from '$app/stores';
</script>

<!-- <Navbar /> -->

<div class="flex flex-col">
	<!-- Barre de navigation mobile -->
	<div class="lg:hidden">
		<!-- <div class="border-y-2 bg-slate-900 text-gray-100 lg:hidden">
			<div class="flex items-center justify-between p-4">
				<h1>Menu</h1>
				<button
					class="btn btn-square btn-ghost text-2xl"
					onclick={toggleMenu}
					aria-label="Toggle Menu"
				>
					{#if isMenuOpen}
						✕
					{:else}
						☰
					{/if}
				</button>
			</div>
			{#if isMenuOpen}
				<ul class="menu-compact menu bg-gray-900 p-4 font-bold text-gray-100">
					<div>
						<h3 class=" mb-2 font-normal">{user.username}</h3>
					</div>
					<li>
						<a href="/dashboard" class="text-lg hover:bg-gray-600">
							<i class="fa-solid fa-chart-pie" style="color: #eab308;"></i> Dashboard</a
						>
					</li>
					<li>
						<a href="/dashboard/profil" class="text-lg hover:bg-gray-600">
							<i class="fa-solid fa-user" style="color: #eab308;"></i> Profil</a
						>
					</li>
					<li>
						<a href="/dashboard/publish" class="text-lg hover:bg-gray-600">
							<i class="fa-solid fa-pen-clip" style="color: #eab308;"></i> Proposer un article</a
						>
					</li>
					<li>
						<a href="/dashboard/articles" class="text-lg hover:bg-gray-600">
							<i class="fa-solid fa-newspaper" style="color: #eab308;"></i> Mes articles</a
						>
					</li>
					<li>
						<form
							method="POST"
							action="/auth/signout"
							class="group w-full text-lg hover:bg-gray-600"
						>
							<button type="submit" class="deco w-full text-left group-hover:text-[#D22B2B]">
								<i class="fa-solid fa-right-from-bracket" style="color:#D22B2B;"></i> Déconnexion
							</button>
						</form>
					</li>
					{#if user.User_Role[0].role === 'MODERATOR'}
						<div>
							<h3 class="mb-2 mt-5 font-normal">Modérateur</h3>
						</div>
						<li>
							<a href="/dashboard/manage" class="text-lg font-bold hover:bg-gray-600"
								><i class="fa-solid fa-newspaper" style="color: #eab308;"></i> Gérer les articles</a
							>
						</li>
					{/if}
					
				</ul>
			{/if}
		</div> -->
		{@render children()}
	</div>
	<!-- Barre latérale pour grands écrans -->
	<div class=" hidden border-y-2 bg-slate-900 lg:flex lg:flex-row">
		<nav class="menu sticky top-0 h-full w-80 space-y-2 p-4 text-gray-100">
			<div>
				<h3 class="mb-2 mt-5">{user.username}</h3>
			</div>
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
					><i class="fa-solid fa-pen-clip" style="color: #eab308;"></i> Proposer un article</a
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
						class=" w-full text-left text-lg font-bold tracking-widest group-hover:text-[#D22B2B]"
						><i class="fa-solid fa-right-from-bracket" style="color: #D22B2B;"></i> Déconnexion
					</button>
				</form>
			</li>

			{#if user.User_Role[0].role === 'MODERATOR' || user.User_Role[0].role === 'ADMIN'}
				<div>
					<h3 class="mb-2 mt-5">Modérateur</h3>
				</div>
				<li>
					<a href="/dashboard/manage" class="text-lg font-bold hover:bg-gray-600"
						><i class="fa-solid fa-newspaper" style="color: #eab308;"></i> Gérer les articles</a
					>
				</li>
			{/if}
			{#if user.User_Role[0].role === 'ADMIN'}
				<div>
					<h3 class="mb-2 mt-5">Admin</h3>
				</div>
				<li>
					<a href="/dashboard/admin/" class="text-lg font-bold hover:bg-gray-600"
						><i class="fa-solid fa-chart-pie" style="color: #eab308;"></i> Dashboard</a
					>
				</li>
				<li>
					<a href="/dashboard/admin/manage/articles" class="text-lg font-bold hover:bg-gray-600"
						><i class="fa-solid fa-newspaper" style="color: #eab308;"></i>Modifier articles</a
					>
				</li>

				<li>
					<a
						href="/dashboard/admin/manage/articles/status"
						class="text-lg font-bold hover:bg-gray-600"
						><i class="fa-solid fa-newspaper" style="color: #eab308;"></i>Status articles</a
					>
				</li>
				<li>
					<a href="/dashboard/admin/lexique" class="text-lg font-bold hover:bg-gray-600"
						><i class="fa-solid fa-newspaper" style="color: #eab308;"></i>Lexique</a
					>
				</li>
				<li>
					<a href="/dashboard/admin/manage/users" class="text-lg font-bold hover:bg-gray-600"
						><i class="fa-solid fa-user" style="color: #eab308;"></i> Utilisateurs</a
					>
				</li>
			{/if}
		</nav>
		<main class="flex-1 bg-gray-100 p-4">
			{@render children()}
		</main>
	</div>
</div>
