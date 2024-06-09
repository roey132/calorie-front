<script>
	import { goto } from '$app/navigation';
	goto('/dashboard/meals');
</script>

<div>dashboard</div>
<button on:click={() => goto('/dashboard/products')}>products</button>
<button on:click={() => goto('/dashboard/meals')}>meals</button>
