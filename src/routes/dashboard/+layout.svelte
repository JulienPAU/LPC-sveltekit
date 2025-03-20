<!-- src/ routes/ dashboard/ +layout.svelte -->

<script lang="ts">
	import '../../app.css';
	import { page } from '$app/state';

	let { children, data } = $props();

	const { user } = data;
	const ariclesSubmitted = $derived(page.data.ariclesSubmitted);
</script>

<div class="flex flex-col">
	<div class="lg:hidden">
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
					<a href="/dashboard/manage" class="flex items-center text-lg font-bold hover:bg-gray-600">
						<i class="fa-solid fa-newspaper" style="color: #eab308;"></i>
						<span class="flex items-center">
							<span>Gérer les articles</span>
							{#if ariclesSubmitted.total === 0}
								<i class="fa-solid fa-circle mb-3 ml-1 text-xs" style="color: #22c55e;"></i>
							{:else if ariclesSubmitted.total < 10}
								<i class="fa-solid fa-circle mb-3 ml-1 text-xs" style="color: #f97316;"></i>
							{:else}
								<i class="fa-solid fa-circle ml-1text-xs mb-3" style="color: #ef4444;"></i>
							{/if}
						</span>
					</a>
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
