import { goto } from "$app/navigation";
import { env } from "$env/dynamic/public";
import { RecordId, Surreal } from "surrealdb";

let HOST = env.PUBLIC_DB_HOST;
let NS = env.PUBLIC_DB_NS;
let DB = env.PUBLIC_DB_DB;

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
export let user_token: string | undefined | null;
export let user: user[] | undefined;
export let user_id_raw: string | undefined | null;
export let user_id: string | undefined | null;

export function getToken() {
  user_token = localStorage.getItem("user_token");
}

export async function initDb(): Promise<Surreal | undefined> {
  if (db) return db;
  db = new Surreal();

  let token = localStorage.getItem("user_token");
  if (token) {
    user_token = token;
  }

  try {
    await db.connect(HOST);
    await db.use({
      namespace: NS,
      database: DB,
    });
    if (token) db.authenticate(token);
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
  }).then(() => {
    db?.authenticate(token)
  })
}

export async function getDb(): Promise<Surreal | undefined> {
  if (!db || !user_token) await initDb();
  if (!user_token) return;
  if (!db) return;
  try {
    await db.connect(env.PUBLIC_DB_HOST, {
      namespace: NS,
      database: DB,
      auth: user_token
    })
    user = await db.query<user[]>("$auth");
    user_id_raw = `${user![0].id}`;
    user_id = `user:${user![0].id}`;
  } catch (e) {
    goto("/login")
    return
  }
  return db;
}

export function checkSession() {
  if (localStorage.getItem("user_token") !== "" && localStorage.getItem("user_token") !== null) {
    user_token = localStorage.getItem("user_token")!;
  }
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
  goto("/")
}
