<script lang="ts">
	export let data;
	const user = data?.user;

	const { allArticlesCount, allUsersCount } = data;

	console.log(allUsersCount);
</script>

<section class="flex flex-col items-center p-4">
	<h2 class="mb-10">
		Bienvenue <span class="border-b-4 border-b-yellow-500">{user?.username}</span>
	</h2>

	<p class="mb-6 text-lg font-semibold text-gray-900">Prêt à partager votre passion horlogère ?</p>

	<div
		class=" flex w-full max-w-5xl flex-col items-center gap-5 rounded-xl bg-gray-200 p-6 shadow-lg"
	>
		<div class="max-w-xl rounded-xl bg-white p-6 shadow-md">
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
					<i class="fa-solid fa-user text-slate-800"></i> Gérer utilisateurs
				</a>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<div class="rounded-xl bg-white p-6 shadow-md">
				<h3 class="mb-4 text-center">Statistiques Articles</h3>
				<div class="space-y-9">
					<div class="flex justify-between border-b pb-2">
						<span>Nombre d'articles</span>
						<span class="font-bold text-black"
							>{allArticlesCount.total < 0 ? '0' : allArticlesCount.total}</span
						>
					</div>
					<div class="flex justify-between border-b pb-2">
						<span>Articles Publié(s)</span>
						<span class="font-bold text-green-500"
							>{allArticlesCount.countByStatus.PUBLISHED < 0
								? '0'
								: allArticlesCount.countByStatus.PUBLISHED}</span
						>
					</div>
					<div class="flex justify-between border-b pb-2">
						<span>Articles en Attente</span>
						<span class="font-bold text-yellow-500"
							>{allArticlesCount.countByStatus.SUBMITTED < 0
								? '0'
								: allArticlesCount.countByStatus.SUBMITTED}</span
						>
					</div>
					<div class="flex justify-between border-b pb-2">
						<span>Articles Refusé(s)</span>
						<span class="font-bold text-red-500"
							>{allArticlesCount.countByStatus.REFUSED < 0
								? '0'
								: allArticlesCount.countByStatus.REFUSED}</span
						>
					</div>
				</div>
			</div>

			<div class="rounded-xl bg-white p-6 shadow-md">
				<h3 class="mb-4 text-center">Statistiques utilisateurs</h3>
				<div class="space-y-2">
					<div class="flex justify-between border-b pb-2">
						<span>Nombre d'utilisateurs</span>
						<span class="font-bold text-black"
							>{allUsersCount.total < 0 ? '0' : allUsersCount.total}</span
						>
					</div>
					<div class="flex justify-between border-b pb-2">
						<span>Lecteur(s)</span>
						<span class="font-bold text-green-500"
							>{allUsersCount.roles.reader < 0 ? '0' : allUsersCount.roles.reader}</span
						>
					</div>
					<div class="flex justify-between border-b pb-2">
						<span>Auteur(s)</span>
						<span class="font-bold text-green-500"
							>{allUsersCount.roles.author < 0 ? '0' : allUsersCount.roles.author}</span
						>
					</div>
					<div class="flex justify-between border-b pb-2">
						<span>Expert(s)</span>
						<span class="font-bold text-green-500"
							>{allUsersCount.roles.expert < 0 ? '0' : allUsersCount.roles.expert}</span
						>
					</div>
					<div class="flex justify-between border-b pb-2">
						<span>Modérateur(s)</span>
						<span class="font-bold text-yellow-500"
							>{allUsersCount.roles.moderator < 0 ? '0' : allUsersCount.roles.moderator}</span
						>
					</div>
					<div class="flex justify-between border-b pb-2">
						<span>Admin</span>
						<span class="font-bold text-red-500"
							>{allUsersCount.roles.admin < 0 ? '0' : allUsersCount.roles.admin}</span
						>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
