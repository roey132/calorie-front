<script>
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    onMount(() => {
		const isLoggedIn = localStorage.getItem("user_id")
        if (!isLoggedIn) {
        //Redirect to login page
        goto('/login');
  }
});
</script>
<div>this is the home page</div>