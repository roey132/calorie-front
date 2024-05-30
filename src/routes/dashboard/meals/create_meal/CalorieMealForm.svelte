<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	let calories: number;
	let date: string;
	let name: string;
	let note: string;
	let createButtonDisabled = false;

	let missing_fields = false;
	async function create_calorie_meal() {
		createButtonDisabled = true;

		if (date == null || calories == null) {
			missing_fields = true;
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
				meal_name: name,
				meal_note: note
			})
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
	onMount(() => {
		let picker = document.getElementById('datePicker') as HTMLInputElement;
		if (picker != null && picker instanceof HTMLInputElement) {
			let today = new Date();
			date = today.toISOString().split('T')[0];
			picker.valueAsDate = today;
		}
	});

	$: console.log(date);
</script>

<br />
{#if missing_fields}
	<div>make sure to fill calories and date</div>
{/if}
<input bind:value={calories} type="number" placeholder="enter calorie count" /><br />
<input bind:value={date} id="datePicker" type="date" /><br />
<input bind:value={name} type="text" placeholder="enter meal name (Optional)" /><br />
<input bind:value={note} type="text" placeholder="enter meal note (Optional)" /><br />

<button disabled={createButtonDisabled} on:click={create_calorie_meal} id="create_meal_button"
	>create meal</button
>
