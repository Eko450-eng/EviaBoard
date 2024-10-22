import { goto } from "$app/navigation";
import { env } from "$env/dynamic/public";
import { RecordId, Surreal } from "surrealdb";
import { DB, userData } from "../routes/store";

let HOST = env.PUBLIC_DB_HOST;
let NS = env.PUBLIC_DB_NS;
let DB_KEY = env.PUBLIC_DB_DB;
let guestpw = env.PUBLIC_DB_GUEST_PW;

export let db: Surreal | undefined;

export async function initDb(): Promise<Surreal | undefined> {
  if (db) {
    return db
  };

  db = new Surreal();

  try {
    await db.connect(HOST
      , {
        auth: {
          namespace: NS,
          database: DB_KEY,
          username: "eviaguest",
          password: guestpw
        }
      }
    );
    return db;
  } catch (err) {
    throw err;
  }
}

export async function closeDb(): Promise<void> {
  if (!db) return;
  await db.close();
  db = undefined;
}

export async function getDb(): Promise<Surreal | undefined> {
  return db;
}

export async function signIn(data: { username: string, email: string, pass: string, confirmPass: string }): Promise<boolean> {
  if (!db || !NS || !DB_KEY) return false;
  const token = await db.signin({
    namespace: NS,
    database: DB_KEY,
    access: "user",
    variables: {
      email: data.email,
      password: data.pass,
    },
  });
  if (token) {
    localStorage.setItem("user_token", token);
    DB.set(db)
    return true
  }
  return false
}

export async function signUp(data: { username: string, email: string, pass: string, confirmPass: string }) {
  if (data.pass !== data.confirmPass) {
    alert("Passwords don't match");
    return;
  }
  if (data.pass.length < 8) {
    alert("Password to short");
    return;
  }

  if (!db || !NS || !DB_KEY) return;

  const token = await db.signup({
    namespace: NS,
    database: DB_KEY,
    access: "user",
    variables: {
      user: data.username,
      email: data.email,
      password: data.pass,
    },
  });
  if (token) {
    localStorage.setItem("user_token", token);
    DB.set(db)
    goto("/")
  }
}

export async function signOut() {
  localStorage.clear();
  db?.invalidate()
  userData.set({
    email: "",
    id: new RecordId("user", "tada"),
    name: "",
    password: "",
    role: "",
  })
  goto("/")
}
