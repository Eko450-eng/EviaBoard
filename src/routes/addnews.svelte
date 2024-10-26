<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { db } from "../lib/db";
    import { toast } from "svelte-sonner";
    import {
        Button,
        buttonVariants,
    } from "../lib/components/ui/button/index.js";
    import Plus from "svelte-radix/Plus.svelte";
    import { Label } from "../lib/components/ui/label/index.js";
    import { Input } from "../lib/components/ui/input/index.js";
    import type { News } from "@/types";
    import { userData } from "./store";
    import { sendPush } from "@/helpers/push";

    export let addPostOpen: boolean;
    export let postData: News = {
        title: "",
        owner: $userData.id!,
        date: new Date(),
    };

    async function addPost() {
        try {
            if (!postData) return;
            await db
                ?.query(
                    `
                    CREATE news CONTENT{ 
                        title:  "${postData.title}", 
                        owner: ${$userData.id}, 
                    }
                    `,
                )
                .then(() => {
                    addPostOpen = false;
                    try {
                        sendPush("New News", `Brand neu! - ${postData.title}`);
                    } catch (e) {
                        console.error(e);
                    }
                });
        } catch (e) {
            console.error(e);
            toast.error("Fehler", {
                description: `This failed due to: ${e}, probably not my fault`,
            });
        }
    }
</script>

<Dialog.Root
    open={addPostOpen}
    onOpenChange={() => (addPostOpen = !addPostOpen)}
>
    <Dialog.Trigger class={buttonVariants({ variant: "outline" })}>
        <Plus />
    </Dialog.Trigger>
    <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header>
            <Dialog.Title>Post beitragen</Dialog.Title>
            <Dialog.Description>
                Trage zur Knowledgebase bei!
            </Dialog.Description>
        </Dialog.Header>
        <div class="grid gap-4 py-4">
            <div>
                <Label for="title" class="text-right">Titel</Label>
                <Input
                    id="title"
                    bind:value={postData.title}
                    class="col-span-3"
                />
            </div>
        </div>
        <Dialog.Footer>
            <Button type="submit" on:click={addPost}>Posten</Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
