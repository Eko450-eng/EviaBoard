<script lang="ts">
import { Switch } from '$ui/switch';
import { Label } from '$ui/label';
import * as Card from '$ui/card';
import { Button } from '$ui/button';
import { Input } from '$ui/input';
import { fileUploadHandler, generateAvatar } from '@/helpers/minio';
import { toast } from 'svelte-sonner';
import { Icon } from 'svelte-icons-pack';
import {
	FaSolidEnvelope,
	FaSolidFireFlameCurved,
	FaSolidKey,
	FaSolidUser,
} from 'svelte-icons-pack/fa';
import {
	checkSubscriptionStatus,
	requestNotificationPermission,
	subscribeUser,
	unsubscribe,
} from './functions';
import type { ChannelsWithSub, User } from '@/types';
import { goto } from '$app/navigation';
import { adminModeVal, userStore } from '@/stores/userstore';
import { adminOnly } from '@/helpers/admin';
import { onMount } from 'svelte';
import { sendPush } from '@/helpers/push';
import { channelHandler } from './notifyFunctions';

let nottifPermGranted: boolean = $state(false);
let isSubscribed = $state(false);
let channelsList = $state<ChannelsWithSub[]>([]);
$effect(() => {
	console.log(channelsList);
});

let user: User = $state({
	id: $userStore?.id,
	password: '',
	role: $userStore?.role ?? 0,
	email: $userStore?.email ?? '',
	name: $userStore?.name ?? '',
	image: $userStore?.image ?? '',
});

let confirmPassword = $state('');

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

		if ('serviceWorker' in navigator) {
			const registration = await navigator.serviceWorker.ready;
			const subscription = await registration.pushManager.getSubscription();
			const endpoint = subscription?.endpoint;

			await fetch(`/api/user`, {
				method: 'POST',
				body: JSON.stringify({ endpoint, user }),
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
			}).then(async (res) => {
				let { channel } = await res.json();
				channelsList = channel;
			});
		} else {
			goto('/', { replaceState: true });
		}
	}
});

async function sendPushHandler() {
	try {
		await sendPush('testing', 'test');
	} catch (e) {
		console.error(e);
	}
}

async function handleUpdateUser() {
	if (!$userStore) {
		toast.error('Du bist nicht angemeldet', {
			description: 'bitte einmal auf die Home Page und zurück gehen',
		});
		return;
	}
	let id = $userStore.id;
	await generateAvatar($userStore);
	await fetch(`/api/user/update`, {
		method: 'POST',
		body: JSON.stringify({ user, id, confirmPassword }),
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
	}).then(async (res) => {
		let response = await res.json();
		if (res.status === 200) {
			toast.success(response.title, { description: response.description });
		} else {
			toast.error(response.title, { description: response.description });
		}
	});
}

async function handleChannelSub(channel: any, state: boolean) {
	await channelHandler(channel, state, $userStore?.id).then(async (res) => {
		if (!res) return;
		let response = await res.json();
		if (res.status === 200) {
			toast.success(response.title, { description: response.description });
		} else {
			toast.error(response.title, { description: response.description });
		}
	});
}
</script>

<div class="flex flex-col my-5"> 
    {#if $userStore && $userStore.role >= 10}  
        <Button variant="outline" onclick={()=>adminModeVal.set(!adminModeVal)} > 
            Adminmode: {adminModeVal ? "Activated" : "Disabled"} 
        </Button>  
    {/if}  
</div> 

<form onsubmit={handleUpdateUser}>
    <Card.Root>
        <Card.Title>
            <Card.Content>
                <h1>Profil Einstellungen</h1>
                <div class="flex justify-between">
                    <h1 class="text-2xl">{$userStore?.name}</h1>
                    <!--<Button
                        class="mx-4"
                        onclick={async () => {
                            signOut().then((res) => {
                                if (res.error) {
                                    toast.error(res.title, {
                                        description: res.desc,
                                    });
                                } else {
                                    goto("/", { replaceState: true });
                                    toast.success(res.title, {
                                        description: res.desc,
                                    });
                                }
                            });
                        }}
                        variant="outline"
                        size="icon"
                    >
                        <Icon src={FaSolidArrowRightFromBracket} size={24} />
</Button>-->
                </div>
                <div class="flex flex-col gap-2">
                    <Label for="email" class="mb-1">E-Mail</Label>
                    <div class="flex items-center mb-5 gap-2">
                        <Icon src={FaSolidEnvelope} />
                        <Input
                            disabled
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
                            disabled
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
                            <Input
                                disabled
                                type="file" onchange={fileUploadHandler} />
                        </div>
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <Label for="name">Password</Label>
                    <div class="flex items-center mb-5 gap-2">
                        <Icon src={FaSolidKey} />
                        <Input
                            disabled
                            type="password"
                            name="name"
                            placeholder="Neues Passwort"
                            bind:value={user.password}
                        />
                    </div>
                    <div class="flex items-center mb-5 gap-2">
                        <Icon src={FaSolidKey} />
                        <Input
                            disabled
                            type="password"
                            name="name"
                            placeholder="Passwort bestätigen"
                            bind:value={confirmPassword}
                        />
                    </div>
                </div>
                <Button class="my-4" type="submit" variant="secondary">Speichern</Button>
            </Card.Content>
        </Card.Title>
    </Card.Root>
</form>

{#if channelsList}
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
                            {#each channelsList as channel}
                                <div class="items-top flex space-x-2 my-1">
                                    <Switch
                                        id={channel.channelname}
                                        onCheckedChange={(v)=>handleChannelSub(channel, v as boolean)}
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
