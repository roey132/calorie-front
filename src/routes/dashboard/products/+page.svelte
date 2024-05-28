<script lang="ts">
	import { onMount } from 'svelte';
	onMount(async () => {
		let res = await fetch('/rust/api/products/user', {});
		if (!res.ok) {
			// If the response is not OK, log the status and text
			console.error(`Error: ${res.status} ${res.statusText}`);
			const errorText = await res.text();
			console.error(`Error response: ${errorText}`);
			return res.status;
		}
		console.log(await res.json());
	});
</script>

<div>products</div>
