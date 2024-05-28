<script lang="ts">
	import { onMount } from 'svelte';
	import { authenticateUser } from '$lib/auth';
	import { goto } from '$app/navigation';

	let authenticated: Boolean = false;

	onMount(async () => {
		await authenticateUser()
			.then((value) => {
				if (value == true) {
					authenticated = true;
				}
			})
			.catch((error) => {
				console.log('Promise rejected with error:' + error);
			});
		console.log('authenticated is: ' + authenticated);
		if (!authenticated) {
			goto('/login');
		}
	});
</script>

{#if authenticated}
	<slot></slot>
{/if}
