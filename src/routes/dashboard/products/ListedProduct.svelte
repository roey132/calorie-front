<script>
	import { goto } from '$app/navigation';
	import { createEventDispatcher, onMount } from 'svelte';

	export let productName;
	export let productId;
	export let isSystem;

	let showDelete = false;
	let dispatch = createEventDispatcher();

	async function deleteProduct() {
		let res = await fetch(`/rust/api/products/product/delete/${productId}`);

		if (!res.ok) {
			console.error(`Error: ${res.status} ${res.statusText}`);
			const errorText = await res.text();
			console.error(`Error response: ${errorText}`);
			return res.status;
		}
		dispatch('deleteProduct', productId);
	}
</script>

<br />
<span>
	{productName}
</span>
{#if !isSystem}
	<button
		on:click={() => {
			goto(`products/edit/${productId}`);
		}}>edit product</button
	>
	<button on:click={() => (showDelete = true)}>delete product</button>

	{#if showDelete}
		<div>are you sure you want to delete {productName}</div>
		<div>this is not reversible!</div>
		<button on:click={deleteProduct}>yes</button>
		<button
			on:click={() => {
				showDelete = false;
			}}>no</button
		>
	{/if}
{/if}
<br />
