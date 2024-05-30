<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
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
</script>

<div>
	<button
		on:click={() => {
			goto('./meals/create_meal');
		}}>create meal</button
	> <br />
	{#each Object.keys(data) as key}
		<div style="border-width:1px;border-style: solid;">
			<div>{key}</div>
			<div>{data[key]['meal_type']}</div>
		</div>
	{/each}
</div>
