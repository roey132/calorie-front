<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    onMount(async() => {
        const userId = sessionStorage.getItem("user_id");
        if (!userId) {
            goto("/login")
        }
        
    })
</script>
<slot></slot>