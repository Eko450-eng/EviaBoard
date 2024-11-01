/** @type {import('@sveltejs/kit').Handle} */
import { initDb } from '$lib/db';

export async function handle({ event, resolve }: any) {
	await initDb().catch(console.error);
	const response = await resolve(event);
	return response;
}
