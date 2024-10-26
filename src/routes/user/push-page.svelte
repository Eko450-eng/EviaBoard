<script lang="ts">
import type { Channel, User } from "$lib/types";
import { Button } from "$ui/button";
import { Checkbox } from "$ui/checkbox";
import { Label } from "$ui/label";
import { db } from "@/db";
import { adminOnly } from "@/helpers/admin";
import { sendPush } from "@/helpers/push";
import { RecordId } from "surrealdb";
import { onMount } from "svelte";
import { toast } from "svelte-sonner";
import { type Writable, writable } from "svelte/store";
import { adminMode, userData } from "../store";
import {
	checkSubscriptionStatus,
	requestNotificationPermission,
	subscribeUser,
	unsubscribe,
} from "./functions";
import { channelHandler } from "./notifyFunctions";

type ChannelSubsCheckable = {
	channel: Channel;
	userIsSubbed: boolean;
};

let nottifPermGranted: boolean | null = null;
const channels: Writable<ChannelSubsCheckable[]> = writable([]);
let isSubscribed = false;

onMount(async () => {
	nottifPermGranted = Notification.permission === "granted";
	if ($userData.id?.toString() !== new RecordId("user", "tada").toString()) {
		await getChannels();
	} else {
		userData.subscribe(async () => {
			await getChannels();
		});
	}

	if (nottifPermGranted) {
		isSubscribed = await checkSubscriptionStatus($userData, isSubscribed);
	}

	await getChannels();
});

async function sendPushHandler() {
	try {
		await sendPush("testing", "test");
	} catch (e) {
		console.error(e);
	}
}

async function getChannels() {
	let subscription: PushSubscription | null;
	if ("serviceWorker" in navigator) {
		const registration = await navigator.serviceWorker.ready;
		const sub = await registration.pushManager.getSubscription();
		subscription = sub;
	}

	const channelsQuery = await db?.query<Array<Array<Channel>>>(
		"SELECT * FROM channels",
	);
	if (!channelsQuery) return;

	const c: ChannelSubsCheckable[] = [];
	channelsQuery[0].forEach(async (channel) => {
		const q = `SELECT out.channelname as channelname, out.id as id, in.user.* as user from pushkey_channel WHERE in.user.id = ${$userData.id} AND out.id = ${channel.id} AND in.data.endpoint = '${subscription?.endpoint}'`;
		const isSubbed =
			await db?.query<
				Array<
					Array<{
						channelname: string;
						id: RecordId;
						user: User;
					}>
				>
			>(q);
		let cc: ChannelSubsCheckable;
		if (!isSubbed || !isSubbed[0]) return;
		const s = isSubbed[0];

		if (subscription && s.length >= 1) {
			cc = {
				channel,
				userIsSubbed: true,
			};
		} else {
			cc = {
				channel,
				userIsSubbed: false,
			};
		}
		c.push(cc);
		channels.set(c);
	});

	$channels.sort((a: ChannelSubsCheckable, b: ChannelSubsCheckable) =>
		a.channel.channelname.localeCompare(b.channel.channelname),
	);
}
</script>

<div class="flex flex-col">
    <div class="flex flex-col mb-10">
        <p>Subscribe to push notifications</p>
        {#each $channels as channel}
            <div class="items-top flex space-x-2">
                <Checkbox
                    id={channel.channel.channelname}
                    onCheckedChange={(v) => channelHandler(channel.channel, v)}
                    bind:checked={channel.userIsSubbed}
                />
                <div class="grid gap-1.5 leading-none">
                    <Label
                        for={channel.channel.channelname}
                        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        {channel.channel.channelname}
                    </Label>
                </div>
            </div>
        {/each}
    </div>

    {#if nottifPermGranted === null}
        <p>Checking permissions...</p>
    {:else if nottifPermGranted === false}
        <Button
            variant="secondary"
            class="button"
            type="button"
            on:click={() => {
                requestNotificationPermission();
                nottifPermGranted = Notification.permission === "granted";
            }}>Enable notifications</Button
        >
    {:else}
        <p>Subscribed to push notifications: <b>{isSubscribed}</b></p>
        {#if !isSubscribed}
            <Button
                variant="secondary"
                on:click={async () => {
                    isSubscribed = await checkSubscriptionStatus(
                        $userData,
                        isSubscribed,
                    );
                    if (isSubscribed) return;
                    subscribeUser(isSubscribed, $userData).then((subbed) => {
                        if (subbed) {
                            toast.error("Nice", {
                                description: "Spam incoming!",
                            });
                            isSubscribed = true;
                        } else {
                            toast.error("Oops", {
                                description: "Das hat nicht ganz funktioniert",
                            });
                        }
                    });
                }}>Subscribe</Button
            >
        {/if}
        {#if isSubscribed}
            <div>
                <Button
                    class="button"
                    type="button"
                    variant="secondary"
                    on:click={() => {
                        unsubscribe(isSubscribed, $userData);
                        isSubscribed = false;
                    }}>Unsubscribe from everything</Button
                >
            </div>
        {/if}
    {/if}
</div>

{#if adminOnly($userData, $adminMode)}
    <Button class="my-2" on:click={sendPushHandler} variant="secondary"
        >test</Button
    >
{/if}
