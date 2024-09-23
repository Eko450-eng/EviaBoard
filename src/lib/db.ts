import { env } from "$env/dynamic/public";
import { Surreal } from "surrealdb";

let NS = env.PUBLIC_DB_NS;
let DB = env.PUBLIC_DB_DB;
let ROOT_USER = env.PUBLIC_DB_ROOT_NAME;
let ROOT_PW = env.PUBLIC_DB_ROOT_PW;

export let db: Surreal | undefined;

export let user_token: string | undefined;

export async function initDb(): Promise<Surreal | undefined> {
  if (db) return db;
  db = new Surreal();
  try {
    await db.connect(env.PUBLIC_DB_HOST, {
      auth: {
        username: ROOT_USER,
        password: ROOT_PW
      }
    });
    await db.use({
      namespace: env.PUBLIC_DB_NS,
      database: env.PUBLIC_DB_DB,
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

export function getDb(): Surreal | undefined {
  return db;
}

export function checkSession() {
  if (localStorage.getItem("user_token") !== "" && localStorage.getItem("user_token") !== null) {
    user_token = localStorage.getItem("user_token")!;
  }
}

export async function signIn(data: { username: string, email: string, pass: string, confirmPass: string }) {
  initDb();
  let db: Surreal | undefined = getDb();
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
  localStorage.setItem("user_token", token);
}

export async function signUp(data: { username: string, email: string, pass: string, confirmPass: string }) {
  initDb();
  let db: Surreal | undefined = getDb();
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
  localStorage.setItem("user_token", token);
}

export async function getPost() {
  initDb()
  let db: Surreal | undefined = getDb();
  if (!db) return;
  await db.connect(env.PUBLIC_DB_HOST, {
    namespace: NS,
    database: DB,
    auth: {
      username: ROOT_USER,
      password: ROOT_PW
    }
  });
  let posts = await db?.select("posts");
  return posts;
}

export async function getTopics() {
  initDb()
  let db: Surreal | undefined = getDb();
  if (!db) return;
  await db.connect(env.PUBLIC_DB_HOST, {
    namespace: NS,
    database: DB,
    auth: {
      username: ROOT_USER,
      password: ROOT_PW
    }
  });
  let posts = await db?.select("topics");
  return posts;
}
