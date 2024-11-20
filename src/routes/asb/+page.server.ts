import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	let res = await fetch(`/api/asbcheck`, {
		method: 'GET',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
	});
	let { asbcheck } = await res.json();
	return { asbcheck };
};
