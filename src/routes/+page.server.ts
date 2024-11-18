import type { PageServerLoad } from './featureboard/$types';
import { PUBLIC_HOST } from '$env/static/public';

export const load: PageServerLoad = async ({ cookies }) => {
	const token = cookies.get('jwt');
	let resPosts = await fetch(`${PUBLIC_HOST}/api/news`, {
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
	});

	let { data } = await resPosts.json();
	return { data };
};
