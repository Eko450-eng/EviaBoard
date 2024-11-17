import { DB_DB, DB_NS, DB_ROOT_PW } from '$env/static/private';
import {
	PUBLIC_DB_HOST,
	PUBLIC_VAPID_PRIVATE,
	PUBLIC_VAPID_PUBLIC,
} from '$env/static/public';
import type { Channel } from '@/types';
import { json } from '@sveltejs/kit';
import Surreal from 'surrealdb';
import webPush from 'web-push';

webPush.setVapidDetails(
	'mailto:ekrem@wipdesign.de',
	PUBLIC_VAPID_PUBLIC,
	PUBLIC_VAPID_PRIVATE,
);

let HOST = PUBLIC_DB_HOST;
let NS = DB_NS;
let DB_KEY = DB_DB;
let ADMINPW = DB_ROOT_PW;
let ADMINUSER = 'admin';

export const POST = async ({ request }: { request: Request }) => {
	const body = await request.json();
	const { payload, channelName } = body;

	let db: Surreal | undefined = new Surreal();

	await db.connect(HOST, {
		auth: {
			namespace: NS,
			database: DB_KEY,
			username: ADMINUSER,
			password: ADMINPW,
		},
	});

	let queryChannels = `SELECT * FROM channels WHERE channelname='${channelName}'`;
	let channels: Channel[][] =
		await db?.query<Array<Array<Channel>>>(queryChannels);

	let usersListQuery = `SELECT in.data as subscriptions from pushkey_channel WHERE out = ${channels[0][0].id}`;
	let usersList = await db.query(usersListQuery);
	// eslint-disable-next-line
	let users: Array<{ subscriptions: webPush.PushSubscription }> =
		usersList[0] as any[];

	users.forEach(async (sub: { subscriptions: webPush.PushSubscription }) => {
		let subscription = sub.subscriptions;
		try {
			await webPush.sendNotification(subscription, JSON.stringify(payload));
			return new Response(JSON.stringify({ success: true }), { status: 200 });
			// eslint-disable-next-line
		} catch (err: any) {
			console.error('Error sending notification:', err);
			return new Response(
				JSON.stringify({ success: false, error: err.message }),
				{ status: 500 },
			);
		}
	});

	return json({ success: true });
};
