<script lang="ts">

    export let name_input = ''
    export let password_input  = ''

    async function test() {
    const res = await fetch('http://127.0.0.1:8080/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            password:password_input,
            username:name_input,
        })
    })
        if (!res.ok) {
                // If the response is not OK, log the status and text
                console.error(`Error: ${res.status} ${res.statusText}`);
                const errorText = await res.text();
                console.error(`Error response: ${errorText}`);
                return;
            }

        const data = await res.json()
	    console.log(data);
    }

</script>

<input bind:value={name_input} placeholder="enter your name" />
<input bind:value={password_input} placeholder="enter your password" />
<button on:click={test}>test</button>