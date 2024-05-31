<script lang="ts">
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	let isProductSelected = false;
	let selectedProduct = {};
	let selectedProductMeasures = {};
	let selectedMeasureId: number;

	let countInput: number;
	let date: string;
	let name: string;
	let note: string;

	let createButtonDisabled = false;

	let missing_fields = false;

	let products: any = {};
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

	async function selectProduct(product_id) {
		selectedProduct = products[product_id];
		await getMeasures();
		isProductSelected = true;
		console.log(selectedProduct);
	}

	async function createMeal() {
		createButtonDisabled = true;
		if (countInput == null || date == null) {
			createButtonDisabled = false;
			missing_fields = true;
			return;
		}
		let mealType = '';
		let requestBody = {
			calories: countInput,
			meal_date: date,
			meal_name: name,
			meal_note: note
		};
		if (isMeasureSelected) {
			mealType = 'measure';
			requestBody['measure_id'] = selectedProductMeasures[selectedMeasureId]['measure_id'];
			requestBody['measure_count'] = countInput;
		} else {
			mealType = 'product';
			requestBody['product_id'] = selectedProduct['product_id'];
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
		dispatch('meal_sent');
	}

	async function getMeasures() {
		let res = await fetch(`/rust/api/measures/product/${selectedProduct['product_id']}`);
		if (!res.ok) {
			console.error(`Error: ${res.status} ${res.statusText}`);
			const errorText = await res.text();
			console.error(`Error response: ${errorText}`);
			return res.status;
		}

		selectedProductMeasures = await res.json();
		console.log(selectedProductMeasures);
	}

	let isMeasureSelected = false;

	let countInfoText = 'set product grams';
	function checkMeasureSelection() {
		isMeasureSelected = selectedMeasureId != null;
		if (isMeasureSelected) {
			countInfoText = 'set measure count';
		} else {
			countInfoText = 'set product grams';
		}
		console.log(selectedMeasureId);
	}
</script>

{#if isProductSelected}
	<br /><br />
	<div>
		<button
			on:click={() => {
				isProductSelected = false;
				isMeasureSelected = false;
				selectedMeasureId = null;
			}}>back</button
		>
		<span>&nbsp;{selectedProduct['product_name']}</span>
		<br />
		{#if missing_fields}
			<div>Make sure to fill all required fields</div>
		{/if}
		{#if Object.keys(selectedProductMeasures).length > 0}
			<span>measure: (Optional)</span>
			<select bind:value={selectedMeasureId} name="" id="" on:change={checkMeasureSelection}>
				<option value="">{''}</option>
				{#each Object.keys(selectedProductMeasures) as measureId}
					<option value={measureId}>{selectedProductMeasures[measureId]['measure_name']}</option>
				{/each}
			</select>
			<br />
		{/if}
		<input bind:value={countInput} type="number" placeholder={countInfoText} /><br />
		<input bind:value={date} id="datePicker" type="date" /><br />
		<input bind:value={name} type="text" placeholder="enter meal name (Optional)" /><br />
		<input bind:value={note} type="text" placeholder="enter meal note (Optional)" /><br />
	</div>
	<button disabled={createButtonDisabled} on:click={createMeal} id="create_meal_button"
		>create meal</button
	>
{/if}
{#if !isProductSelected}
	{#each Object.keys(products) as productId}
		<br />
		<button
			on:click={() => {
				selectProduct(productId);
			}}>{products[productId]['product_name']}</button
		>
	{/each}
{/if}
