import type { PageServerLoad } from './$types';

// eslint-disable-next-line
export const load: PageServerLoad = async ({ fetch, params, parent }) => {
	await parent();
	let resPosts = await fetch(`/api/knowledgebase/post?id=${params.slug}`);
	let resComments = await fetch(
		`/api/knowledgebase/comments?id=${params.slug}`,
	);
	let data = await resPosts.json();
	let { comments } = await resComments.json();

	let result = {
		data,
		comments,
	};

	return result;
};
