<script context="module">
	export async function load({ fetch, params }) {
		console.log(params.product_id);
		let productRes = await fetch(`/rust/api/products/product/get/${params.product_id}`);
		let measuresRes = await fetch(`/rust/api/measures/product/${params.product_id}`);

		let product = await productRes.json();
		let measures = await measuresRes.json();

		console.log('loaded product');
		return { product: product, measures: measures };
	}
</script>

<script lang="ts">
	import { goto } from '$app/navigation';
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
		goto(`${product['product_id']}/measure/create`);
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
