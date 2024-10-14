import { writable } from 'svelte/store'
import { user } from "@/db";


// Userdata
const initData: user | null = null;

export const userData = writable(initData)
export const isLoggedIn = writable(false)

export function checkInitialLoggedIn() {
  let token = localStorage.getItem("user_token");
  if (token != "" || token != undefined || token != null) {
    return true
  } else {
    return false
  }
}

export function checkIsLoggedIn(state: boolean) {
  isLoggedIn.set(state)
}
