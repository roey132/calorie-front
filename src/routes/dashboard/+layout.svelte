<script lang="ts">
	import { onMount } from 'svelte';
	import { authenticateUser } from '$lib/auth';
	import { goto } from '$app/navigation';
	import { selectedDate } from '$lib/stores';

	let authenticated: Boolean = false;
	let currentDate = '';

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

		selectedDate.subscribe((value) => {
			currentDate = value;
		});

		if (currentDate === '') {
			let today = new Date();
			selectedDate.set(today.toISOString().split('T')[0]);
		}
	});
</script>

<button
	on:click={() => {
		goto('/dashboard/meals');
	}}>meals</button
><button
	on:click={() => {
		goto('/dashboard/products');
	}}>products</button
>
<br /><br />
{#if authenticated}
	<slot></slot>
{/if}
