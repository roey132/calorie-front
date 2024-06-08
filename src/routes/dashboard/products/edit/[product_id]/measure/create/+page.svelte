<script lang="ts">
	let measureName: string;
	let measureCalories: number;

	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let product = {};
	let buttonDisabled = false;
	let missingValues = false;
	onMount(async () => {
		let res = await fetch(`/rust/api/products/product/get/${$page.params.product_id}`);
		let data = await res.json();
		product = data['product'];
	});

	async function onCreateMeasure() {
		buttonDisabled = true;
		if (measureName == null || measureCalories == null) {
			missingValues = true;
			buttonDisabled = false;
			return;
		}
		let res = await fetch(`/rust/api/measures/measure/create`, {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				product_id: product['product_id'],
				measure_name: measureName,
				measure_calories: Number(measureCalories)
			})
		});
		if (!res.ok) {
			buttonDisabled = false;
			console.error(`Error: ${res.status} ${res.statusText}`);
			const errorText = await res.text();
			console.error(`Error response: ${errorText}`);
			return res.status;
		}
		goto(`/dashboard/products/edit/${product['product_id']}`);
	}
</script>

<div>creating measure for: {product['product_name']}</div>
{#if missingValues}
	<div>make sure to input all required values</div>
{/if}
<input bind:value={measureName} type="text" placeholder="enter measure name" />
<br />
<input bind:value={measureCalories} type="number" placeholder="enter measure calories" />
<br />
<button disabled={buttonDisabled} on:click={onCreateMeasure}>create measure</button>
