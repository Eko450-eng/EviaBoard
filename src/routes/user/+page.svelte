<script lang="ts">
import { Label } from '$ui/label';
import { Button } from '$ui/button';
import { Input } from '$ui/input';
import { fileUploadHandler } from '@/helpers/minio';
import { signOut } from '@/db';
import { toast } from 'svelte-sonner';
import { Icon } from 'svelte-icons-pack';
import { FaSolidArrowRightFromBracket } from 'svelte-icons-pack/fa';
import { onMount } from 'svelte';
import { updateUser } from './functions';
import type { User } from '@/types';
import PushPage from './push-page.svelte';
import { goto } from '$app/navigation';
import { changeAdminMode, userStore } from '@/stores/user.store';
import { adminOnly } from '@/helpers/admin';

let user: User = {
	id: $userStore?.id,
	password: $userStore?.password ?? '',
	role: $userStore?.role ?? '',
	email: $userStore?.email ?? '',
	name: $userStore?.name ?? '',
	image: $userStore?.image ?? '',
};

onMount(async () => {
	if (!$userStore?.email) goto('/');
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
    {#if adminOnly()}
        <Button variant="outline" onclick={changeAdminMode}
            >Adminmode: {adminOnly() ? "Activated" : "Disabled"}</Button
        >
    {/if}
</div>

<form on:submit={handleUpdateUser}>
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
    <Label for="email">E-Mail</Label>
    <Input
        type="text"
        name="email"
        placeholder={$userStore?.email}
        bind:value={user.email}
    />
    <Label for="name">Username</Label>
    <Input
        type="text"
        name="name"
        placeholder={$userStore?.name}
        bind:value={user.name}
    />
    <Label for="image">Image</Label>

    <div class="flex gap-2">
        <Input type="file" onchange={fileUploadHandler} />
    </div>
    <Button class="my-4" type="submit" variant="secondary">Speichern</Button>
</form>

<h1 class="text-2xl mt-5">Notification Settings</h1>
<PushPage />
