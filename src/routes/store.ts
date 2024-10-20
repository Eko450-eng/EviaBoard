import { writable, type Writable } from 'svelte/store'
import { db, initDb, type user } from "@/db";
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
export const DB = writable(new Surreal)

export async function checkLoggedIn(): Promise<Surreal | undefined> {
  let db = await initDb()

  if (db) {
    DB.set(db)
  }

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
  if (db) {
    DB.set(db)
  }
  return db;
}

export function checkIsLoggedIn(state: boolean) {
  isLoggedIn.set(state)
}
