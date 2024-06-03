<script lang="ts">
	import { onMount } from 'svelte';

	/** @type {import('./$types').PageData} */
	export let data;
	let product = data.product['product'];
	let calories100gram = product['calories_per_gram'] * 100;
	let productName = product['product_name'];
	let measures = data.measures;

	onMount(() => {});

	async function editProduct() {
		let res = await fetch('/rust/api/products/user_product/edit', {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				product_name: productName,
				product_id: product['product_id'],
				calories_per_100g: Number(calories100gram)
			})
		});
	}
	function createNewMeasure() {
		//TODO
	}
</script>

<div>editing {product['product_name']}</div>
<input bind:value={productName} type="text" />
<input bind:value={calories100gram} type="text" />

<button on:click={editProduct}>edit</button>
<br /><br />
<span>product measures:</span>
<button on:click={createNewMeasure}>create new measure</button>
<br />
{#each Object.keys(measures) as measure_id}
	<div>{measures[measure_id]['measure_name']}</div>
{/each}
