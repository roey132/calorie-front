<script>
	import { goto } from '$app/navigation';

	let productName;
	let calories100gram;
	let missingFields = false;
	let buttonDisabled = false;

	async function createProduct() {
		buttonDisabled = true;
		if (productName === null || calories100gram === null || typeof calories100gram !== 'number') {
			missingFields = true;
			buttonDisabled = false;
			return;
		}

		let res = await fetch('/rust/api/products/user_product/create', {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				product_name: productName,
				calories_per_100g: Number(calories100gram)
			})
		});

		if (!res.ok) {
			console.error(`Error: ${res.status} ${res.statusText}`);
			const errorText = await res.text();
			console.error(`Error response: ${errorText}`);
			return res.status;
		}

		goto('/dashboard/products');
	}
</script>

<div>Create Product</div>
{#if missingFields}
	<div>make sure to fill all values correctly</div>
{/if}
<input bind:value={productName} type="text" placeholder="product name" />
<input bind:value={calories100gram} type="number" placeholder="calories per 100 gram" />
<br />
<button disabled={buttonDisabled} on:click={createProduct}>create product</button>
