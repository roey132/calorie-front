<script>
	import { goto } from '$app/navigation';
	import { createEventDispatcher, onMount } from 'svelte';

	export let measureName;
	export let measureId;
	export let productId;

	let showDelete = false;

	let dispatch = createEventDispatcher();

	async function deleteMeasure() {
		let res = await fetch(`/rust/api/measures/measure/delete/${measureId}`);
		if (!res.ok) {
			console.error(`Error: ${res.status} ${res.statusText}`);
			const errorText = await res.text();
			console.error(`Error response: ${errorText}`);
			return res.status;
		}
		dispatch('deleteMeasure', measureId);
	}
</script>

<span>{measureName}</span>
<button
	on:click={() => {
		goto(`${productId}/measure/${measureId}/edit`);
	}}
>
	edit
</button>
<button
	on:click={() => {
		showDelete = true;
	}}>delete</button
>
{#if showDelete}
	<div>are you sure you want to delete the measure?</div>
	<button on:click={deleteMeasure}>yes</button>
	<button
		on:click={() => {
			showDelete = false;
		}}>no</button
	>
{/if}
<br />
