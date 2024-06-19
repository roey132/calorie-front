<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import pkg from 'lodash';
	import {
		loadSystemProducts,
		loadUserProducts,
		sortKeysByName,
		filterSystemProducts,
		filterProductsSearch
	} from '$lib/productsUtils';
	const { debounce } = pkg;
	let allProducts = {};
	let sortedKeys = [];
	let showSystem;
	let query = '';

	onMount(async () => {
		let systemProducts = await loadSystemProducts();
		let userProducts = await loadUserProducts();

		allProducts = { ...userProducts, ...systemProducts };
		sortedKeys = sortKeysByName(userProducts);
	});

	const debouncedSearch = debounce(() => {
		onSystemChange();
	}, 200);

	function handleInput() {
		debouncedSearch();
	}

	function onSystemChange() {
		let filteredSystemProducts = filterSystemProducts(allProducts, showSystem);
		let filteredSearchedProducts = filterProductsSearch(filteredSystemProducts, query);
		sortedKeys = sortKeysByName(filteredSearchedProducts);
	}
</script>

<input bind:value={query} type="text" placeholder="Search..." on:input={handleInput} />
<br />
<input
	bind:checked={showSystem}
	on:change={onSystemChange}
	type="checkbox"
	name="systemProducts"
	id="systemProducts"
/>
<label for="systemProducts">Show system products</label>
<br />
{#each sortedKeys as productId}
	<br />
	<button
		on:click={() => {
			goto(`product/${productId}`);
		}}>{allProducts[productId]['product_name']}</button
	>
{/each}
