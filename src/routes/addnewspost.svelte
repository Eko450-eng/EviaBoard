<script lang="ts">
    import * as Dialog from "../lib/components/ui/dialog/index.js";
    import { db } from "../lib/db";
    import { toast } from "svelte-sonner";
    import { Button } from "../lib/components/ui/button/index.js";
    import { Label } from "../lib/components/ui/label/index.js";
    import { Input } from "../lib/components/ui/input/index.js";
    import { userData } from "./store";
    import type { News, Newspost } from "@/types.js";

    export let addPostOpen: boolean;
    export let post: News | undefined;
    export let postData: Newspost = {
        name: "",
        owner: $userData,
    };

    async function addPost() {
        try {
            if (!postData) return;
            await db
                ?.query(
                    `
                    CREATE newspost CONTENT{ 
                        name:  "${postData.name}", 
                        owner: ${$userData.id}, 
                    }
                    `,
                )
                .then(async (data) => {
                    let newPost: Array<Array<Newspost>> = data as Newspost[][];
                    let q = `RELATE ${post?.id} -> news_post -> ${newPost[0][0].id}`;
                    await db?.query(q);
                    console.log(newPost);
                    addPostOpen = false;
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
    <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header>
            <Dialog.Title>Post beitragen</Dialog.Title>
            <Dialog.Description>
                Trage zur Knowledgebase bei!
            </Dialog.Description>
        </Dialog.Header>
        <div class="grid gap-4 py-4">
            <form on:submit={addPost}>
                <div>
                    <Label for="title" class="text-right">Titel</Label>
                    <Input
                        id="title"
                        bind:value={postData.name}
                        class="col-span-3"
                    />
                </div>
                <Dialog.Footer>
                    <Button type="submit">Posten</Button>
                </Dialog.Footer>
            </form>
        </div>
    </Dialog.Content>
</Dialog.Root>
