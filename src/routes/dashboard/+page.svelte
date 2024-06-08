<script>
	import { goto } from '$app/navigation';
</script>

<div>dashboard</div>
<button on:click={() => goto('/dashboard/products')}>products</button>
<button on:click={() => goto('/dashboard/meals')}>meals</button>
