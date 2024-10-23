<script lang="ts">
    import {
        Button,
        buttonVariants,
    } from "../../lib/components/ui/button/index.js";
    import { db, getDb } from "$lib/db";
    import { onMount } from "svelte";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import Plus from "svelte-radix/Plus.svelte";
    import Label from "@/components/ui/label/label.svelte";
    import Input from "@/components/ui/input/input.svelte";
    import { RecordId } from "surrealdb";
    import { userData } from "../store.js";
    import type { Downloadlinks } from "@/types.js";
    import { editorOnly } from "@/helpers/admin.js";

    let downloadlinks: Array<Downloadlinks> = [];

    async function getLinks() {
        let dl = await db?.select<Downloadlinks>("downloadlinks");
        if (dl) {
            downloadlinks = dl;
        }
    }

    let dialogOpen = false;

    let postData: Downloadlinks = {
        id: new RecordId("", ""),
        name: "Name",
        description: "Kurze Beschreibung!",
        link: "https://....",
        owner: { id: "", name: "", tb: "" },
    };

    async function deleteLink(id: RecordId) {
        await db?.delete(id);
    }

    let user_id = $userData.id;

    async function postLinks() {
        await db
            ?.query(
                ` CREATE downloadlinks CONTENT{
            name:  "${postData.name}",
            description:  "${postData.description}",
            link:  "${postData.link}",
            owner: ${user_id},
        }`,
            )
            .then(() => {
                dialogOpen = false;
            });
    }

    onMount(async () => {
        await getDb();
        if (db && db.ready) {
            getLinks();
            const queryUuid = await db?.live(
                "downloadlinks",
                (action, _result) => {
                    if (action === "CLOSE") return;
                },
            );
            await db?.subscribeLive(queryUuid!, async (action, _result) => {
                if (
                    action === "CREATE" ||
                    action === "UPDATE" ||
                    action === "DELETE"
                ) {
                    getLinks();
                }
            });
        }
    });
</script>

<div class="flex flex-wrap items-center justify-end">
    <Dialog.Root open={dialogOpen}>
        {#if editorOnly($userData)}
            <Dialog.Trigger class={buttonVariants({ variant: "outline" })}>
                <Plus />
            </Dialog.Trigger>
        {/if}
        <Dialog.Content class="sm:max-w-[425px]">
            <Dialog.Header>
                <Dialog.Title>Add post</Dialog.Title>
                <Dialog.Description>
                    Trage zur Knowledgebase bei!
                </Dialog.Description>
            </Dialog.Header>
            <div class="grid gap-4 py-4">
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="title" class="text-right">Name</Label>
                    <Input
                        id="title"
                        bind:value={postData.name}
                        class="col-span-3"
                    />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="body" class="text-right">Beschreibung</Label>
                    <Input
                        id="body"
                        bind:value={postData.description}
                        class="col-span-3"
                    />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="solution" class="text-right">Link</Label>
                    <Input
                        id="solution"
                        bind:value={postData.link}
                        class="col-span-3"
                    />
                </div>
            </div>
            <Dialog.Footer>
                <Button type="submit" on:click={postLinks}>Posten</Button>
            </Dialog.Footer>
        </Dialog.Content>
    </Dialog.Root>
</div>

<div>
    {#each downloadlinks as link}
        <div class="flex flex-wrap w-full justify-between my-2">
            <Button variant="link" href={link.link} target="_blank">
                <h1>{link.name}</h1>
                <p>{link.description}</p>
            </Button>
            {#if $userData.id && link.owner.tb + ":" + link.owner.id == $userData.id.toString()}
                <Button
                    variant="destructive"
                    on:click={() => {
                        if (link && link.id) deleteLink(link.id);
                    }}>Delete</Button
                >
            {/if}
        </div>
    {/each}
</div>
