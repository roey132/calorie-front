<script>
	import { goto } from '$app/navigation';

	export let productName;
	export let productId;
	let showDelete = false;

	function gotoEditProduct() {
		//TODO
	}
	function deleteProduct() {
		//TODO
	}
</script>

<br />
<span>
	{productName}
</span>
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
<br />
