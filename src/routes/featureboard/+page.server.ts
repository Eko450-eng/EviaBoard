import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, fetch }) => {
	await parent();

	let res = await fetch(`/api/featureboard`, {
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	let { data } = await res.json();

	return {
		data,
	};
};
