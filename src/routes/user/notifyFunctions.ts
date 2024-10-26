import { db } from "@/db";
import type { Channel, Pushkey } from "@/types";
import type { RecordId } from "surrealdb";
import { get } from "svelte/store";
import { userData } from "../store";

export async function channelHandler(channel: Channel, isSubbed: boolean) {
	if (!channel.id) return;
	if (!isSubbed) {
		unSubFromChannel(channel.id);
	} else {
		subToChannel(channel.id);
	}
}

export async function unSubFromChannel(channel: RecordId) {
	if ("serviceWorker" in navigator) {
		const registration = await navigator.serviceWorker.ready;
		const subscription = await registration.pushManager.getSubscription();
		const pushKey: Array<Array<Pushkey>> | undefined = await db?.query<
			Array<Array<Pushkey>>
		>(`SELECT * FROM pushkey WHERE user = ${get(userData).id}`);
		if (!pushKey) return;

		pushKey[0].forEach(async (key) => {
			const query = `DELETE FROM pushkey_channel WHERE in = ${key.id} AND out = ${channel} AND in.data.endpoint = '${subscription?.endpoint}'`;
			await db?.query(query);
		});
	}
}

export async function subToChannel(channel: RecordId) {
	const pushKey: Array<Array<Pushkey>> | undefined = await db?.query<
		Array<Array<Pushkey>>
	>(`SELECT * FROM pushkey WHERE user = ${get(userData).id}`);
	if (!pushKey) return;

	pushKey[0].forEach(async (key) => {
		await db?.query(`RELATE  ${key.id} -> pushkey_channel -> ${channel}`);
	});
}
