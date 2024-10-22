<script lang="ts">
    import { checkIsLoggedIn, userData } from "../store";
    import { Label } from "$ui/label";
    import { Checkbox } from "$ui/checkbox";
    import { Button } from "$ui/button";
    import { Input } from "$ui/input";
    import { fileUploadHandler } from "@/helpers/minio";
    import { db, signOut } from "@/db";
    import { toast } from "svelte-sonner";
    import { Icon } from "svelte-icons-pack";
    import { FaSolidArrowRightFromBracket } from "svelte-icons-pack/fa";
    import { onMount } from "svelte";
    import {
        checkSubscriptionStatus,
        requestNotificationPermission,
        subscribeUser,
        unsubscribe,
        updateUser,
    } from "./functions";
    import { sendPush } from "@/helpers/push";
    import { RecordId } from "surrealdb";
    import type { Channel, Pushkey, User } from "@/types";
    import { writable, type Writable } from "svelte/store";
    import BugTable from "../featureboard/bug-table.svelte";

    let user: User = {
        id: $userData.id,
        password: $userData.password,
        role: $userData.role,
        email: $userData.email,
        name: $userData.name,
        image: $userData.image,
    };

    type ChannelSubsCheckable = {
        channel: Channel;
        userIsSubbed: boolean;
    };

    let channels: Writable<ChannelSubsCheckable[]> = writable([]);
    let nottifPermGranted: boolean | null = null;
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
    });

    async function handleUpdateUser() {
        await updateUser($userData, user).then(() => {
            toast.success("Yey", {
                description: "User updated",
            });
        });
    }

    async function sendPushHandler() {
        let res = await sendPush("testing", "test");
        console.log(res);
    }

    async function channelHandler(channel: Channel, isSubbed: any) {
        if (!channel.id) return;
        if (!isSubbed) {
            unSubFromChannel(channel.id);
        } else {
            subToChannel(channel.id);
        }
    }

    async function unSubFromChannel(channel: RecordId) {
        let pushKey: Array<Array<Pushkey>> | undefined = await db?.query<
            Array<Array<Pushkey>>
        >(`SELECT * FROM pushkey WHERE user = ${$userData.id}`);
        if (!pushKey) return;

        pushKey[0].forEach(async (key) => {
            let query = `DELETE FROM pushkey_channel WHERE in = ${key.id} AND out = ${channel}`;
            await db?.query(query);
        });
    }

    async function subToChannel(channel: RecordId) {
        let pushKey: Array<Array<Pushkey>> | undefined = await db?.query<
            Array<Array<Pushkey>>
        >(`SELECT * FROM pushkey WHERE user = ${$userData.id}`);
        if (!pushKey) return;

        pushKey[0].forEach(async (key) => {
            await db?.query(
                `RELATE  ${key.id} -> pushkey_channel -> ${channel}`,
            );
        });
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
    }
</script>

<div class="flex flex-col my-5">
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

    {#if $userData.role === "admin"}
        <div>
            <Button on:click={sendPushHandler} variant="secondary">test</Button>
        </div>
    {/if}
    {#if nottifPermGranted === null}
        <p>Checking permissions...</p>
    {:else if nottifPermGranted === false}
        <Button
            variant="secondary"
            class="button"
            type="button"
            on:click={() => requestNotificationPermission()}
            >Enable notifications</Button
        >
    {:else}
        <p>Subscribed to push notifications: <b>{isSubscribed}</b></p>
        {#if !isSubscribed}
            <Button
                variant="secondary"
                on:click={async () => {
                    subscribeUser(isSubscribed, $userData);
                    isSubscribed = await checkSubscriptionStatus(
                        $userData,
                        isSubscribed,
                    );
                }}>Subscribe</Button
            >
        {/if}
        {#if isSubscribed}
            <div>
                <Button
                    class="button"
                    type="button"
                    variant="secondary"
                    on:click={() => unsubscribe(isSubscribed, $userData)}
                    >Unsubscribe from everything</Button
                >
            </div>
        {/if}
    {/if}
</div>

<form on:submit={handleUpdateUser}>
    <div class="flex justify-between">
        <h1 class="text-2xl">{$userData.name}</h1>
        <Button
            class="mx-4"
            on:click={async () => {
                signOut();
                checkIsLoggedIn(false);
            }}
            variant="outline"
            size="icon"
        >
            <Icon src={FaSolidArrowRightFromBracket} size={24} />
        </Button>
    </div>
    <h3 class="text-xs mb-5">{$userData.role}</h3>
    <Label for="email">E-Mail</Label>
    <Input
        type="text"
        name="email"
        placeholder={$userData.email}
        bind:value={user.email}
    />
    <Label for="name">Username</Label>
    <Input
        type="text"
        name="name"
        placeholder={$userData.name}
        bind:value={user.name}
    />
    <Label for="image">Image</Label>

    <div class="flex gap-2">
        <Input type="file" on:change={fileUploadHandler} />
    </div>
    <Button class="my-4" type="submit" variant="secondary">Speichern</Button>
</form>
