import { writable, type Writable } from 'svelte/store'
import { db, type user } from "@/db";
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
  if (token) {
    db?.authenticate(token)
      .then(async () => {
        db?.authenticate(token)
        let user = await db?.query<Array<Array<user>>>("SELECT * FROM user WHERE id = $auth.id");
        if (!user) return
        let u = user[0][0]
        userData.set(u)
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
