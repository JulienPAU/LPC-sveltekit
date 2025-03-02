<!-- src/lib/ components/header/Navbar.svelte -->

<script lang="ts">
	import logoC from '$lib/assets/logos/logoC.svg';
	import { page } from '$app/state';
	import type { SessionUser } from '$lib/types/user';
	import { onMount } from 'svelte';
	export let watches: Array<{ brand: string; model: string }> = [];

	let scrolled = false;
	let navbarClass = '';
	let menuBgClass = '';

	function handleScroll() {
		if (window.scrollY > 10) {
			scrolled = true;
			navbarClass = 'bg-opacity-80 shadow-md ';
			menuBgClass = 'bg-opacity-80 ';
		} else {
			scrolled = false;
			navbarClass = 'bg-opacity-100';
			menuBgClass = 'bg-opacity-100';
		}
	}

	onMount(() => {
		// Ajout de l'écouteur d'événement scroll
		window.addEventListener('scroll', handleScroll);

		// Nettoyage à la destruction du composant
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});

	function normalizeBrandName(brand: string): string {
		return brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase();
	}

	const getValidImageSrc = (user: any) => {
		if (!user) return '/user.png';
		if (user.image?.includes('googleusercontent.com')) {
			return user.profile_picture || '/user.png';
		}
		return user.image || user.profile_picture || '/user.png';
	};

	function handleClickOutside(e: MouseEvent) {
		const details = document.querySelectorAll('details');
		details.forEach((detail) => {
			if (!detail.contains(e.target as Node)) {
				detail.removeAttribute('open');
			}
		});
	}

	const validWatches = Array.isArray(watches) ? watches : [];
	const normalizedWatches = validWatches.map((watch) => ({
		...watch,
		brand: normalizeBrandName(watch.brand)
	}));

	const uniqueBrands = [...new Set(normalizedWatches.map((watch) => watch.brand))];

	const displayedBrands = uniqueBrands.slice(0, 8);

	const userSession = page.data.session?.user as SessionUser;

	const userRole = userSession?.User_Role;
</script>

<svelte:window on:click={handleClickOutside} />

<navbar
	class="navbar sticky top-0 z-50 mx-auto w-full bg-slate-900 px-0 pt-5 text-white transition-all duration-300 sm:mx-0 {navbarClass}"
>
	<!-- Navbar Start -->
	<div class="navbar-start">
		<!-- Mobile menu burger -->
		<div class="dropdown px-2 xl:hidden">
			<div tabindex="0" role="button" class="btn btn-circle btn-ghost border">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-10 w-8"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h16M4 18h16"
					/>
				</svg>
			</div>
			<button
				tabindex="0"
				class="bakdrop-blur-none menu dropdown-content menu-sm z-[1] w-40 gap-5 rounded-lg border border-yellow-500 bg-gray-900 bg-opacity-100 p-2 shadow {menuBgClass}"
			>
				<li><a href="/" class="text-base hover:bg-gray-600">Accueil</a></li>
				<li><a href="/articles" class="text-base hover:bg-gray-600">Articles</a></li>

				<li><a href="/galerie" class="text-base hover:bg-gray-600">Galerie</a></li>
				<li><a href="/lexique" class="text-base hover:bg-gray-600">Lexique</a></li>
				<li>
					<details>
						<summary class="text-base">Marques</summary>
						<ul class="drop rounded-lg border border-yellow-500 bg-slate-900 p-2 {menuBgClass}">
							{#if displayedBrands.length === 0}
								<li>
									<a href="/" class="text-base text-white hover:bg-gray-600">Aucune marque</a>
								</li>
							{:else}
								{#each displayedBrands as brand}
									<li>
										<a href="/articles/brand/{brand}" class="text-base text-white hover:bg-gray-600"
											>{brand}</a
										>
									</li>
								{/each}
								<li>
									<a
										href="/articles/brand"
										class="whitespace-nowrap text-base text-white hover:bg-gray-600"
										>Toutes les marques</a
									>
								</li>
							{/if}
						</ul>
					</details>
				</li>

				<!-- <li>
					<details>
						<summary>Guide</summary>
						<ul class=" rounded-lg border border-yellow-500 p-2">
							<li><a href="/lexique" class="hover:bg-gray-600">Lexique</a></li>
						</ul>
					</details>
				</li> -->
			</button>
		</div>

		<!-- Desktop links -->
		<div class="z-10 hidden xl:flex">
			<ul
				class="menu menu-horizontal items-center p-0 px-1 transition-all duration-300 {menuBgClass} sm:text-sm md:text-lg lg:text-lg"
			>
				<li>
					<a
						href="/"
						class=" border-none text-white hover:bg-gray-600 hover:text-yellow-400"
						aria-label="Accueil"><i class="fa-solid fa-house"></i></a
					>
				</li>
				<li><a href="/articles" class="hover:bg-gray-600">Articles</a></li>
				<li><a href="/galerie" class="hover:bg-gray-600">Galerie</a></li>
				<li><a href="/lexique" class="hover:bg-gray-600">Lexique</a></li>

				<li class="rounded-lg hover:bg-gray-600">
					<details>
						<summary>Marques</summary>
						<ul class="border border-yellow-500 bg-slate-900 p-2">
							{#if displayedBrands.length === 0}
								<li>
									<a href="/" class="whitespace-nowrap text-white hover:bg-gray-600"
										>Aucune marque</a
									>
								</li>
							{:else}
								{#each displayedBrands as brand}
									<li>
										<a
											href="/articles/brand/{brand.toLowerCase()}"
											class="whitespace-nowrap text-white hover:bg-gray-600"
										>
											{brand}
										</a>
									</li>
								{/each}
								<li class="mr-4 inline-block">
									<a href="/articles/brand" class="whitespace-nowrap text-white hover:bg-gray-600"
										>Toutes les marques</a
									>
								</li>
							{/if}
						</ul>
					</details>
				</li>

				<!-- 
				<li class="rounded-lg hover:bg-gray-600">
					<details>
						<summary>Guide</summary>
						<ul class="drop border border-yellow-500 bg-slate-900 p-2">
							<li><a href="/lexique" class="hover:bg-gray-600">Lexique</a></li>
						</ul>
					</details>
				</li> -->
			</ul>
		</div>
	</div>

	<!-- Navbar Center -->
	<div class="navbar-center">
		<a href="/"><img alt="logo" src={logoC} class="mb-3 h-16 object-contain md:h-20 lg:h-24" /></a>
	</div>

	<!-- Navbar End -->
	<div class="navbar-end">
		<!-- <button class="search btn btn-ghost p-0" aria-label="Search">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
				/>
			</svg>
		</button> -->
		<div class="lg:flex">
			<ul class="menu menu-horizontal px-5 sm:text-sm md:text-lg lg:text-lg">
				{#if userSession}
					<div class="dropdown dropdown-left lg:dropdown-hover">
						<button class="avatar cursor-pointer" tabindex="0">
							<div class="w-10 rounded-full border border-yellow-500 text-sm lg:w-12">
								<img
									src={getValidImageSrc(userSession)}
									alt="Avatar"
									on:error={(event) => {
										const img = event.target as HTMLImageElement;
										if (img.src !== '/user.png') {
											img.src = '/user.png';
										}
									}}
								/>
							</div>
						</button>
						<ul
							class=" menu dropdown-content z-[1] w-52 rounded-box border border-yellow-500 bg-gray-900 p-2 shadow"
						>
							<div>
								<h3 class=" mb-2 text-lg font-normal">{userSession.username}</h3>
							</div>
							<li>
								<a href="/dashboard" class="hover:bg-gray-600"
									><i class="fa-solid fa-chart-pie" style="color: #eab308;"></i> Dashboard</a
								>
							</li>
							<li>
								<a href="/dashboard/profil" class="hover:bg-gray-600"
									><i class="fa-solid fa-user" style="color: #eab308;"></i> Profil</a
								>
							</li>
							<li>
								<a href="/dashboard/publish" class="hover:bg-gray-600"
									><i class="fa-solid fa-pen-clip" style="color: #eab308;"></i> Proposer article</a
								>
							</li>
							<li>
								<a href="/dashboard/articles" class="hover:bg-gray-600"
									><i class="fa-solid fa-newspaper" style="color: #eab308;"></i> Mes articles</a
								>
							</li>

							<li>
								<form method="POST" action="/auth/signout" class="group w-full hover:bg-gray-600">
									<button type="submit" class="deco w-full text-left group-hover:text-[#D22B2B]">
										<i class="fa-solid fa-right-from-bracket" style="color:#D22B2B;"></i> Déconnexion
									</button>
								</form>
							</li>

							{#if userRole === 'MODERATOR' || userRole === 'ADMIN'}
								<div>
									<h3 class="mb-2 mt-5 text-lg">Modérateur</h3>
								</div>
								<li>
									<a href="/dashboard/manage" class=" hover:bg-gray-600"
										><i class="fa-solid fa-newspaper" style="color: #eab308;"></i> Gérer les articles</a
									>
								</li>
							{/if}
							{#if userRole === 'ADMIN'}
								<div>
									<h3 class="mb-2 mt-5 text-lg">Admin</h3>
								</div>
								<li>
									<a href="/dashboard/admin" class="hover:bg-gray-600"
										><i class="fa-solid fa-chart-pie" style="color: #eab308;"></i> Dashboard</a
									>
								</li>
								<li>
									<a href="/dashboard/admin/manage/articles" class="hover:bg-gray-600"
										><i class="fa-solid fa-newspaper" style="color: #eab308;"></i>Modifier articles</a
									>
								</li>
								<li>
									<a href="/dashboard/admin/manage/articles/status" class="hover:bg-gray-600"
										><i class="fa-solid fa-newspaper" style="color: #eab308;"></i>Status articles</a
									>
								</li>
								<li>
									<a href="/dashboard/admin/lexique" class="hover:bg-gray-600"
										><i class="fa-solid fa-newspaper" style="color: #eab308;"></i>Lexique</a
									>
								</li>

								<li>
									<a href="/dashboard/admin/manage/users" class="hover:bg-gray-600"
										><i class="fa-solid fa-user" style="color: #eab308;"></i> Utilisateurs</a
									>
								</li>
							{/if}
						</ul>
					</div>
				{:else}
					<li class="xl:hidden">
						<a
							href="/auth/login"
							aria-label="Se connecter"
							class=" bg-warning p-0 text-lg font-bold text-black hover:bg-yellow-400 hover:text-black"
							><i class="fa-solid fa-right-to-bracket p-2.5" style="color: #000000;"></i></a
						>
					</li>
					<!-- Version desktop avec texte -->
					<li class="hidden xl:block">
						<a
							href="/auth/login"
							class="btn bg-warning text-lg font-bold text-black hover:bg-yellow-400 hover:text-black"
							>Se connecter</a
						>
					</li>
				{/if}
			</ul>
		</div>
	</div>
</navbar>

<style>
	.navbar {
		transition: all 0.3s ease-in-out;
	}
</style>
