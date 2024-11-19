/** @type {import('@sveltejs/kit').Handle} */

import { initDb } from '@/server/db';
import { checkUser } from '@/server/user.store';
import { isLoggedIn } from '@/stores/userstore';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	await initDb().catch(console.error);
	const token = event.cookies.get('jwt');

	// Attach the token to the request headers, if needed
	if (token) {
		if (!isLoggedIn) await checkUser(token);

		event.cookies.set('jwt', token, {
			path: '/',
			sameSite: 'lax',
		});

		event.locals.jwt = token;
	}

	return await resolve(event);
};
