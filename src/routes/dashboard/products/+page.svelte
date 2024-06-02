<script>
	import { onMount } from 'svelte';
	import ListedProduct from './ListedProduct.svelte';
	let products = {};
	let showSystem = false;
	onMount(async () => {
		let res = await fetch('/rust/api/products/user');
		if (!res.ok) {
			console.error(`Error: ${res.status} ${res.statusText}`);
			const errorText = await res.text();
			console.error(`Error response: ${errorText}`);
			return res.status;
		}

		products = await res.json();
		console.log(products);
	});
	$: {
		console.log(showSystem);
	}
</script>

<div>my products</div>
<input bind:checked={showSystem} type="checkbox" name="systemProducts" id="systemProducts" />
<label for="systemProducts">Show system products</label>

{#each Object.keys(products) as productId}
	<ListedProduct {productId} productName={products[productId]['product_name']} />
{/each}
