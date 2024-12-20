import { userStore, adminModeVal } from '@/stores/userstore';
import type { User } from '@/types';
import type { RecordId } from 'surrealdb';
import { get } from 'svelte/store';

export function editorOnly() {
	let user = get(userStore);
	if (!user) return false;
	if (user.role >= 2) {
		return true;
	} else {
		return false;
	}
}

export function adminOnly() {
	let user = get(userStore);
	let adminMode = get(adminModeVal);
	if (!user) return false;
	if (user.role >= 10 && adminMode) {
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
