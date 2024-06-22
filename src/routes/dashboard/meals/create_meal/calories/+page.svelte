<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { selectedDate } from '$lib/stores';

	let calories: number;
	let date: string;
	let name: string;
	let createButtonDisabled = false;

	let missingFields = false;
	async function create_calorie_meal() {
		createButtonDisabled = true;

		if (date == null || calories == null) {
			missingFields = true;
			createButtonDisabled = false;
			return;
		}
		let res = await fetch('/rust/api/meals/meal/create/calories', {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				calories: calories,
				meal_date: date,
				meal_name: name
			})
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
	onMount(() => {
		selectedDate.subscribe((value) => {
			date = value;
		});
	});

	$: console.log(date);
</script>

<br />
{#if missingFields}
	<div>make sure to fill calories and date</div>
{/if}
<input bind:value={calories} type="number" placeholder="enter calorie count" /><br />
<input bind:value={date} id="datePicker" type="date" /><br />
<input bind:value={name} type="text" placeholder="enter meal name (Optional)" /><br />

<button disabled={createButtonDisabled} on:click={create_calorie_meal} id="create_meal_button"
	>create meal</button
>
