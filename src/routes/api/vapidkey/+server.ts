import { env } from "$env/dynamic/public";
import type { Pushkey } from "@/types";
import { type RequestHandler, error, json } from "@sveltejs/kit";
import Surreal, { RecordId } from "surrealdb";

const HOST = env.PUBLIC_DB_HOST;
const NS = env.PUBLIC_DB_NS;
const DB_KEY = env.PUBLIC_DB_DB;
const guestpw = env.PUBLIC_DB_GUEST_PW;

const VAPID_PUBLIC_KEY = env.PUBLIC_VAPID_PUBLIC;
export const GET = (() => {
	return json({ data: VAPID_PUBLIC_KEY });
}) satisfies RequestHandler;

export const POST = (async ({ request }) => {
	const body = await request.json();

	try {
		if (!body.subscription) {
			console.error("No subscription passed to addSubscription", body);
			throw error(400, "Bad Request");
		}

		if (body.user.id === "user:tada") return json({ success: false });

		const userId = body.user.id as string;
		const userID = new RecordId("user", userId.replace("user:", ""));

		const db = new Surreal();
		await db.connect(HOST, {
			auth: {
				namespace: NS,
				database: DB_KEY,
				username: "eviaguest",
				password: guestpw,
			},
		});

		try {
			const query = `SELECT * FROM pushkey WHERE data.endpoint = '${body.subscription.endpoint}'`;
			const exists = await db?.query<Array<Array<Pushkey>>>(query);
			if (exists && exists[0].length <= 0) {
				await db?.create("pushkey", {
					user: userID,
					data: body.subscription,
				});
			}
		} catch (e) {
			console.error(e);
		}

		return json({ success: true });
	} catch (e) {
		console.error("Failed to add subscription: ", e);
	}

	return json({ success: true });
}) satisfies RequestHandler;
