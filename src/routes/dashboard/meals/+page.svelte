<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { selectedDate } from '$lib/stores.js';

	import ListedMeal from './ListedMeal.svelte';

	let data: any = {};
	let today = new Date();
	let currDate = today.toISOString().split('T')[0];
	let totalCalories = 0;
	selectedDate.set(currDate);

	onMount(async () => {
		let today = new Date().toISOString().split('T')[0];
		await getMealsData(today);
	});

	function removeMealFromObject(mealId) {
		delete data[mealId.detail];
		data = data;
	}
	let nextDateButtonDisalbed = true;
	let backDateButtonDisalbed = false;

	$: {
		currDate = currDate;

		nextDateButtonDisalbed = currDate === today.toISOString().split('T')[0];

		let minDate = new Date();
		minDate.setDate(today.getDate() - 7);
		backDateButtonDisalbed = currDate === minDate.toISOString().split('T')[0];
	}

	function changeDate(diff) {
		let date = new Date(currDate);
		date.setDate(date.getDate() + diff);
		currDate = date.toISOString().split('T')[0];
		selectedDate.set(currDate);
	}

	async function getMealsData(date) {
		let res = await fetch(`/rust/api/meals/date/${date}`);
		if (!res.ok) {
			console.error(`Error: ${res.status} ${res.statusText}`);
			const errorText = await res.text();
			console.error(`Error response: ${errorText}`);
			return res.status;
		}
		data = await res.json();
	}

	$: {
		data = data;
		totalCalories = 0;
		if (Object.keys(data).length > 0) {
			let keys = Object.keys(data);
			for (let key of keys) {
				totalCalories += data[key]['calc_calories'];
			}
		}
	}

	$: {
		currDate = currDate;
		getMealsData(currDate);
	}
</script>

<div>
	<button
		on:click={() => {
			goto('./meals/create_meal');
		}}>create meal</button
	> <br />
	<button
		on:click={() => {
			changeDate(-1);
		}}
		disabled={backDateButtonDisalbed}>&lt;</button
	>
	<span>Selected Date: {currDate}</span>
	<button
		on:click={() => {
			changeDate(1);
		}}
		disabled={nextDateButtonDisalbed}>&gt;</button
	>
	<br /><span> Total Calories: {totalCalories}</span><br />
	{#if Object.keys(data).length === 0}
		<div>No meals found for that day</div>
	{/if}

	{#each Object.keys(data) as key (key)}
		<ListedMeal mealObject={data[key]} on:deleteMeal={removeMealFromObject}></ListedMeal>
	{/each}
</div>
