import { writable } from 'svelte/store'
import { user } from "@/db";

const initData: user | null = null;

export const userData = writable(initData)
export const isLoggedIn = writable(false)

export function checkIsLoggedIn(state: boolean) {
  isLoggedIn.set(state)
}
