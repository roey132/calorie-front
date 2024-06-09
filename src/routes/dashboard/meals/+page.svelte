<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import ListedMeal from './ListedMeal.svelte';
	let data: any = {};
	onMount(async () => {
		let today = new Date().toISOString().split('T')[0];
		let res = await fetch(`/rust/api/meals/date/${today}`);
		if (!res.ok) {
			console.error(`Error: ${res.status} ${res.statusText}`);
			const errorText = await res.text();
			console.error(`Error response: ${errorText}`);
			return res.status;
		}
		data = await res.json();
		console.log(data);
	});

	function removeMealFromObject(mealId) {
		delete data[mealId.detail];
		data = data;
	}
</script>

<div>
	<button
		on:click={() => {
			goto('./meals/create_meal');
		}}>create meal</button
	> <br />
	{#each Object.keys(data) as key (key)}
		<ListedMeal mealObject={data[key]} on:deleteMeal={removeMealFromObject}></ListedMeal>
	{/each}
</div>
