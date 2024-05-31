<script lang="ts">
	import CalorieMealForm from './CalorieMealForm.svelte';
	import ProductMealForm from './ProductMealForm.svelte';

	let types = ['Calories', 'Product'];
	let selectedType = '';

	export function meal_sent() {
		selectedType = '';
	}
</script>

<div>select meal type</div>
{#each types as type}
	<button
		on:click={() => {
			selectedType = type;
		}}>{type}</button
	>
{/each}

{#if selectedType === 'Calories'}
	<CalorieMealForm on:meal_sent={meal_sent} />
{/if}

{#if selectedType === 'Product'}
	<ProductMealForm on:meal_sent={meal_sent} />
{/if}
