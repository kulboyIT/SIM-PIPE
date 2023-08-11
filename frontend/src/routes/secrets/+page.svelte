<script lang="ts">
	import { Modal, modalStore, ProgressBar } from '@skeletonlabs/skeleton';
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';
	import ModalSubmitNewSecret from './modal-submit-new-secret.svelte';
	import allCredentialsQuery from '../../queries/get_all_credentials.js';
	import deleteCredentialMutation from '../../queries/delete_credential.js';
	import type { DockerRegistryCredential } from '../../types.js';
	import { credentialsList } from '../../stores/stores.js';
	import { requestGraphQLClient } from '$lib/graphqlUtils';

	const modalComponent: ModalComponent = {
		ref: ModalSubmitNewSecret
	};

	const modal: ModalSettings = {
		type: 'component',
		component: modalComponent,
		title: 'Add new secret',
		body: 'Provide a name and username for the new secret at given host.\nSecret will be automatically generated.'
	};

	const getCredentialsList = async (): Promise<DockerRegistryCredential[]> => {
		const response: { dockerRegistryCredentials: DockerRegistryCredential[] } =
			await requestGraphQLClient(allCredentialsQuery);
		return response.dockerRegistryCredentials;
	};

	const credentialsPromise = getCredentialsList();
	let checkboxes: Record<string, boolean> = {};

	// TODO: why do credentials not have an id? That is quite stupid!
	credentialsPromise
		.then((value) => {
			$credentialsList = value;
			reactiveCredentialsList = value;
			$credentialsList.forEach((element) => {
				checkboxes[element.name] = false;
			});
		})
		.catch(() => {
			$credentialsList = undefined;
		});

	async function onDeleteSelected() {
		Object.keys(checkboxes)
			.filter((item) => checkboxes[item])
			.forEach(async (element) => {
				const variables = {
					name: element
				};
				const response = await requestGraphQLClient(deleteCredentialMutation, variables);
			});
		// reset checkboxes
		$credentialsList?.forEach((element) => {
			checkboxes[element.name] = false;
		});
		const newcredentialsPromise: { dockerRegistryCredentials: DockerRegistryCredential[] } =
			await requestGraphQLClient(allCredentialsQuery);
		// Update credentialsList
		credentialsList.set(newcredentialsPromise.dockerRegistryCredentials);
		reactiveCredentialsList = $credentialsList;
	}

	// to disable onclick propogation for checkbox input
	const handleCheckboxClick = (event: any) => {
		event.stopPropagation();
	};

	$: reactiveCredentialsList = $credentialsList;
</script>

<!-- Page Header -->
<div class="container p-5">
	<h1>Secrets</h1>
	{#await credentialsPromise}
		<p style="font-size:20px;">Loading credentials...</p>
		<ProgressBar />
	{:then credentialsList}
		<div class="flex flex-row justify-end p-5 space-x-1">
			<div>
				<button
					type="button"
					class="btn btn-sm variant-filled"
					on:click={() => modalStore.trigger(modal)}
				>
					<span>Create</span>
				</button>
			</div>
			<div>
				<button
					type="button"
					class="btn btn-sm variant-filled-warning"
					on:click={() => onDeleteSelected()}
				>
					<span>Delete</span>
				</button>
			</div>
		</div>

		<div class="table-container">
			<table class="table table-interactive">
				<caption hidden>Secrets</caption>
				<thead>
					<tr>
						<th />
						<th>Name</th>
						<th>Username</th>
						<th>Server</th>
					</tr>
				</thead>
				<tbody>
					{#each reactiveCredentialsList || [] as secret}
						<tr id="clickable_row">
							<td style="width:10px">
								<input
									type="checkbox"
									class="checkbox"
									bind:checked={checkboxes[secret.name]}
									on:click={(event) => handleCheckboxClick(event)}
								/>
							</td>
							<td style="width:60%">{secret.name}</td>
							<td style="width:20%">{secret.username}</td>
							<td style="width:20%">{secret.server}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/await}
</div>

<Modal />

<style>
	.table.table {
		max-height: 80vh;
		overflow-y: auto;
		overflow-x: scroll;
		display: block;
		border-collapse: collapse;
		margin-left: auto;
		margin-right: auto;
		table-layout: auto;
		width: 100%;
	}
	thead {
		position: sticky;
		top: 0;
	}
</style>