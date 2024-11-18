import type { User } from '@/types';
import { writable, type Writable } from 'svelte/store';
import * as cookies from 'js-cookie';

export let userStore: Writable<User | undefined> = writable(undefined);
export let isLoggedIn: Writable<boolean> = writable(false);
export let adminModeVal: Writable<boolean> = writable(true);

export async function checkUser(token: string | undefined | null) {
	if (!token) return false;
	cookies.default.set('jwt', token, {
		sameSite: 'lax',
	});
	await fetch('/api/getuser', {
		headers: {
			'Content-Type': 'application/json',
		},
	}).then(async (res) => {
		let { isValid, user } = await res.json();
		if (!isValid) return;
		userStore.set(user);
		isLoggedIn.set(isValid);
	});
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
