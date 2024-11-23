import type { PageServerLoad } from './$types';

// eslint-disable-next-line
export const load: PageServerLoad = async ({ fetch, params, parent }) => {
	await parent();
	let resPosts = await fetch(`/api/knowledgebase/post?id=${params.slug}`);
	let res = await resPosts.json();

	return res;
};
