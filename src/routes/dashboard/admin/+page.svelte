<script lang="ts">
	export let data;
	const user = data?.user;

	export let stats = {
		totalArticles: 5,
		publishedArticles: 2,
		pendingArticles: 3
	};
</script>

<section class="flex flex-col items-center p-8">
	<h2 class="mb-10">
		Bienvenue <span class="border-b-4 border-b-yellow-500">{user?.username}</span>
	</h2>

	<p class="mb-6 text-lg font-semibold text-gray-900">Prêt à partager votre passion horlogère ?</p>

	<div class="w-full max-w-4xl rounded-xl bg-gray-200 p-6 shadow-lg">
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<div class="rounded-xl bg-white p-6 shadow-md">
				<h3 class="mb-4 text-center">Statistiques</h3>
				<div class="space-y-4">
					<div class="flex justify-between border-b pb-2">
						<span>Nombre d'articles</span>
						<span class="font-bold text-yellow-500">{stats.totalArticles}</span>
					</div>
					<div class="flex justify-between border-b pb-2">
						<span>Nombre d'utilisateurs</span>
						<span class="font-bold text-green-500">{stats.publishedArticles}</span>
					</div>
					<div class="flex justify-between border-b pb-2">
						<span>Nombre de modérateur</span>
						<span class="font-bold text-green-500">{stats.publishedArticles}</span>
					</div>
					<div class="flex justify-between border-b pb-2">
						<span>Articles en Attente</span>
						<span class="font-bold text-red-500">{stats.pendingArticles}</span>
					</div>
				</div>
			</div>

			<div class="rounded-xl bg-white p-6 shadow-md">
				<h3 class="mb-4 text-center">Actions Rapides</h3>
				<div class="space-y-3">
					<a
						href="/dashboard/admin/manage/articles"
						class="btn btn-warning w-full text-lg hover:bg-yellow-400 hover:text-black"
					>
						<i class="fa-solid fa-newspaper text-slate-800"></i> Modifier articles
					</a>

					<a
						href="/dashboard/admin/manage/articles/status"
						class="btn btn-warning w-full text-lg hover:bg-yellow-400 hover:text-black"
					>
						<i class="fa-solid fa-newspaper text-slate-800"></i> Status articles
					</a>
					<a
						href="/dashboard/admin/manage/users"
						class="btn btn-warning w-full text-lg hover:bg-yellow-400 hover:text-black"
					>
						<i class="fa-solid fa-user text-slate-800"></i> Gérer les utilisateurs
					</a>
				</div>
			</div>
		</div>
	</div>
</section>
