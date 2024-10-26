<script lang="ts">
import { Button } from "$lib/components/ui/button/index.js";
import * as Dialog from "$lib/components/ui/dialog/index.js";
import { db } from "$lib/db";
import type { Post } from "@/types";

async function deletePost(data: Post) {
	const newData = data;
	newData.deleted = true;
	await db?.patch(data.id!, [
		{
			op: "replace",
			path: "/deleted",
			value: true,
		},
	]);
}

export let deleteDialog: boolean;
export let postToDelete: Post | undefined;

document.addEventListener("keydown", (event) => {
	if (event.key === "Escape" || event.key === "Esc") deleteDialog = false;
});
</script>

<Dialog.Root
    open={deleteDialog}
    onOpenChange={() => (deleteDialog = !deleteDialog)}
>
    <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header>
            <Dialog.Title>Really?</Dialog.Title>
            <Button
                variant="destructive"
                on:click={() => {
                    if (postToDelete) {
                        deletePost(postToDelete);
                        deleteDialog = !deleteDialog;
                    }
                }}>Yes</Button
            >
            <Button
                on:click={() => {
                    deleteDialog = !deleteDialog;
                    postToDelete = undefined;
                }}>No</Button
            >
        </Dialog.Header>
    </Dialog.Content>
</Dialog.Root>
