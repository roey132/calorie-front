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
	import ListedMeasure from './ListedMeasure.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	let product = data.product['product'];
	let calories100gram = product['calories_per_gram'] * 100;
	let protein100gram = product['protein_per_gram']
		? product['protein_per_gram'] * 100
		: product['protein_per_gram'];
	let carbs100gram = product['carbs_per_gram']
		? product['carbs_per_gram'] * 100
		: product['carbs_per_gram'];
	let fats100gram = product['fats_per_gram']
		? product['fats_per_gram'] * 100
		: product['fats_per_gram'];
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
				calories_per_100g: Number(calories100gram),
				protein_per_100g: protein100gram ? Number(protein100gram) : protein100gram,
				carbs_per_100g: carbs100gram ? Number(carbs100gram) : carbs100gram,
				fats_per_100g: fats100gram ? Number(fats100gram) : fats100gram
			})
		});
	}
	function createNewMeasure() {
		goto(`${product['product_id']}/measure/create`);
	}
	function onMeasureDelete(measureId) {
		delete measures[measureId.detail];
		// updates the measures for each
		measures = measures;
	}
</script>

<div>editing {product['product_name']}</div>
<input bind:value={productName} type="text" /><br />
<input bind:value={calories100gram} type="text" /><br />
<input bind:value={protein100gram} type="number" placeholder="protein per 100 gram (optional)" /><br
/>
<input bind:value={carbs100gram} type="number" placeholder="carbs per 100 gram (optional)" /><br />
<input bind:value={fats100gram} type="number" placeholder="fats per 100 gram (optional)" /><br />
<button on:click={editProduct}>edit</button>
<br /><br />
<span>product measures:</span>
<button on:click={createNewMeasure}>create new measure</button>
<br />
{#each Object.keys(measures) as measureId (measureId)}
	<ListedMeasure
		measureId={measures[measureId]['measure_id']}
		measureName={measures[measureId]['measure_name']}
		productId={product['product_id']}
		on:deleteMeasure={onMeasureDelete}
	></ListedMeasure>
{/each}
