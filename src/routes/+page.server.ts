import type { PageServerLoad } from './featureboard/$types';

export const load: PageServerLoad = async ({ fetch }) => {
	let resPosts = await fetch(`/api/news`, {
		headers: {
			'Content-Type': 'application/json',
		},
	});

	let { data } = await resPosts.json();
	return { data };
};
