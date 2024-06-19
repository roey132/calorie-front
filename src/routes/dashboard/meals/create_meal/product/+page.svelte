<script lang="ts">
	import { goto } from '$app/navigation';
	import { loadSystemProducts, loadUserProducts } from '$lib/productsUtils';
	import { onMount } from 'svelte';

	let allProducts = {};
	let orderedProducts = [];

	onMount(async () => {
		let systemProducts = loadSystemProducts();
		let userProducts = loadUserProducts();

		allProducts = { ...userProducts, ...systemProducts };
	});
</script>

{#each orderedProducts as productId}
	<br />
	<button
		on:click={() => {
			goto(`product/${productId}`);
		}}>{allProducts[productId]['product_name']}</button
	>
{/each}
