<script>
	import { goto } from '$app/navigation';
	import { createEventDispatcher, onMount } from 'svelte';
	let dispatch = createEventDispatcher();

	export let mealObject;

	let deletePressed = false;

	let mealType = mealObject['meal_type'];

	async function deleteMeal() {
		let res = await fetch(`/rust/api/meals/meal/delete/${mealObject['meal_id']}`);
		if (!res.ok) {
			console.error(`Error: ${res.status} ${res.statusText}`);
			const errorText = await res.text();
			console.error(`Error response: ${errorText}`);
			return res.status;
		}
		console.log(`dispatching meal_id ${mealObject['meal_id']}`);

		dispatch('deleteMeal', mealObject['meal_id']);
	}
</script>

<div style="border-width:1px;border-style: solid;">
	{#if mealType === 'Product'}
		<div>product: {mealObject['product_name']}</div>
	{/if}
	{#if mealType === 'Calories'}
		<div>calories meal</div>
	{/if}
	{#if mealType === 'Measure'}
		<div>measure meal</div>
	{/if}
	{#if mealObject['meal_name'] != null}
		<span>| {mealObject['meal_name']}</span>
	{/if}
	<div>total calories: {mealObject['calc_calories']}</div>
	<button
		on:click={() => {
			deletePressed = true;
		}}>delete meal</button
	>
	{#if deletePressed}
		<div>are you sure you want to delete the meal?</div>
		<button on:click={deleteMeal}>yes</button><button
			on:click={() => {
				deletePressed = false;
			}}>no</button
		>
	{/if}
</div>
