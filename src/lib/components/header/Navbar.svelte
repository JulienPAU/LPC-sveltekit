<script>
	import LPC_WC from '$lib/assets/logos/LPC_WC.svg';
	import { page } from '$app/stores';

	let isMenuOpen = false;
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
						d="M4 6h16M4 12h16M4 18h16M4"
					/>
				</svg>
			</div>
			<button
				tabindex="0"
				class="menu dropdown-content menu-sm z-[1] mt-3 w-40 gap-5 rounded-b-lg bg-gray-900 p-2 shadow"
			>
				<li><a href="/">Accueil</a></li>
				<li><a href="/articles">Articles</a></li>
				<li>
					<details>
						<summary>Divers</summary>
						<ul class="rounded-t-none p-2">
							<li><a href="/">Wiki</a></li>
							<li><a href="/">Lexique</a></li>
						</ul>
					</details>
				</li>
			</button>
		</div>

		<!-- Desktop links -->
		<div class="hidden lg:flex">
			<ul class="menu menu-horizontal bg-gray-900 p-0 px-1 sm:text-sm md:text-lg lg:text-lg">
				<li><a href="/" class="border-none">Accueil</a></li>
				<li><a href="/articles">Articles</a></li>
				<li>
					<details>
						<summary>Divers</summary>
						<ul class="drop rounded-t-none bg-gray-900 p-2">
							<li><a href="/">Wiki</a></li>
							<li><a href="/">Lexique</a></li>
						</ul>
					</details>
				</li>
			</ul>
		</div>
	</div>

	<!-- Navbar Center -->
	<div class="navbar-center">
		<a href="/"><img alt="logo" src={LPC_WC} class="lg:h-30 mb-3 h-14 object-contain md:h-20" /></a>
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
							<div class="w-10 rounded-full border border-yellow-500 text-sm">
								<img
									src={$page?.data?.session?.user?.image ||
										$page?.data?.session?.user?.profile_picture ||
										'/src/lib/assets/user.png'}
									alt="Avatar"
									on:error={(event) => {
										const target = /** @type {HTMLImageElement} */ (event.target);
										if (target.src !== '/src/lib/assets/user.png') {
											target.src = '/src/lib/assets/user.png';
										}
									}}
								/>
							</div>
						</button>
						<ul
							class=" menu dropdown-content z-[1] w-52 rounded-box border border-yellow-500 bg-gray-900 p-2 shadow"
						>
							<li><a href="/dashboard">Dashboard</a></li>
							<li><a href="/dashboard/profil">Profil</a></li>
							<!-- <li><a href="/settings">Paramètres</a></li> -->
							<li>
								<form method="POST" action="/auth/signout">
									<button type="submit" class="deco w-full text-left">Déconnexion</button>
								</form>
							</li>
						</ul>
					</div>
				{:else}
					<li><a href="/auth/login">Login</a></li>
				{/if}
			</ul>
		</div>
	</div>
</navbar>
