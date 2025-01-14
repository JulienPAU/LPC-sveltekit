<div class="dropdown">
	<button
		tabindex="0"
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
	<button
		tabindex="0"
		class={`menu-compact menu dropdown-content z-50 mt-3 w-52 rounded-b-lg bg-gray-900 p-2 shadow ${
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
	</button>
</div>
