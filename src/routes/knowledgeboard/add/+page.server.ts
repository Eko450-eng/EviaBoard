import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ parent, fetch }) => {
	await parent();
	let resPosts = await fetch(`/api/knowledgebase`, {
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	let { topics } = await resPosts.json();

	return { topics };
};
