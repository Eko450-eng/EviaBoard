import type { PageServerLoad } from './featureboard/$types';

export const load: PageServerLoad = async ({ fetch, cookies }) => {
	let resPosts = await fetch(`/api/news`, {
		headers: {
			'Content-Type': 'application/json',
		},
	});

	let token = cookies.get('jwt');
	if (!token) return;
	let resTitle;
	let resUserData;
	let resDesc;

	await fetch(`/api/login/withToken`, {
		method: 'POST',
		body: JSON.stringify({ token }),
		headers: {
			'Content-Type': 'application/json',
		},
	}).then(async (res) => {
		let { title, desc, userData } = await res.json();
		if (res.status === 200) {
			resTitle = title;
			resUserData = userData;
			resDesc = desc;
		}
	});

	let { data } = await resPosts.json();
	return { data, resTitle, resDesc, resUserData };
};
