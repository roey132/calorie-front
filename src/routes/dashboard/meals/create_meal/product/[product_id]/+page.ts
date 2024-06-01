/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
	console.log(params.product_id);
	let productRes = await fetch(`/rust/api/products/product/get/${params.product_id}`);
	let measuresRes = await fetch(`/rust/api/measures/product/${params.product_id}`);

	let product = await productRes.json();
	let measures = await measuresRes.json();

	console.log('loaded products and measures');
	return { product: product, measures: measures };
}
