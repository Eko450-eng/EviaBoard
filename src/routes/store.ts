import { writable, type Writable } from 'svelte/store'
import { authenticate, db, getDb, type user } from "@/db";
import Surreal, { RecordId } from 'surrealdb';

// Userdata
const initData: user = {
  email: "",
  id: new RecordId("user", "tada"),
  name: "",
  password: "",
  role: "",
};

export const userData: Writable<user> = writable(initData)
export const isLoggedIn = writable(false)

export function checkInitialLoggedIn() {
  let token = localStorage.getItem("user_token");
  if (token != "" || token != undefined || token != null) {
    return true
  } else {
    return false
  }
}

export async function checkLoggedIn(): Promise<Surreal | undefined> {
  let token = localStorage.getItem("user_token");
  await getDb();
  if (db && token) {
    authenticate(token).then(() => {
      checkIsLoggedIn(true);
    });
  } else {
    checkIsLoggedIn(false);
  }
  return db;
}

export function checkIsLoggedIn(state: boolean) {
  isLoggedIn.set(state)
}
