<script>
	import { goto } from '$app/navigation';
</script>

<div>dashboard</div>
<button on:click={() => goto('/dashboard/products')}>products</button>
