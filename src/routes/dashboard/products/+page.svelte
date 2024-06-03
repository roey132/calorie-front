<script>
	import { onMount } from 'svelte';
	import ListedProduct from './ListedProduct.svelte';

	let userProducts = {};
	let systemProducts = {};
	let allProducts = {};
	let sortedKeys = [];
	let showSystem = false;

	onMount(async () => {
		await loadUserProducts();
		await loadSystemProducts();

		allProducts = { ...systemProducts, ...userProducts };
		console.log(allProducts);

		setSortedKeys(userProducts);

		console.log(sortedKeys);
	});

	async function loadUserProducts() {
		let res = await fetch('/rust/api/products/user');
		if (!res.ok) {
			console.error(`Error: ${res.status} ${res.statusText}`);
			const errorText = await res.text();
			console.error(`Error response: ${errorText}`);
			return res.status;
		}

		userProducts = await res.json();

		for (let [key, value] of Object.entries(userProducts)) {
			userProducts[key]['isSystem'] = false;
		}
		console.log(userProducts);
	}

	async function loadSystemProducts() {
		let res = await fetch('/rust/api/products/system');
		if (!res.ok) {
			console.error(`Error: ${res.status} ${res.statusText}`);
			const errorText = await res.text();
			console.error(`Error response: ${errorText}`);
			return res.status;
		}

		systemProducts = await res.json();

		for (let [key, value] of Object.entries(systemProducts)) {
			systemProducts[key]['isSystem'] = true;
		}

		console.log(systemProducts);
	}

	function setSortedKeys(objectToSort) {
		if (Object.keys(objectToSort).length === 0) {
			return;
		}

		sortedKeys = Object.keys(objectToSort).sort((key1, key2) => {
			return objectToSort[key1].product_name.localeCompare(objectToSort[key2].product_name);
		});
	}

	function onSystemChange() {
		console.log(showSystem);
		if (!showSystem) {
			setSortedKeys(allProducts);
			return;
		}
		setSortedKeys(userProducts);
	}
</script>

<div>products</div>
<input
	on:change={onSystemChange}
	bind:checked={showSystem}
	type="checkbox"
	name="systemProducts"
	id="systemProducts"
/>
<label for="systemProducts">Show system products</label>

{#each sortedKeys as productId}
	<ListedProduct
		{productId}
		productName={allProducts[productId]['product_name']}
		isSystem={allProducts[productId]['isSystem']}
	/>
{/each}
