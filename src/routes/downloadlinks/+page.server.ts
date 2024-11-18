import { PUBLIC_HOST } from '$env/static/public';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	let res = await fetch(`${PUBLIC_HOST}/api/downloadlinks`);
	let { downloadlinks } = await res.json();
	return { data: downloadlinks };
};
