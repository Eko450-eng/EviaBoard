import type { Channel } from '@/types';
import type { RecordId } from 'surrealdb';

export async function channelHandler(
	channel: Channel,
	isSubbed: boolean,
	userId: RecordId | undefined,
) {
	if (!userId) return null;
	if (!channel.id) return null;
	if (!isSubbed) {
		return await unSubFromChannel(channel.id, userId);
	} else {
		return await subToChannel(channel.id, userId);
	}
}

export async function unSubFromChannel(channel: RecordId, userId: RecordId) {
	if ('serviceWorker' in navigator) {
		const registration = await navigator.serviceWorker.ready;
		const subscription = await registration.pushManager.getSubscription();
		const state = false;

		let r = await fetch(`/api/user/channels`, {
			method: 'POST',
			body: JSON.stringify({ subscription, userId, channel, state }),
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
		}).then(async (res) => {
			return res;
		});
		return r;
	}
	return null;
}

export async function subToChannel(channel: RecordId, userId: RecordId) {
	if ('serviceWorker' in navigator) {
		const registration = await navigator.serviceWorker.ready;
		const subscription = await registration.pushManager.getSubscription();
		const state = true;

		let r = await fetch(`/api/user/channels`, {
			method: 'POST',
			body: JSON.stringify({ subscription, userId, channel, state }),
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
		}).then(async (res) => {
			return res;
		});
		return r;
	}
	return null;
}
