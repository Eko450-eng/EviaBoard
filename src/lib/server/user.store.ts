import type { User } from '@/types';
import { adminModeVal, isLoggedIn, userStore } from '@/stores/userstore';
import { getDb } from './db';

export async function checkUser(
	token: string | undefined | null,
): Promise<{ userObject: User; isValid: boolean } | null> {
	if (!token) return null;
	let db = await getDb();
	db?.authenticate(token);

	let isValid = await db?.authenticate(token);
	let userRaw = await db?.query<Array<Array<User>>>(
		'SELECT * FROM user WHERE id = $auth.id',
	);

	if (!userRaw || !isValid) return null;
	let userObject = userRaw[0][0];

	return { userObject, isValid };
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
