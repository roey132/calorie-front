<script>
	import { onMount } from 'svelte';
	import ListedProduct from './ListedProduct.svelte';
	import { goto } from '$app/navigation';
	import pkg from 'lodash';
	const { debounce } = pkg;

	let allProducts = {};
	let sortedKeys = [];
	let showSystem = false;

	onMount(async () => {
		let userProducts = await loadUserProducts();
		let systemProducts = await loadSystemProducts();
		console.log(systemProducts);

		allProducts = { ...systemProducts, ...userProducts };
		sortKeysByName(userProducts);
	});

	let query = '';

	const debouncedSearch = debounce(() => {
		onSystemChange();
	}, 200);

	function filterProductsSearch(products) {
		if (query === '') {
			return { ...products };
		}
		let filteredEntries = Object.entries(products).filter(([id, product]) =>
			validateStringSearch(product.product_name, query)
		);
		let filteredProducts = Object.fromEntries(filteredEntries);

		return filteredProducts;
	}

	function validateStringSearch(productName, searchValue) {
		let queryWords = searchValue.toLowerCase().split(' ');
		let nameWords = productName.toLowerCase().split(/[\s,]+/);

		return queryWords.every((word) => nameWords.some((nameWord) => nameWord.includes(word)));
	}

	async function loadUserProducts() {
		let res = await fetch('/rust/api/products/user');
		if (!res.ok) {
			console.error(`Error: ${res.status} ${res.statusText}`);
			const errorText = await res.text();
			console.error(`Error response: ${errorText}`);
			return res.status;
		}

		let userProducts = await res.json();

		for (let [key, value] of Object.entries(userProducts)) {
			userProducts[key]['isSystem'] = false;
		}
		return userProducts;
	}

	async function loadSystemProducts() {
		let res = await fetch('/rust/api/products/system');
		if (!res.ok) {
			console.error(`Error: ${res.status} ${res.statusText}`);
			const errorText = await res.text();
			console.error(`Error response: ${errorText}`);
			return res.status;
		}

		let systemProducts = await res.json();

		for (let [key, value] of Object.entries(systemProducts)) {
			systemProducts[key]['isSystem'] = true;
		}

		return systemProducts;
	}

	function sortKeysByName(objectToSort) {
		if (Object.keys(objectToSort).length === 0) {
			sortedKeys = [];
			return;
		}
		sortedKeys = Object.keys(objectToSort).sort((key1, key2) => {
			return objectToSort[key1].product_name.localeCompare(objectToSort[key2].product_name);
		});
	}

	function onSystemChange() {
		let filteredSystemProducts = filterSystemProducts(allProducts);
		let filteredSearchedProducts = filterProductsSearch(filteredSystemProducts);
		sortKeysByName(filteredSearchedProducts);
	}

	function filterSystemProducts(products) {
		if (showSystem) {
			return { ...allProducts };
		}
		let filteredProducts = Object.fromEntries(
			Object.entries(products).filter(([id, product]) => product.isSystem === false)
		);
		return filteredProducts;
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
