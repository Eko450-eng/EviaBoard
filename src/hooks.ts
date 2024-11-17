/** @type {import('@sveltejs/kit').Handle} */
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	let session = event.cookies.get('jwt');
	const response = await resolve(event);
	return response;
};
