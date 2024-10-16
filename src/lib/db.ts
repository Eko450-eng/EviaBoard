import { goto } from "$app/navigation";
import { env } from "$env/dynamic/public";
import { RecordId, Surreal } from "surrealdb";
import { userData } from "../routes/store";

let HOST = env.PUBLIC_DB_HOST;
let NS = env.PUBLIC_DB_NS;
let DB = env.PUBLIC_DB_DB;
let guestpw = env.PUBLIC_DB_GUEST_PW;

export type Report = {
  source?: string;
  id?: RecordId | string;
  title: string;
  body: string;
  status: number;
  category: number;
  upvotes: number;
  owner: any
};

export type post = {
  id?: RecordId;
  title: string;
  body: string;
  solution: string;
  owner: any;
  topic: string;
};

export type user = {
  email: string;
  id: RecordId;
  name: string;
  password: string;
  role: string;
};

export type topic = {
  id: RecordId;
  name: string;
};

export type Downloadlinks = {
  id: string;
  name: string;
  description: string;
  link: string;
  owner: { name: string; id: string };
};

export let db: Surreal | undefined;

export async function initDb(): Promise<Surreal | undefined> {
  if (db) return db;
  db = new Surreal();

  try {
    await db.connect(HOST, {
      auth: {
        namespace: NS,
        database: DB,
        username: "eviaguest",
        password: guestpw
      }
    });
    return db;
  } catch (err) {
    console.error("Failed to connect to SurrealDB:", err);
    throw err;
  }
}

export async function closeDb(): Promise<void> {
  if (!db) return;
  await db.close();
  db = undefined;
}

export async function authenticate(token: string) {
  db?.connect(HOST, {
    namespace: NS,
    database: DB,
  }).then(async () => {
    db?.authenticate(token)
    let user = await db?.query<Array<Array<user>>>("SELECT * FROM user WHERE id = $auth.id");
    if (!user) return
    let u = user[0][0]
    userData.set(u)
  })
}

export async function getDb(): Promise<Surreal | undefined> {
  return db;
}

export async function signIn(data: { username: string, email: string, pass: string, confirmPass: string }) {
  if (!db || !NS || !DB) return;
  const token = await db.signin({
    namespace: NS,
    database: DB,
    access: "user",
    variables: {
      email: data.email,
      password: data.pass,
    },
  });
  if (token) {
    localStorage.setItem("user_token", token);
    goto("/")
  }
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

  if (!db || !NS || !DB) return;

  const token = await db.signup({
    namespace: NS,
    database: DB,
    access: "user",
    variables: {
      user: data.username,
      email: data.email,
      password: data.pass,
    },
  });
  if (token) {
    localStorage.setItem("user_token", token);
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
