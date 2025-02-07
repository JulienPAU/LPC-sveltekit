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
				<h3 class="mb-4 text-center">Statistiques Articles</h3>
				<div class="space-y-8">
					<div class="flex justify-between border-b pb-2">
						<span>Total Articles</span>
						<span class="font-bold text-yellow-500">{stats.totalArticles}</span>
					</div>
					<div class="flex justify-between border-b pb-2">
						<span>Articles Publiés</span>
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
						href="/dashboard/publish"
						class="btn btn-warning w-full text-lg hover:bg-yellow-400 hover:text-black"
					>
						<i class="fa-solid fa-pen-clip text-slate-800"></i> Proposer un Article
					</a>
					<a
						href="/dashboard/articles"
						class="btn btn-warning w-full text-lg hover:bg-yellow-400 hover:text-black"
					>
						<i class="fa-solid fa-newspaper text-slate-800"></i> Gérer mes Articles
					</a>
					<a
						href="/dashboard/profil"
						class="btn btn-warning w-full text-lg hover:bg-yellow-400 hover:text-black"
					>
						<i class="fa-solid fa-user text-slate-800"></i> Mon Profil
					</a>
				</div>
			</div>
		</div>
	</div>

	<div class="mt-10 w-full max-w-4xl rounded-xl bg-white p-6 shadow-lg">
		<h3 class="mb-4">📌 Comment fonctionne Les Petits Cadrans ?</h3>
		<p class="text-gray-600">
			Les Petits Cadrans est une plateforme dédiée aux passionnés d'horlogerie. Vous pouvez proposer
			vos articles et explorer ceux des autres contributeurs.
		</p>
		<p class="mt-4 text-gray-600">
			🔹 Commencez par rédiger et partager un article sur votre passion.
			<br />
			🔹 Consultez les articles populaires et découvrez de nouvelles perspectives horlogères.
		</p>
	</div>
</section>
