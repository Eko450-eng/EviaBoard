/** @type {import('@sveltejs/kit').Handle} */
import { initDb } from '@/db';

export async function handle({ event, resolve }: any) {
	await initDb();
	const response = await resolve(event);
	return response;
}
