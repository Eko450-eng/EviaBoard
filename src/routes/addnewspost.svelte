<script lang="ts">
import type { News, Newspost } from "@/types.js";
import { toast } from "svelte-sonner";
import { Button } from "../lib/components/ui/button/index.js";
import * as Dialog from "../lib/components/ui/dialog/index.js";
import { Input } from "../lib/components/ui/input/index.js";
import { Label } from "../lib/components/ui/label/index.js";
import { db } from "../lib/db";
import { userData } from "./store";

export let addPostOpen: boolean;
export let post: News | undefined;
export const postData: Newspost = {
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
				const newPost: Array<Array<Newspost>> = data as Newspost[][];
				const q = `RELATE ${post?.id} -> news_post -> ${newPost[0][0].id}`;
				await db?.query(q);
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
