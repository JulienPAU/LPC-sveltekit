<script lang="ts">
	import SectionTitle from '$lib/components/SectionTitle.svelte';

	export let data;

	let { users } = data;

	// console.log('users role', users.User_Role[0].role);
</script>

{#if users}
	<SectionTitle title="Gestion des utilisateurs" />
	<div class="mb-10 flex w-full flex-wrap justify-center gap-2">
		{#each users as user}
			<div class="card my-2 w-5/6 border bg-gray-300 p-2 md:w-2/6 lg:w-1/6">
				<div>Username : {user.username}</div>
				<div>Prénom : {user.first_name ? user.first_name : 'Non renseigné'}</div>
				<div>Nom : {user.last_name ? user.last_name : 'Non reseigné'}</div>
				<div>Email : {user.email}</div>
				<div>Role : {user.User_Role[0].role.toLowerCase()}</div>

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
