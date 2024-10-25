<script lang="ts">
    import {
        adminMode,
        changeAdminMode,
        checkIsLoggedIn,
        userData,
    } from "../store";
    import { Label } from "$ui/label";
    import { Button } from "$ui/button";
    import { Input } from "$ui/input";
    import { fileUploadHandler } from "@/helpers/minio";
    import { signOut } from "@/db";
    import { toast } from "svelte-sonner";
    import { Icon } from "svelte-icons-pack";
    import { FaSolidArrowRightFromBracket } from "svelte-icons-pack/fa";
    import { onMount } from "svelte";
    import { updateUser } from "./functions";
    import type { User } from "@/types";
    import PushPage from "./push-page.svelte";
    import { goto } from "$app/navigation";

    let user: User = {
        id: $userData.id,
        password: $userData.password,
        role: $userData.role,
        email: $userData.email,
        name: $userData.name,
        image: $userData.image,
    };

    onMount(async () => {});

    async function handleUpdateUser() {
        await updateUser($userData, user).then(() => {
            toast.success("Yey", {
                description: "User updated",
            });
        });
    }
</script>

<div class="flex flex-col my-5">
    {#if $userData.role === "admin"}
        <Button variant="outline" on:click={changeAdminMode}
            >Adminmode: {$adminMode ? "Activated" : "Disabled"}</Button
        >
    {/if}
</div>

<form on:submit={handleUpdateUser}>
    <div class="flex justify-between">
        <h1 class="text-2xl">{$userData.name}</h1>
        <Button
            class="mx-4"
            on:click={async () => {
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
                        checkIsLoggedIn(true);
                    }
                });
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

<h1 class="text-2xl mt-5">Notification Settings</h1>
<PushPage />
