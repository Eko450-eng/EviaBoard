/** @type {import('@sveltejs/kit').Handle} */

export async function handle({ event, resolve }: any) {
	const response = await resolve(event);
	return response;
}
