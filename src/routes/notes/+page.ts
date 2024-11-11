import { getDb } from '@/db';
import type { Notes } from '@/types';

export async function load() {
	let db = await getDb();

	const res = await db?.select<Notes>('notes');

	if (!res) return;
	let data = res;
	return { data };
}
