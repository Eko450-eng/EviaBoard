<script lang="ts">
import { Switch } from '$ui/switch';
import { Label } from '$ui/label';
import * as Card from '$ui/card';
import { Button } from '$ui/button';
import { Input } from '$ui/input';
import { fileUploadHandler } from '@/helpers/minio';
import { signOut } from '@/db';
import { toast } from 'svelte-sonner';
import { Icon } from 'svelte-icons-pack';
import {
	FaSolidArrowRightFromBracket,
	FaSolidEnvelope,
	FaSolidFireFlameCurved,
	FaSolidUser,
} from 'svelte-icons-pack/fa';
import {
	checkSubscriptionStatus,
	requestNotificationPermission,
	subscribeUser,
	unsubscribe,
	updateUser,
} from './functions';
import type { User } from '@/types';
import { goto, invalidateAll } from '$app/navigation';
import { changeAdminMode, userStore } from '@/stores/user.store';
import { adminOnly } from '@/helpers/admin';
import type { ChannelSubsCheckable } from './+page';
import { onMount } from 'svelte';
import { sendPush } from '@/helpers/push';
import { channelHandler } from './notifyFunctions';

let nottifPermGranted: boolean = $state(false);
let isSubscribed = $state(false);

async function subscribeHandler() {
	isSubscribed = await checkSubscriptionStatus($userStore!, isSubscribed);
	if (isSubscribed) return;
	subscribeUser(isSubscribed, $userStore!).then((subbed) => {
		if (subbed) {
			toast.error('Nice', {
				description: 'Spam incoming!',
			});
			isSubscribed = true;
		} else {
			toast.error('Oops', {
				description: 'Das hat nicht ganz funktioniert',
			});
		}
	});
}

onMount(async () => {
	nottifPermGranted = Notification.permission === 'granted';
	if (nottifPermGranted && $userStore) {
		isSubscribed = await checkSubscriptionStatus($userStore, isSubscribed);
	}
});

async function getSubState() {
	invalidateAll;
	isSubscribed = await checkSubscriptionStatus($userStore!, isSubscribed);
}

$effect(() => {
	if (nottifPermGranted && $userStore) {
		getSubState();
	}
});

async function sendPushHandler() {
	try {
		await sendPush('testing', 'test');
	} catch (e) {
		console.error(e);
	}
}

let user: User = {
	id: $userStore?.id,
	password: $userStore?.password ?? '',
	role: $userStore?.role ?? '',
	email: $userStore?.email ?? '',
	name: $userStore?.name ?? '',
	image: $userStore?.image ?? '',
};

let { data }: { data: { channel: ChannelSubsCheckable[] } } = $props();
let channels = $state(data.channel);

$effect(() => {
	channels = data.channel;
});

$effect(() => {
	$userStore;
	invalidateAll();
});

async function handleUpdateUser() {
	await updateUser($userStore as User, user).then(() => {
		toast.success('Yey', {
			description: 'User updated',
		});
	});
}
</script>

<div class="flex flex-col my-5">
    {#if $userStore?.role == "admin"}
        <Button variant="outline" onclick={changeAdminMode}
            >Adminmode: {adminOnly() ? "Activated" : "Disabled"}</Button
        >
    {/if}
</div>

<form onsubmit={handleUpdateUser}>
    <Card.Root>
        <Card.Title>
            <Card.Content>
                <h1>Profil Einstellungen</h1>
                <div class="flex justify-between">
                    <h1 class="text-2xl">{$userStore?.name}</h1>
                    <Button
                        class="mx-4"
                        onclick={async () => {
                            signOut().then((res) => {
                                if (res.error) {
                                    toast.error(res.title, {
                                        description: res.desc,
                                    });
                                } else {
                                    toast.success(res.title, {
                                        description: res.desc,
                                    });
                                    goto("/");
                                }
                            });
                        }}
                        variant="outline"
                        size="icon"
                    >
                        <Icon src={FaSolidArrowRightFromBracket} size={24} />
                    </Button>
                </div>
                <h3 class="text-xs mb-5">{$userStore?.role}</h3>
                <div class="flex flex-col gap-2">
                    <Label for="email" class="mb-1">E-Mail</Label>
                    <div class="flex items-center mb-5 gap-2">
                        <Icon src={FaSolidEnvelope} />
                        <Input
                            type="text"
                            name="email"
                            placeholder={$userStore?.email}
                            bind:value={user.email}
                        />
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <Label for="name">Username</Label>
                    <div class="flex items-center mb-5 gap-2">
                        <Icon src={FaSolidUser} />
                        <Input
                            type="text"
                            name="name"
                            placeholder={$userStore?.name}
                            bind:value={user.name}
                        />
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <Label for="image">Image</Label>
                    <div class="flex items-center mb-5 gap-2">
                        <Icon src={FaSolidFireFlameCurved}  />
                        <div class="flex gap-2 w-full">
                            <Input type="file" onchange={fileUploadHandler} />
                        </div>
                    </div>
                </div>
                <Button class="my-4" type="submit" variant="secondary">Speichern</Button>
            </Card.Content>
        </Card.Title>
    </Card.Root>
</form>

{#if channels}
    <h1 class="text-2xl mt-5">Notification Settings</h1>
    <Card.Root>
        <Card.Content>
            <div class="flex flex-col">
                {#if nottifPermGranted === null}
                    <p>Checking permissions...</p>
                {:else if nottifPermGranted === false}
                    <Button
                        variant="secondary"
                        class="button"
                        type="button"
                        onclick={() => {
                            requestNotificationPermission();
                            nottifPermGranted = Notification.permission === "granted";
                        }}>Enable notifications</Button
                    >
                {:else}
                    <p>Subscribed to push notifications: <b>{isSubscribed}</b></p>
                    {#if !isSubscribed && $userStore}
                        <Button
                            variant="secondary"
                            onclick={subscribeHandler}
                        >
                            Subscribe
                        </Button>
                    {/if}
                    {#if isSubscribed && $userStore}
                        <div class="flex flex-col mb-10">
                            <h2>Benachrichtigungen zu folgendem erhalten?</h2>
                            {#each channels as channel}
                                <div class="items-top flex space-x-2 my-1">
                                    <Switch
                                        id={channel.channelname}
                                        onCheckedChange={(v) => channelHandler(channel, v as boolean, $userStore?.id)}
                                        checked={channel.subbed ? channel.subbed.length > 0 ? true : false : false}
                                    />
                                    <div class="grid gap-1.5 leading-none">
                                        <Label
                                            for={channel.channelname}
                                            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {channel.channelname}
                                        </Label>
                                    </div>
                                </div>
                            {/each}
                        </div>
                        <div>
                            <Button
                                class="button"
                                type="button"
                                variant="secondary"
                                onclick={() => {
                                    unsubscribe(isSubscribed, $userStore);
                                    isSubscribed = false;
                                }}>Unsubscribe from everything</Button
                            >
                            hello
                        </div>
                    {/if}
                {/if}
            </div>
        </Card.Content>
    </Card.Root>

    {#if adminOnly()}
        <Button class="my-2" onclick={sendPushHandler} variant="secondary"
            >test</Button
        >
    {/if}
{/if}
