import { db } from "@/db";
import { generateAvatar } from "@/helpers/minio";
import type { User } from "@/types";

export async function updateUser(userData: User, user: User) {
  await generateAvatar(userData);

  return await db
    ?.patch(userData.id!, [
      {
        op: "replace",
        path: "/email",
        value: user.email,
      },
      {
        op: "replace",
        path: "/name",
        value: user.name,
      },
      {
        op: "replace",
        path: "/image",
        value: `https://minio.eko450eng.org/eviaboard/${userData.id}.png`,
      },
    ])
}

export function requestNotificationPermission() {
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      new Notification("You are now subscribed to notifications!");
    }
  });
}

export async function sendSubscriptionToServer(subscription: PushSubscription, userData: User, isSubscribed: boolean) {
  let d = subscription.toJSON();
  let data = {
    endpoint: d.endpoint,
    keys: d.keys,
    expirationTime: d.expirationTime,
  };
  try {
    const res = await fetch("/api/vapidkey", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ subscription: data, user: userData }),
    });
    if (!res.ok) {
      console.error(
        `First Error saving subscription on server: ${res.statusText} (${res.status})`,
      );
      throw new Error(
        ` Second Error saving subscription on server: ${res.statusText} (${res.status})`,
      );
    }
  } catch (error) {
    console.error("Third Error saving subscription on server:", error);
    unsubscribe(isSubscribed, userData);
  }
}

export async function checkSubscriptionStatus(userData: User, isSubscribed: boolean) {
  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.ready;
    const subscription =
      await registration.pushManager.getSubscription();
    const exists = subscription !== null;
    if (exists) {
      // just to make sure the subscription is saved on the server
      sendSubscriptionToServer(subscription, userData, isSubscribed);
    }
    return exists;
  }
  return false;
}

export async function subscribeUser(isSubscribed: boolean, userData: User) {
  if ("serviceWorker" in navigator) {
    try {
      const res = await fetch("/api/vapidkey");
      const { data } = await res.json();

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: data,
      });
      isSubscribed = true;
      sendSubscriptionToServer(subscription, userData, isSubscribed);
    } catch (err) {
      console.error("Error subscribing:", err);
    }
  }
}

export async function unsubscribe(isSubscribed: boolean, userData: User) {
  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.ready;
    const subscription =
      await registration.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
      await db?.query(`DELETE FROM pushkey_channel WHERE in.user.id = ${userData.id}`)
      await db?.query(`DELETE FROM pushkey WHERE user = ${userData.id}`)
      isSubscribed = false;
    }
  }
}