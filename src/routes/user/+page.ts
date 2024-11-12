import { getDb } from '@/db';
import { checkUser, userStore } from '@/stores/user.store';
import type { Channel } from '@/types';
import { get } from 'svelte/store';

export interface ChannelSubsCheckable extends Channel {
	subbed: number[];
}

export const ssr = false;

export async function load({ parent }: any) {
	await parent();
	let user = get(userStore);
	let db = await getDb();
	let subscription: PushSubscription | null;
	if ('serviceWorker' in navigator) {
		const registration = await navigator.serviceWorker.ready;
		let sub = await registration.pushManager.getSubscription();
		subscription = sub;
	}

	if (!user) return;
	let channelsQuery = await db?.query<Array<Array<Channel>>>(
		`SELECT *, (SELECT COUNT() FROM user_channels WHERE in.id = ${user.id} AND out = $parent.id) as subbed FROM channels`,
	);
	console.log('here', channelsQuery);
	if (!channelsQuery) return;

	let channel = channelsQuery[0];
	return { channel };
}
