<script lang="ts">
	import CalorieMealForm from './CalorieMealForm.svelte';
	let types = ['Calories', 'Product', 'Measure'];
	let selected_type = '';

	export function meal_sent() {
		selected_type = '';
	}
</script>

<div>select meal type</div>
{#each types as type}
	<button
		on:click={() => {
			selected_type = type;
		}}>{type}</button
	>
{/each}

{#if selected_type === 'Calories'}
	<CalorieMealForm on:meal_sent={meal_sent} />
{/if}

{#if selected_type === 'Product'}
	<div>temp product placeholder</div>
{/if}

{#if selected_type === 'Measure'}
	<div>temp measure placeholder</div>
{/if}
