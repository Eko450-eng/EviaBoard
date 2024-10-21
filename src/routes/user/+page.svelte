<script lang="ts">
    import { checkIsLoggedIn, userData } from "../store";
    import { Label } from "$ui/label";
    import { Button } from "$ui/button";
    import { Input } from "$ui/input";
    import { fileUploadHandler } from "@/helpers/minio";
    import { db, signOut, type user } from "@/db";
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

    let user: user = {
        id: $userData.id,
        password: $userData.password,
        role: $userData.role,
        email: $userData.email,
        name: $userData.name,
        image: $userData.image,
    };

    let nottifPermGranted: boolean | null = null;
    let isSubscribed = false;

    onMount(async () => {
        nottifPermGranted = Notification.permission === "granted";

        if (nottifPermGranted) {
            isSubscribed = await checkSubscriptionStatus(
                $userData,
                isSubscribed,
            );

            if (!isSubscribed) {
                if (!$userData.email) {
                } else {
                    userData.subscribe(async () => {
                        if (isSubscribed) return;
                        if (!$userData.email) {
                            await subscribeUser(isSubscribed, $userData);
                        }
                    });
                }
                {
                    await subscribeUser(isSubscribed, $userData);
                }
            }
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
        let res = await sendPush("testing", "test", $userData.id);
        console.log(res);
    }

    async function subtoChannel(channelname: string) {
        let pushKey = new RecordId("pushkey", $userData.id.toString());
        console.log(pushKey.toString());
        await db?.query(
            `relate ${pushKey} -> pushkey_channel -> ${channelname}`,
        );
    }
</script>

<div class="flex flex-col my-5">
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
        {#if isSubscribed}
            <div>
                <Button
                    class="button"
                    type="button"
                    variant="secondary"
                    on:click={() =>
                        subtoChannel("channels:2586ro4vrlfei4taz2zn")}
                    >Subscribe to the testing channel</Button
                >
                <Button
                    class="button"
                    type="button"
                    variant="secondary"
                    on:click={() => unsubscribe(isSubscribed)}
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
