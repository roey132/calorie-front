<script lang="ts">
	import { goto } from '$app/navigation';
	import { authenticateUser } from '$lib/auth';
	import { onMount } from 'svelte';

	export let nameInput: string = '';
	export let passwordInput: string = '';
	let loginMessage = 'Enter your username and password';

	async function attempt_login() {
		const res = await fetch('/rust/api/users/login', {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				username: nameInput,
				password: passwordInput
			})
		});
		if (!res.ok) {
			// If the response is not OK, log the status and text
			console.error(`Error: ${res.status} ${res.statusText}`);
			const errorText = await res.text();
			console.error(`Error response: ${errorText}`);
			loginMessage = 'Failed to login, please try again..';
			return;
		}

		const data = await res.json();
		let uuid = data['UUID'];
		loginMessage = 'Successfully logged in!';

		var expirationDate = new Date();
		expirationDate.setFullYear(expirationDate.getFullYear() + 2);
		document.cookie =
			'user_id=' + uuid + '; path=/; SameSite=none; expires=' + expirationDate.toUTCString();

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
	<div>{loginMessage}</div>
	<input bind:value={nameInput} placeholder="enter your name" /><br />
	<input bind:value={passwordInput} placeholder="enter your password" /><br />
	<button on:click={attempt_login}>login</button>
</div>
