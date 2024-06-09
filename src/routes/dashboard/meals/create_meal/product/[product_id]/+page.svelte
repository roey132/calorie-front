<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let product: any = {};
	let measures: any = {};
	let missingFields = false;

	let countInput: number = null;
	let date: string;

	/** @type {import('./$types').PageData} */
	export let data;

	onMount(async () => {
		console.log(data);
		product = data.product['product'];
		measures = data.measures;

		let today = new Date();
		date = today.toISOString().split('T')[0];

		console.log(product);
		console.log(measures);
	});

	let selectedMeasureId = null;

	$: isMeasureSelected = selectedMeasureId !== null;
	$: countInfoText = isMeasureSelected ? 'set measure count' : 'set product grams';

	let createButtonDisabled = false;

	async function createMeal() {
		createButtonDisabled = true;
		if (countInput === null || date === null) {
			createButtonDisabled = false;
			missingFields = true;
			return;
		}
		let mealType;
		let requestBody = {
			calories: countInput,
			meal_date: date
		};
		if (isMeasureSelected) {
			mealType = 'measure';
			requestBody['measure_id'] = measures[selectedMeasureId]['measure_id'];
			requestBody['measure_count'] = countInput;
		} else {
			mealType = 'product';
			requestBody['product_id'] = product['product_id'];
			requestBody['product_grams'] = countInput;
		}
		let res = await fetch(`/rust/api/meals/meal/create/${mealType}`, {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify(requestBody)
		});
		if (!res.ok) {
			console.error(`Error: ${res.status} ${res.statusText}`);
			const errorText = await res.text();
			console.error(`Error response: ${errorText}`);
			createButtonDisabled = false;
			return res.status;
		}
		goto('/dashboard');
	}
</script>

<br /><br />
<div>
	<button
		on:click={() => {
			goto('./');
		}}>product selection</button
	>
	<span>&nbsp;{product['product_name']}</span>
	<br />
	{#if missingFields}
		<div>Make sure to fill all required fields</div>
	{/if}
	{#if Object.keys(measures).length > 0}
		<span>measure: (Optional)</span>
		<select bind:value={selectedMeasureId}>
			<option value={null}>{'no measure'}</option>
			{#each Object.keys(measures) as measureId}
				<option value={measureId}>{measures[measureId]['measure_name']}</option>
			{/each}
		</select>
		<br />
	{/if}

	<input bind:value={countInput} type="number" placeholder={countInfoText} /><br />
	<input bind:value={date} id="datePicker" type="date" /><br />
</div>
<button disabled={createButtonDisabled} on:click={createMeal} id="create_meal_button"
	>create meal</button
>
