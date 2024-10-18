<script lang="ts">
    import * as Dialog from "../../lib/components/ui/dialog/index.js";
    import { db, type post } from "../../lib/db";
    import { Button } from "../../lib/components/ui/button/index.js";

    async function recoverPost(data: post) {
        let newData = data;
        newData.deleted = true;
        await db?.patch(data.id!, [
            {
                op: "replace",
                path: "/deleted",
                value: false,
            },
        ]);
    }

    export let recoverDialog: boolean;
    export let postToRecover: post | undefined;
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" || event.key === "Esc") recoverDialog = false;
    });
</script>

<Dialog.Root
    open={recoverDialog}
    onOpenChange={() => (recoverDialog = !recoverDialog)}
>
    <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header>
            <Dialog.Title>Really?</Dialog.Title>
            <Button
                variant="destructive"
                on:click={() => {
                    if (postToRecover) {
                        recoverPost(postToRecover);
                        recoverDialog = !recoverDialog;
                    }
                }}>Yes</Button
            >
            <Button
                on:click={() => {
                    recoverDialog = !recoverDialog;
                    postToRecover = undefined;
                }}>No</Button
            >
        </Dialog.Header>
    </Dialog.Content>
</Dialog.Root>
