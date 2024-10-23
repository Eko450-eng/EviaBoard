<script lang="ts">
    import { Checkbox } from "$ui/checkbox";
    import { Label } from "$ui/label";
    import { Button } from "$ui/button";
    import {
        checkSubscriptionStatus,
        requestNotificationPermission,
        subscribeUser,
        unsubscribe,
    } from "./functions";
    import { RecordId } from "surrealdb";
    import type { Channel, User } from "$lib/types";
    import { sendPush } from "@/helpers/push";
    import { db } from "@/db";
    import { adminMode, userData } from "../store";
    import { writable, type Writable } from "svelte/store";
    import { onMount } from "svelte";
    import { adminOnly } from "@/helpers/admin";
    import { channelHandler } from "./notifyFunctions";
    import { toast } from "svelte-sonner";

    type ChannelSubsCheckable = {
        channel: Channel;
        userIsSubbed: boolean;
    };

    let nottifPermGranted: boolean | null = null;
    let channels: Writable<ChannelSubsCheckable[]> = writable([]);
    let isSubscribed = false;

    onMount(async () => {
        nottifPermGranted = Notification.permission === "granted";
        if (
            $userData.id?.toString() !== new RecordId("user", "tada").toString()
        ) {
            await getChannels();
        } else {
            userData.subscribe(async () => {
                await getChannels();
            });
        }

        if (nottifPermGranted) {
            isSubscribed = await checkSubscriptionStatus(
                $userData,
                isSubscribed,
            );

            //if (!isSubscribed) {
            //    if (!$userData.email) {
            //    } else {
            //        userData.subscribe(async () => {
            //            if (isSubscribed) return;
            //            if (!$userData.email) {
            //            console.log("retry")
            //                await subscribeUser(isSubscribed, $userData);
            //            }
            //        });
            //    }
            //    {
            //        await subscribeUser(isSubscribed, $userData);
            //    }
            //}
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
        let channelsQuery = await db?.query<Array<Array<Channel>>>(
            "SELECT * FROM channels",
        );
        if (!channelsQuery) return;

        let c: ChannelSubsCheckable[] = [];
        channelsQuery[0].forEach(async (channel) => {
            const q = `SELECT out.channelname as channelname, out.id as id, in.user.* as user from pushkey_channel WHERE in.user.id = ${$userData.id} AND out.id = ${channel.id}`;
            let isSubbed = await db?.query<
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
            let s = isSubbed[0];

            if (s.length >= 1) {
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
