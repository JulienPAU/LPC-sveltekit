<!-- src/lib/ components/header/Navbar.svelte -->

<script lang="ts">
	import LPC_WC from '$lib/assets/logos/LPC_WC.svg';
	import logoC from '$lib/assets/logos/logoC.svg';
	import { page } from '$app/stores';
	export let watches: Array<{ brand: string; model: string }> = [];

	const uniqueBrands = [...new Set(watches.map((watch) => watch.brand))];
</script>

<!-- sticky top-5 -->
<navbar class="  navbar z-50 mx-0 w-auto bg-gray-900 px-0 pt-5 text-white sm:mx-0">
	<!-- Navbar Start -->
	<div class="navbar-start">
		<!-- Mobile menu burger -->
		<div class="dropdown px-2 lg:hidden">
			<div tabindex="0" role="button" class="btn btn-circle btn-ghost">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
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
				class="menu dropdown-content menu-sm z-[1] w-40 gap-5 rounded-b-lg bg-gray-900 p-2 shadow"
			>
				<li><a href="/" class="hover:bg-gray-600">Accueil</a></li>
				<li><a href="/articles" class="hover:bg-gray-600">Articles</a></li>
				<li>
					<details>
						<summary>Marques</summary>
						<ul class="drop rounded-t-none bg-slate-900 p-2">
							{#each uniqueBrands as brand}
								<li class="hover:bg-gray-600">
									<a href="/{brand.toLowerCase()}" class="text-white hover:bg-gray-600">
										{brand}
									</a>
								</li>
							{/each}
						</ul>
					</details>
				</li>

				<li>
					<details>
						<summary>Divers</summary>
						<ul class="rounded-t-none p-2">
							<li><a href="/" class="hover:bg-gray-600">Wiki</a></li>
							<li><a href="/" class="hover:bg-gray-600">Lexique</a></li>
						</ul>
					</details>
				</li>
			</button>
		</div>

		<!-- Desktop links -->
		<div class="z-10 hidden lg:flex">
			<ul class="menu menu-horizontal bg-gray-900 p-0 px-1 sm:text-sm md:text-lg lg:text-lg">
				<li><a href="/" class="border-none hover:bg-gray-600">Accueil</a></li>
				<li><a href="/articles" class="hover:bg-gray-600">Articles</a></li>
				<li class="rounded-lg hover:bg-gray-600">
					<details>
						<summary>Marques</summary>
						<ul class="drop rounded-t-none bg-slate-900 p-2">
							{#each uniqueBrands as brand}
								<li>
									<a href="/{brand.toLowerCase()}" class="text-white hover:bg-gray-600">
										{brand}
									</a>
								</li>
							{/each}
						</ul>
					</details>
				</li>
				<li class="rounded-lg hover:bg-gray-600">
					<details>
						<summary>Divers</summary>
						<ul class="drop rounded-t-none bg-slate-900 p-2">
							<li><a href="/" class="hover:bg-gray-600">Lexique</a></li>
						</ul>
					</details>
				</li>
			</ul>
		</div>
	</div>

	<!-- Navbar Center -->
	<div class="navbar-center">
		<a href="/"><img alt="logo" src={logoC} class="mb-3 h-16 object-contain md:h-20 lg:h-24" /></a>
	</div>

	<!-- Navbar End -->
	<div class="navbar-end">
		<button class="search btn btn-ghost p-0" aria-label="Search">
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
		</button>
		<div class="lg:flex">
			<ul class="menu menu-horizontal px-5 sm:text-sm md:text-lg lg:text-lg">
				{#if $page?.data?.session}
					<div class="dropdown dropdown-left lg:dropdown-hover">
						<button class="avatar cursor-pointer" tabindex="0">
							<div class="w-10 rounded-full border border-yellow-500 text-sm lg:w-12">
								<img
									src={$page?.data?.session?.user?.image ||
										$page?.data?.session?.user?.profile_picture ||
										'/src/lib/assets/user.png'}
									alt="Avatar"
									on:error={(event) => {
										const target = /** @type {HTMLImageElement} */ (event.target);
										if ((target as HTMLImageElement)?.src !== '/src/lib/assets/user.png') {
											if (target) {
												(target as HTMLImageElement).src = '/src/lib/assets/user.png';
											}
										}
									}}
								/>
							</div>
						</button>
						<ul
							class=" menu dropdown-content z-[1] w-52 rounded-box border border-yellow-500 bg-gray-900 p-2 shadow"
						>
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
									><i class="fa-solid fa-pen-clip" style="color: #eab308;"></i> Proposer un article</a
								>
							</li>
							<li>
								<a href="/dashboard/articles" class="hover:bg-gray-600"
									><i class="fa-solid fa-newspaper" style="color: #eab308;"></i> Mes articles</a
								>
							</li>
							<li>
								<form method="POST" action="/auth/signout" class="group w-full hover:bg-gray-600">
									<button type="submit" class="deco w-full text-left group-hover:text-red-500">
										<i class="fa-solid fa-right-from-bracket" style="color: #bd1705;"></i> Déconnexion
									</button>
								</form>
							</li>
						</ul>
					</div>
				{:else}
					<li>
						<a
							href="/auth/login"
							class="btn bg-warning text-sm font-bold text-black hover:bg-yellow-400 hover:text-black lg:text-lg"
							>Login</a
						>
					</li>
				{/if}
			</ul>
		</div>
	</div>
</navbar>
