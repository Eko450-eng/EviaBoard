import { PUBLIC_HOST } from '$env/static/public';
import type { PageServerLoad } from './$types';

export let ssr = false;
export let csr = true;

// eslint-disable-next-line
export const load: PageServerLoad = async ({ parent, cookies }) => {
	await parent();
	const token = cookies.get('jwt');

	let resPosts = await fetch(`${PUBLIC_HOST}/api/knowledgebase`, {
		headers: {
			Authorization: `Bearer ${token}`,
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
