import type { PageServerLoad } from './$types';

export let ssr = false;
export let csr = true;

export const load: PageServerLoad = async ({ fetch, parent }) => {
	await parent();

	let resPosts = await fetch(`/api/knowledgebase`, {
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	let { posts, topics } = await resPosts.json();

	let data = {
		res: posts,
		topics: topics,
		failed: false,
	};

	return {
		posts: data?.res,
		topics: topics,
		failed: data?.failed,
	};
};
