<script lang="ts">
	import CalorieMealForm from './CalorieMealForm.svelte';
	let types = ['Calories', 'Product', 'Measure'];
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
	<div>temp product placeholder</div>
{/if}

{#if selectedType === 'Measure'}
	<div>temp measure placeholder</div>
{/if}
