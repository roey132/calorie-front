import { name, password } from './store.js';
let result = null

export async function _test() {
    const res = await fetch('http://127.0.0.1:8080/api/users/login', {
        method: 'POST',
        body: JSON.stringify({
            password:password,
            username:name,
        })
    })
    const data = await res.json()
	console.log(data);
}