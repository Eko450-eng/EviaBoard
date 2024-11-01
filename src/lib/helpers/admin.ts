import { adminModeVal, userStore } from '@/stores/user.store';
import type { User } from '@/types';
import type { RecordId } from 'surrealdb';
import { get } from 'svelte/store';

export function editorOnly() {
	let user = get(userStore);
	if (!user) return false;
	if (user.role === 'editor' || user.role === 'admin') {
		return true;
	} else {
		return false;
	}
}

export function adminOnly() {
	let user = get(userStore);
	let adminMode = get(adminModeVal);
	if (!user) return false;
	if (user.role === 'admin' && adminMode) {
		return true;
	} else {
		return false;
	}
}

export function checkOwner(owner: RecordId | User): boolean {
	let user = get(userStore);
	if (
		user?.id?.toString() === owner.id?.toString() ||
		user?.id?.toString() === owner.toString()
	)
		return true;
	return false;
}
