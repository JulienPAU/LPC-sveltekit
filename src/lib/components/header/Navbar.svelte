<script>
	import LPC_WC from '$lib/assets/logos/LPC_WC.svg';
	let isMenuOpen = false;
</script>

<!-- sticky top-5 -->
<navbar class=" navbar z-50 mx-0 w-auto rounded-2xl px-0 pt-5 text-white sm:mx-0 sm:mb-5 lg:mb-20">
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
					class="burger_menu"
					xmlns="$lib\assets\burger\menu.svg"
					viewBox="0 0 10 10"
					stroke="#eee"
					stroke-width=".6"
					fill="rgba(0,0,0,0)"
					stroke-linecap="round"
					style="cursor: pointer"
				>
					<path d="M2,3L5,3L8,3M2,5L8,5M2,7L5,7L8,7">
						<animate
							dur="0.2s"
							attributeName="d"
							values="M2,3L5,3L8,3M2,5L8,5M2,7L5,7L8,7;M3,3L5,5L7,3M5,5L5,5M3,7L5,5L7,7"
							fill="freeze"
							begin="start.begin"
						/>
						<animate
							dur="0.2s"
							attributeName="d"
							values="M3,3L5,5L7,3M5,5L5,5M3,7L5,5L7,7;M2,3L5,3L8,3M2,5L8,5M2,7L5,7L8,7"
							fill="freeze"
							begin="reverse.begin"
						/>
					</path>
					<rect width="10" height="10" stroke="none">
						<animate dur="2s" id="reverse" attributeName="width" begin="click" />
					</rect>
					<rect width="10" height="10" stroke="none">
						<animate
							dur="0.001s"
							id="start"
							attributeName="width"
							values="10;0"
							fill="freeze"
							begin="click"
						/>
						<animate
							dur="0.001s"
							attributeName="width"
							values="0;10"
							fill="freeze"
							begin="reverse.begin"
						/>
					</rect>
				</svg>
			</button>
			<ul
				class={`menu-compact menu dropdown-content z-50 mt-3 w-52 rounded-box bg-[#484C4F] p-2 shadow ${
					isMenuOpen ? 'block' : 'hidden'
				}`}
			>
				<li><a href="/">Accueil</a></li>
				<li><a href="articles">Articles</a></li>
				<li>
					<details>
						<summary>Divers</summary>
						<ul class="rounded-t-none p-2">
							<li><a href="/">Wiki</a></li>
							<li><a href="/">Lexique</a></li>
						</ul>
					</details>
				</li>
			</ul>
		</div>

		<!-- Desktop links -->
		<div class="hidden lg:flex">
			<ul class="menu menu-horizontal p-0 px-1 sm:text-sm md:text-lg lg:text-lg">
				<li><a href="/" class="border-none">Accueil</a></li>
				<li><a href="articles">Articles</a></li>
				<li>
					<details>
						<summary>Divers</summary>
						<ul class="drop rounded-t-none bg-gray-600 p-2">
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
		<a href="/"><img alt="logo" src={LPC_WC} class="lg:h-30 h-14 object-contain md:h-20" /></a>
	</div>

	<!-- Navbar End -->
	<div class="navbar-end">
		<button class="btn btn-ghost p-0" aria-label="Search">
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
				<li><a href="/">Login</a></li>
			</ul>
		</div>
	</div>
</navbar>
