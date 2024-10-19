<script lang="ts">
    import * as Dialog from "../../../lib/components/ui/dialog/index.js";
    import { db, type post } from "../../../lib/db";
    import { toast } from "svelte-sonner";
    import { Button } from "../../../lib/components/ui/button/index.js";
    import { Label } from "../../../lib/components/ui/label/index.js";
    import { Input } from "../../../lib/components/ui/input/index.js";
    import { Textarea } from "../../../lib/components/ui/textarea";

    export let editPostOpen: boolean;
    export let postData: post;

    async function editPost() {
        try {
            if (!postData) return;
            await db?.patch(postData.id, [
                    {
                        op: "replace",
                        path: "/deleted",
                        value: postData.deleted,
                    },
                    { op: "replace", path: "/title", value: postData.title },
                    { op: "replace", path: "/body", value: postData.body },
                    {
                        op: "replace",
                        path: "/solution",
                        value: postData.solution,
                    },
                ])
                .then(() => (editPostOpen = false));
        } catch (e) {
            console.error(e);
            toast.error("Fehler", {
                description: `This failed due to: ${e}, probably not my fault`,
            });
        }
    }

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" || event.key === "Esc") editPostOpen = false;
    });
</script>

<Dialog.Root
    open={editPostOpen}
    onOpenChange={() => (editPostOpen = !editPostOpen)}
>
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
            <div>
                <Label for="body" class="text-right">Beschreibung</Label>
                <Textarea
                    id="body"
                    bind:value={postData.body}
                    class="col-span-3"
                />
            </div>
            <div>
                <Label for="solution" class="text-right">Lösung</Label>
                <Textarea
                    id="solution"
                    bind:value={postData.solution}
                    class="col-span-3"
                />
            </div>
        </div>
        <Dialog.Footer>
            <Button type="submit" on:click={editPost}>Posten</Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
