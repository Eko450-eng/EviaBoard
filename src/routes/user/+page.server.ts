import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, parent }) => {
	await parent();
	let res = await fetch(`/api/user`, {
		method: 'POST',
		body: JSON.stringify({ test: 'test' }),
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	let channel = await res.json();

	return channel;
};
