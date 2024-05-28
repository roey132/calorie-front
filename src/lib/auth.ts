export async function authenticateUser() {
	const res = await fetch('/rust/api/users/profile');
	if (!res.ok) {
		// If the response is not OK, log the status and text
		console.error(`Error: ${res.status} ${res.statusText}`);
		const errorText = await res.text();
		console.error(`Error response: ${errorText}`);
		return res.status;
	}
	return true;
}
