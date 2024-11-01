/** @type {import('@sveltejs/kit').Handle} */
import { checkUser } from '@/stores/user.store';

export async function handle({ event, resolve }: any) {
	let token = localStorage.getItem('user_token');
	await checkUser(token);
	const response = await resolve(event);
	return response;
}
