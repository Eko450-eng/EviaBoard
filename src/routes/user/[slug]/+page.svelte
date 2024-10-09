<script lang="ts">
    import { onMount } from "svelte";
    import Reload from "svelte-radix/Reload.svelte";
    import { type user } from "../../../lib/db";
    import { getDb } from "../../../lib/db";
    import { Label } from "$lib/components/ui/label/index";
    import { Input } from "$lib/components/ui/input/index";
    import { Button } from "$lib/components/ui/button/index";
    import type Surreal from "surrealdb";

    let wip = true;

    export let data: {
        params: {
            slug: string;
        };
    };

    let user: user | undefined;
    let postData: user | undefined;
    let cpassword: string = "";
    let db: Surreal | undefined;

    async function getUserSettings() {
        const query = `SELECT * FROM user WHERE name='${data.params.slug}'`;
        db = await getDb();
        if (!db) return;
        let res = await db.query<user[][]>(query);
        user = res[0][0];
        postData = user;
    }

    async function updateUser() {
        if (!db || !user) return;
        db.update<user>(user.id, postData);
    }

    async function updatePassword() {}

    onMount(() => {
        getUserSettings();
    });
</script>

{#if !user}
    <p class="flex justify-center items-center">
        Loading...
        <Reload class="mr-2 h-4 w-4 animate-spin" />
    </p>
{:else if postData}
    <div class="px-10">
        <h1>Welcome {user?.name}</h1>
    </div>
    <form class="my-5 px-10" on:submit={updateUser}>
        <Label for="email" class="text-right">E-Mail</Label>
        <Input id="email" bind:value={postData.email} class="col-span-3" />
        <Label for="name" class="text-right">Name</Label>
        <Input id="name" bind:value={postData.name} class="col-span-3" />
        <Button class="my-5" type="submit">Save</Button>
    </form>
    {#if !wip}
        <form class="my-10 p-5" on:submit={updatePassword}>
            <Label for="pw" class="text-right">Password</Label>
            <Input id="pw" bind:value={postData.password} class="col-span-3" />

            <Label for="cpw" class="text-right">Confirm password</Label>
            <Input id="cpw" bind:value={cpassword} class="col-span-3" />
            <Button type="submit">Save</Button>
        </form>
    {/if}
{/if}
