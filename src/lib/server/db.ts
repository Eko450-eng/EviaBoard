import { goto } from '$app/navigation';
import { Surreal } from 'surrealdb';
import { DB_DB, DB_NS, DB_ROOT_PW } from '$env/static/private';
import { PUBLIC_DB_HOST } from '$env/static/public';
import { isLoggedIn, userStore } from '@/stores/userstore';

let HOST = PUBLIC_DB_HOST;
let NS = DB_NS;
let DB_KEY = DB_DB;
let ADMINPW = DB_ROOT_PW;
let ADMINUSER = 'admin';

let db: Surreal | undefined;

export async function initDb(): Promise<Surreal | undefined> {
	if (!db) {
		db = new Surreal();

		try {
			await db.connect(HOST!, {
				versionCheck: false,
				auth: {
					namespace: NS,
					database: DB_KEY,
					username: ADMINUSER,
					password: ADMINPW,
				},
			});
			return db;
		} catch (err) {
			console.error(err);
			throw err;
		}
	}
	return db;
}

export async function closeDb(): Promise<void> {
	if (!db) return;
	await db.close();
	db = undefined;
}

export async function getDb(): Promise<Surreal | undefined> {
	if (!db) {
		return await initDb();
	}
	return db;
}

export async function signOut() {
	localStorage.clear();
	if (db) {
		try {
			await db.connect(HOST, {
				auth: {
					namespace: NS,
					database: DB_KEY,
					username: ADMINUSER,
					password: ADMINPW,
				},
			});
		} catch (err) {
			console.error(err);
			throw err;
		}
	}
	goto('/', { replaceState: true });
	userStore.set(undefined);
	isLoggedIn.set(false);
	goto('/', { replaceState: true });
	return {
		title: 'Bye',
		desc: 'Bis dann',
		error: false,
	};
}
