<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	let measureId = $page.params.measure_id;
	let productId = $page.params.product_id;

	let measure = {};

	let measureName;
	let measureCalories;

	let buttonDisabled = false;
	let missingValues = false;

	onMount(async () => {
		let res = await fetch(`/rust/api/measures/measure/${measureId}`);

		if (!res.ok) {
			console.error(`Error: ${res.status} ${res.statusText}`);
			const errorText = await res.text();
			console.error(`Error response: ${errorText}`);
			return res.status;
		}
		let data = await res.json();
		measure = data.measure;
		measureName = measure['measure_name'];
		measureCalories = measure['measure_calories'];
	});

	async function editMeasure() {
		console.log(measureName);
		console.log(measureCalories);
		buttonDisabled = true;
		let res = await fetch('/rust/api/measures/measure/edit', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				measure_id: Number(measureId),
				measure_name: measureName,
				measure_calories: Number(measureCalories)
			})
		});
		if (!res.ok) {
			console.error(`Error: ${res.status} ${res.statusText}`);
			const errorText = await res.text();
			console.error(`Error response: ${errorText}`);
			buttonDisabled = false;
			return res.status;
		}
		goto(`/dashboard/products/edit/${productId}`);
	}
</script>

<div>editing: {measure['measure_name']}</div>
{#if missingValues}
	make sure to fill all fields
{/if}
<input bind:value={measureName} type="text" /><br />
<input bind:value={measureCalories} type="number" /><br />
<button disabled={buttonDisabled} on:click={editMeasure}>edit</button>
