import { getDb } from '@/db';
import type { User } from '@/types';
import { writable, type Writable } from 'svelte/store';

export let userStore: Writable<User | undefined> = writable(undefined);
export let isLoggedIn: Writable<boolean> = writable(false);
export let adminModeVal: Writable<boolean> = writable(true);

export async function checkUser(token: string | undefined | null) {
	if (!token) return false;
	let db = await getDb();
	db?.authenticate(token).then(async () => {
		db?.authenticate(token);
		let user = await db?.query<Array<Array<User>>>(
			'SELECT * FROM user WHERE id = $auth.id',
		);
		if (!user) return;
		let u = user[0][0];
		userStore.set(u);
		isLoggedIn.set(true);
	});
	isLoggedIn.set(false);
	return true;
}

export function setUserData(user: User) {
	userStore.set(user);
}

export function unsetUserData() {
	userStore.set(undefined);
}

export function checkAdminMode() {
	let state = localStorage.getItem('adminMode') === '1' ? true : false;
	adminModeVal.set(state);
}

export function changeAdminMode() {
	adminModeVal.set(!adminModeVal);
	let state = adminModeVal ? '1' : '0';
	localStorage.setItem('adminMode', state);
}
