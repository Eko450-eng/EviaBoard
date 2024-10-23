import { env } from "$env/dynamic/public";
import { db } from "@/db";
import type { Pushkey } from "@/types";
import { json, type RequestHandler, error } from "@sveltejs/kit";
import { RecordId } from "surrealdb";

const VAPID_PUBLIC_KEY = env.PUBLIC_VAPID_PUBLIC
export const GET = (() => {
  return json({ data: VAPID_PUBLIC_KEY })
}) satisfies RequestHandler

export const POST = (async ({ request }) => {
  const body = await request.json();

  try {
    if (!body.subscription) {
      console.error('No subscription passed to addSubscription', body);
      throw error(400, 'Bad Request');
    }

    if (body.user.id === "user:tada") return json({ success: false })

    let userId = body.user.id as string;
    let userID = new RecordId("user", userId.replace("user:", ""));

    try {
      console.log(body.subscription.endpoint)
      let query = `SELECT * FROM pushkey WHERE data.endpoint = '${body.subscription.endpoint}'`;
      let exists = await db?.query<Array<Array<Pushkey>>>(query)
      if (exists && exists[0].length <= 0) {
        console.log("Subbing", exists[0], query)
        await db?.create("pushkey", {
          user: userID,
          data: body.subscription
        })
      }
    } catch (e) {
      console.error(e)
    }

    return json({ success: true });
  } catch (e) {
    console.error("Failed to add subscription: ", e)
  }

  return json({ success: true });
}) satisfies RequestHandler;
