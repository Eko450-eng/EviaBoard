import type { Channel } from '@/types';
import type { PageServerLoad } from './$types';
import { PUBLIC_HOST } from '$env/static/public';

export interface ChannelSubsCheckable extends Channel {
	subbed: number[];
}

export const load: PageServerLoad = async ({ parent, cookies }) => {
	await parent();
	let token = cookies.get('jwt');
	let res = await fetch(`${PUBLIC_HOST}/api/user`, {
		method: 'POST',
		body: JSON.stringify({ test: 'test' }),
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
	});

	let channel = await res.json();

	return channel;
};
