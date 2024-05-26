<script lang="ts">
	import { onMount } from 'svelte';
	import { authenticateUser } from '$lib/auth';
	let authenticated: Boolean = false;
	onMount(async () => {
		authenticateUser()
			.then(() => {
				authenticated = true;
			})
			.catch((error) => {
				console.log('Promise rejected with error:' + error);
			});
	});
</script>

{#if authenticated}
	<slot></slot>
{/if}
