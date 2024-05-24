import { goto } from '$app/navigation';
import { user_id } from '../stores.js';
import { redirect } from '@sveltejs/kit';

console.log("test")

let test = "test"
user_id.subscribe((/** @type {string} */ val) => test = val)

/** @type {import('@sveltejs/kit').Load} */
export async function load() {
  // Replace this with your actual authentication check
  console.log("")
  console.log(test)
  
  if (test === "") {
    console.log("check works")
    //Redirect to login page
    redirect(307, '/login');
  }
  }

