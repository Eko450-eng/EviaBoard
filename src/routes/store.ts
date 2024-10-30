import { get, writable, type Writable } from 'svelte/store';
import { initDb } from '@/db';
import Surreal, { RecordId } from 'surrealdb';
import type { User } from '@/types';

// Userdata
const initData: User = {
	email: '',
	id: new RecordId('user', 'tada'),
	name: '',
	password: '',
	role: '',
};

export const userData: Writable<User> = writable(initData);

export const isLoggedIn = writable(false);
export const DB = writable(new Surreal());

export async function checkLoggedIn(): Promise<Surreal | undefined> {
	let db = await initDb();

	if (db) {
		DB.set(db);
	}

	let token = localStorage.getItem('user_token');

	if (token) {
		db?.authenticate(token).then(async () => {
			db?.authenticate(token);
			let user = await db?.query<Array<Array<User>>>(
				'SELECT * FROM user WHERE id = $auth.id',
			);
			if (!user) return;
			let u = user[0][0];
			userData.set(u);
			checkIsLoggedIn(true);
		});
	} else {
		checkIsLoggedIn(false);
	}
	if (db) {
		DB.set(db);
	}
	return db;
}

export function checkIsLoggedIn(state: boolean) {
	isLoggedIn.set(state);
}

// Adminmode
export const adminMode: Writable<boolean> = writable(true);

export function checkAdminMode() {
	let state = localStorage.getItem('adminMode') === '1' ? true : false;
	adminMode.set(state);
}

export function changeAdminMode() {
	adminMode.set(!get(adminMode));
	let state = get(adminMode) ? '1' : '0';
	localStorage.setItem('adminMode', state);
}
