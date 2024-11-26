<script>
	import LPC_BC from '$lib/assets/logos/LPC_BC.svg';
	import casio from '$lib/assets/watches/casio.png';
	let isMenuOpen = false;
</script>

<header
	class="min-h-screen bg-cover bg-center bg-no-repeat bg-blend-overlay"
	style="background-image: url({casio})"
>
	<div class="navbar sticky top-5 z-50 mx-5 w-auto rounded-2xl bg-base-200 bg-opacity-15">
		<!-- Navbar Start -->
		<div class="navbar-start">
			<!-- Mobile menu burger -->
			<div class="dropdown">
				<button
					type="button"
					class="btn btn-ghost lg:hidden"
					aria-label="Toggle navigation menu"
					on:click={() => (isMenuOpen = !isMenuOpen)}
				>
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
							d="M4 6h16M4 12h16m-7 6h7"
						/>
					</svg>
				</button>
				<ul
					class={`menu-compact menu dropdown-content mt-3 w-52 rounded-box bg-base-100 p-2 shadow ${
						isMenuOpen ? 'block' : 'hidden'
					}`}
				>
					<li><a href="#">Accueil</a></li>
					<li><a href="#">Articles</a></li>
					<li>
						<details>
							<summary>Divers</summary>
							<ul class="rounded-t-none bg-base-100 p-2">
								<li><a>Link 1</a></li>
								<li><a>Link 2</a></li>
							</ul>
						</details>
					</li>
				</ul>
			</div>

			<!-- Desktop links -->
			<div class="hidden lg:flex">
				<ul class="menu menu-horizontal px-1 sm:text-sm md:text-lg lg:text-lg">
					<li><a href="#">Accueil</a></li>
					<li><a href="#">Articles</a></li>
					<li>
						<details>
							<summary>Divers</summary>
							<ul class="rounded-t-none bg-base-100 p-2">
								<li><a>Link 1</a></li>
								<li><a>Link 2</a></li>
							</ul>
						</details>
					</li>
				</ul>
			</div>
		</div>

		<!-- Navbar Center -->
		<div class="navbar-center">
			<img alt="logo" src={LPC_BC} class="lg:h-30 h-14 object-contain md:h-20" />
		</div>

		<!-- Navbar End -->
		<div class="navbar-end">
			<button class="btn btn-circle btn-ghost" aria-label="Search">
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
				<ul class="menu menu-horizontal px-1 sm:text-sm md:text-lg lg:text-lg">
					<li><a href="#">Login</a></li>
				</ul>
			</div>
		</div>
	</div>
</header>
