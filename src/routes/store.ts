import { writable } from 'svelte/store'
import { user } from "@/db";


// Userdata
const initData: user | null = null;

export const userData = writable(initData)
export const isLoggedIn = writable(false)

export function checkIsLoggedIn(state: boolean) {
  isLoggedIn.set(state)
}

// Alerts
export type Alert = {
  active: boolean;
  type: "destructive" | "default" | undefined;
  title: string;
  message: string;
};

let alert: Alert = {
  active: false,
  type: "destructive",
  title: "test",
  message: "Test",
};


export const alertData = writable(alert)

export function toast(data: Alert) {
  console.log("Ran", data)
  alertData.set(data)

  setTimeout(() => {
    alertData.set(alert)
  }, 5000)
}

