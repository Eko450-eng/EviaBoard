import type { Channel, Pushkey } from '@/types';
import type { RecordId } from 'surrealdb';
import { getDb } from '@/db';
import { userStore } from '../../lib/stores/user.store';

export async function channelHandler(channel: Channel, isSubbed: boolean) {
	if (!channel.id) return;
	if (!isSubbed) {
		unSubFromChannel(channel.id);
	} else {
		subToChannel(channel.id);
	}
}

export async function unSubFromChannel(channel: RecordId) {
	let db = await getDb();
	if ('serviceWorker' in navigator) {
		const registration = await navigator.serviceWorker.ready;
		const subscription = await registration.pushManager.getSubscription();
		const pushKey: Array<Array<Pushkey>> | undefined = await db?.query<
			Array<Array<Pushkey>>
		>(`SELECT * FROM pushkey WHERE user = ${userStore()?.id}`);
		if (!pushKey) return;

		pushKey[0].forEach(async (key) => {
			const query = `DELETE FROM pushkey_channel WHERE in = ${key.id} AND out = ${channel} AND in.data.endpoint = '${subscription?.endpoint}'`;
			await db?.query(query);
		});
	}
}

export async function subToChannel(channel: RecordId) {
	let db = await getDb();
	const pushKey: Array<Array<Pushkey>> | undefined = await db?.query<
		Array<Array<Pushkey>>
	>(`SELECT * FROM pushkey WHERE user = ${userStore()?.id}`);
	if (!pushKey) return;

	pushKey[0].forEach(async (key) => {
		await db?.query(`RELATE  ${key.id} -> pushkey_channel -> ${channel}`);
	});
}
