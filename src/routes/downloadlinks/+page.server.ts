import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	let res = await fetch(`/api/downloadlinks`);
	let { downloadlinks } = await res.json();
	return { data: downloadlinks };
};
