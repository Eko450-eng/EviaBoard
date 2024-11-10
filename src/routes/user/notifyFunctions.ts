import type { Channel, Pushkey } from '@/types';
import type { RecordId } from 'surrealdb';
import { getDb } from '@/db';

export async function channelHandler(
	channel: Channel,
	isSubbed: boolean,
	userId: RecordId | undefined,
) {
	if (!userId) return;
	if (!channel.id) return;
	if (!isSubbed) {
		unSubFromChannel(channel.id, userId);
	} else {
		subToChannel(channel.id, userId);
	}
}

export async function unSubFromChannel(channel: RecordId, userId: RecordId) {
	let db = await getDb();
	if ('serviceWorker' in navigator) {
		const registration = await navigator.serviceWorker.ready;
		const subscription = await registration.pushManager.getSubscription();
		const pushKey: Array<Array<Pushkey>> | undefined = await db?.query<
			Array<Array<Pushkey>>
		>(`SELECT * FROM pushkey WHERE user = ${userId}`);
		if (!pushKey) return;

		pushKey[0].forEach(async (key) => {
			const query = `DELETE FROM pushkey_channel WHERE in = ${key.id} AND out = ${channel} AND in.data.endpoint = '${subscription?.endpoint}'`;
			await db?.query(query);
		});
	}
}

export async function subToChannel(channel: RecordId, userId: RecordId) {
	let db = await getDb();
	const pushKey: Array<Array<Pushkey>> | undefined = await db?.query<
		Array<Array<Pushkey>>
	>(`SELECT * FROM pushkey WHERE user = ${userId}`);
	if (!pushKey) return;

	pushKey[0].forEach(async (key) => {
		await db?.query(`RELATE  ${key.id} -> pushkey_channel -> ${channel}`);
	});
}
