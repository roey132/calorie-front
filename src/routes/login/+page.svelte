<script lang="ts">
	import { goto } from '$app/navigation';
	import { authenticateUser } from '$lib/auth';
	import { onMount } from 'svelte';

	export let name_input: string = '';
	export let password_input: string = '';
	let login_message = 'Enter your username and password';

	async function attempt_login() {
		const res = await fetch('/rust/api/users/login', {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				username: name_input,
				password: password_input
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
		let uuid = data['UUID'];
		login_message = 'Successfully logged in!';

		var expiration_date = new Date();
		expiration_date.setFullYear(expiration_date.getFullYear() + 2);
		document.cookie =
			'user_id=' + uuid + '; path=/; SameSite=none; expires=' + expiration_date.toUTCString();

		goto('/dashboard');
	}

	onMount(async () => {
		let authenticated: boolean = false;
		await authenticateUser()
			.then((value) => {
				if (value == true) {
					authenticated = true;
				}
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
