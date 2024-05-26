import { onMount } from 'svelte';
import { goto } from '$app/navigation';

export async function authenticateUser() {
	let userId = sessionStorage.getItem('user_id');
	if (!userId) {
		goto('/login');
	}
	let headers: { [key: string]: string } = {
		'Content-Type': 'application/json'
	};

	if (userId !== null) {
		headers['user_id'] = userId;
	}
	const res = await fetch('http://127.0.0.1:8080/api/users/profile', {
		method: 'GET',
		headers: headers
	});
	console.log(res);
	if (!res.ok) {
		// If the response is not OK, log the status and text
		console.error(`Error: ${res.status} ${res.statusText}`);
		const errorText = await res.text();
		console.error(`Error response: ${errorText}`);
		goto('/login');
	}
	return true;
}
