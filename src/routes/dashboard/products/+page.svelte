<script>
	import { onMount } from 'svelte';
	import ListedProduct from './ListedProduct.svelte';
	import { goto } from '$app/navigation';
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
	let showSystem = false;

	onMount(async () => {
		let userProducts = await loadUserProducts();
		let systemProducts = await loadSystemProducts();
		console.log(systemProducts);

		allProducts = { ...systemProducts, ...userProducts };
		sortedKeys = sortKeysByName(userProducts);
	});

	let query = '';

	const debouncedSearch = debounce(() => {
		onSystemChange();
	}, 200);

	function onSystemChange() {
		let filteredSystemProducts = filterSystemProducts(allProducts, showSystem);
		let filteredSearchedProducts = filterProductsSearch(filteredSystemProducts, query);
		sortedKeys = sortKeysByName(filteredSearchedProducts);
	}

	function handleInput(event) {
		query = event.target.value;
		debouncedSearch();
	}

	function removeProductFromList(eventObject) {
		let productId = eventObject.detail;

		sortedKeys = sortedKeys.filter((e) => e !== productId);

		delete allProducts[productId];
	}
</script>

<span>products</span>
<button
	on:click={() => {
		goto('products/create');
	}}>create new product</button
><br />
<input type="text" placeholder="Search..." on:input={handleInput} />
<input
	bind:checked={showSystem}
	on:change={onSystemChange}
	type="checkbox"
	name="systemProducts"
	id="systemProducts"
/>
<label for="systemProducts">Show system products</label>
{#each sortedKeys as productId (productId)}
	<ListedProduct
		{productId}
		productName={allProducts[productId]['product_name']}
		isSystem={allProducts[productId]['isSystem']}
		on:deleteProduct={removeProductFromList}
	/>
{/each}
