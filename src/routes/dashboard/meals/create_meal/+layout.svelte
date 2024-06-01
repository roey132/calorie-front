<script lang="ts">
	import { goto } from '$app/navigation';

	let types = ['Calories', 'Product'];

	export function mealSent() {
		goto('/home');
	}
</script>

<div>select meal type</div>
{#each types as type}
	<button
		on:click={() => {
			goto(`/dashboard/meals/create_meal/${type.toLowerCase()}`);
		}}>{type}</button
	>
{/each}

<slot></slot>
