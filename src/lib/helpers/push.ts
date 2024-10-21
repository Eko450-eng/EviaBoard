import type { RecordId } from "surrealdb";

export async function sendPush(channelName: string, payload: string, userId: RecordId) {
  try {
    const response = await fetch("/api/notify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({payload, channelName, userId}),
    });

    return await response.json();
  } catch (e) {
    console.error(e);
  }
}
