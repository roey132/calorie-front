<script lang="ts">
	import { goto } from '$app/navigation';
	import { authenticateUser } from '$lib/auth';
	import { onMount } from 'svelte';

	export let name_input = '';
	export let password_input = '';
	let uuid = '';
	let login_message = 'Enter your username and password';
	async function attempt_login() {
		const res = await fetch('http://127.0.0.1:8080/api/users/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				password: password_input,
				username: name_input
			})
		});
		if (!res.ok) {
			// If the response is not OK, log the status and text
			console.error(`Error: ${res.status} ${res.statusText}`);
			const errorText = await res.text();
			console.error(`Error response: ${errorText}`);
			login_message = 'Failed to login, please try again..';
			return;
		}

		const data = await res.json();
		console.log(data);
		uuid = data['UUID'];
		login_message = 'Successfully logged in!';
		sessionStorage.setItem('user_id', uuid);
		goto('/dashboard');
	}
	onMount(async () => {
		let authenticated: boolean = false;
		await authenticateUser()
			.then((value) => {
				authenticated = true;
			})
			.catch((error) => {
				console.log('Promise rejected with error:' + error);
			});
		console.log('authenticated is:' + authenticated);
		if (authenticated) {
			goto('/dashboard');
		}
	});
</script>

<div>
	<div>{login_message}</div>
	<input bind:value={name_input} placeholder="enter your name" /><br />
	<input bind:value={password_input} placeholder="enter your password" /><br />
	<button on:click={attempt_login}>login</button>
</div>
