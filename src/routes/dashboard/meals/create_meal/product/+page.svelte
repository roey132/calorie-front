<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let products: any = {};
	onMount(async () => {
		let res = await fetch('/rust/api/products/user');
		if (!res.ok) {
			console.error(`Error: ${res.status} ${res.statusText}`);
			const errorText = await res.text();
			console.error(`Error response: ${errorText}`);
			return res.status;
		}
		products = await res.json();
	});
</script>

{#each Object.keys(products) as productId}
	<br />
	<button
		on:click={() => {
			goto(`product/${productId}`);
		}}>{products[productId]['product_name']}</button
	>
{/each}
