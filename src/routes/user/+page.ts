import { getDb } from '@/db';
import { userStore } from '@/stores/user.store';
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
	let query = `SELECT * FROM channels`;
	if (!user) return;

	console.log(navigator.serviceWorker.ready);

	// try {
	// 	if ('serviceWorker' in navigator) {
	// 		const registration = await navigator.serviceWorker.ready;
	// 		let sub = await registration.pushManager.getSubscription();
	// 		subscription = sub;
	// 		query = `SELECT *, (SELECT COUNT() FROM pushkey_channel WHERE in.user = ${user.id} AND out = $parent.id AND in.data.endpoint = "${subscription?.endpoint}") as subbed FROM channels`;
	// 	}
	// } catch (e) {
	// 	console.error('Kein Serviceworker installiert - ', e);
	// }

	let channelsQuery = await db?.query<Array<Array<Channel>>>(query);
	if (!channelsQuery) return;
	console.log(query);
	console.log(channelsQuery);

	let channel = channelsQuery[0];
	return { channel };
}
