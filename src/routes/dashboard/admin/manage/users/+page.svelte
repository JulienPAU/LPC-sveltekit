<!-- src/routes/dashboard/admin/manage/users/+page.svelte -->

<script lang="ts">
	import SectionTitle from '$lib/components/SectionTitle.svelte';
	import { formatDate } from '$lib/utils.js';

	export let data;

	let { allUsers } = data;

	const users = allUsers.users;
</script>

{#if users}
	<SectionTitle title="Gestion des utilisateurs" />
	<div class="mb-10 flex w-full flex-wrap justify-center gap-4">
		{#each users as user}
			<div
				class="tranform card my-2 flex w-5/6 bg-slate-300 p-4 font-semibold shadow-lg transition duration-500 hover:scale-105 md:w-2/6 lg:w-1/5"
			>
				<div>id : {user.id}</div>
				<div>Username : <span class="font-bold">{user.username}</span></div>
				<div>Prénom : {user.first_name ? user.first_name : 'Non renseigné'}</div>
				<div>Nom : {user.last_name ? user.last_name : 'Non reseigné'}</div>
				<div>Email : {user.email}</div>
				<div>Role : {user.User_Role[0].role.toLowerCase()}</div>
				<div>Last Log : {formatDate(user.lastLogin)}</div>

				<div class="card-actions justify-end">
					<a
						href={`/dashboard/admin/manage/users/${user.id}/edit`}
						class="before:content[''] before:absolute before:inset-0"
						aria-label="Lire l'article"
					>
					</a>
				</div>
			</div>
		{/each}
	</div>
{:else}
	<div>Aucun utilisateur trouvé</div>
{/if}
