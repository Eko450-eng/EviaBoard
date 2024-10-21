import { env } from "$env/dynamic/public";
import { json } from "@sveltejs/kit";
import Surreal from "surrealdb";
import webPush from "web-push";

webPush.setVapidDetails(
  'mailto:ekrem@wipdesign.de',
  env.PUBLIC_VAPID_PUBLIC,
  env.PUBLIC_VAPID_PRIVATE,
);

let HOST = env.PUBLIC_DB_HOST;
let NS = env.PUBLIC_DB_NS;
let DB_KEY = env.PUBLIC_DB_DB;
let guestpw = env.PUBLIC_DB_GUEST_PW;

export const POST = async ({ request }: any) => {
  const body = await request.json();
  const { payload, channelName } = body;

  let db: Surreal | undefined = new Surreal();

  await db.connect(HOST
    , {
      auth: {
        namespace: NS,
        database: DB_KEY,
        username: "eviaguest",
        password: guestpw
      }
    })

  let queryChannels = `SELECT * FROM channels WHERE channelname='${channelName}'`;
  let channels: any = await db?.query(queryChannels)

  let usersList = await db.query(`SELECT in.data as subscriptions from pushkey_channel WHERE out = ${channels[0][0].id}`);
  let users: Array<{ subscriptions: webPush.PushSubscription }> = usersList[0] as any[]

  users.forEach(async (sub: { subscriptions: webPush.PushSubscription }) => {
    let subscription = sub.subscriptions
    try {
      await webPush.sendNotification(subscription, JSON.stringify(payload));
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (err: any) {
      console.error('Error sending notification:', err);
      return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
    }
  })

  return json({ success: true })
};
