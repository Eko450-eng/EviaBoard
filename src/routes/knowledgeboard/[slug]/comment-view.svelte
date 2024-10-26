<script lang="ts">
import { page } from "$app/stores";
import AvatarBar from "$lib/components/mycomp/avatar.svelte";
import { Button } from "$lib/components/ui/button/index.js";
import * as Card from "$lib/components/ui/card/index.js";
import { Input } from "$lib/components/ui/input/index.js";
import { Label } from "$lib/components/ui/label/index.js";
import { db } from "@/db";
import { formatDate } from "@/helpers/formating";
import type { Comments, Post } from "@/types";
import type { RecordId, Uuid } from "surrealdb";
import { onMount } from "svelte";
import { userData } from "../../store.js";

let comments: Comments[] = [];
const message = "";

type CommentRelation = {
	comments: Comments[];
};

type Kb_comment = {
	id?: RecordId;
	in: Post;
	out: Comments;
};

async function fetchComments() {
	const query = `
            SELECT
                ->kb_comment.out[*].{
                    comment,
                    created_at,
                    id,
                    owner: owner.*
                } AS comments
            FROM posts WHERE id = ${$page.data.posts[0].id} `;

	await db?.query<Array<Array<CommentRelation>>>(query).then((value) => {
		comments = value[0][0].comments;
		comments.sort((a: Comments, b: Comments) => {
			const dateA = new Date(a.created_at!).getTime();
			const dateB = new Date(b.created_at!).getTime();
			return dateB - dateA;
		});
	});
}

async function subscribeComments(queryUuid: Uuid | undefined) {
	if (!queryUuid) return;
	// eslint-disable-next-line
	await db?.subscribeLive(queryUuid!, async (action, _result) => {
		if (action === "CREATE" || action === "UPDATE" || action === "DELETE") {
			setTimeout(async () => {
				await fetchComments();
			}, 500);
		}
	});
}

onMount(async () => {
	// eslint-disable-next-line
	const queryUuid = await db?.live("kbcomment", (action, _result) => {
		if (action === "CLOSE") return;
	});
	fetchComments();
	subscribeComments(queryUuid);
});

async function sendPost() {
	const createQuery = `CREATE kbcomment SET owner=${$userData.id}, comment='${message}', created_at = time::now();`;
	const comment = await db?.query<Array<Array<Comments>>>(createQuery);
	if (!comment) return;
	const relateQuery = `RELATE ${$page.data.posts[0].id} -> kb_comment -> ${comment[0][0].id}`;
	await db?.query<Array<Array<Kb_comment>>>(relateQuery);
}
</script>

<div>kommentare</div>
{#each comments as comment}
    <Card.Root class="my-1 w-full">
        <Card.Header>
            <Card.Title>
                <AvatarBar user={comment.owner} />
            </Card.Title>
        </Card.Header>
        <Card.Content>
            <div class="flex flex-col">
                <p class="text-m">{comment.comment}</p>
            </div>
            <Card.Description class="text-xs text-blue-200">
                <span class="flex items-center gap-2">
                    {formatDate(comment.created_at ?? new Date())}
                </span>
            </Card.Description>
        </Card.Content>
    </Card.Root>
{/each}

<form on:submit={sendPost}>
    <Label for="title" class="text-right">Nachricht</Label>
    <div class="flex gap-2">
        <Input id="title" bind:value={message} class="col-span-3" />
        <Button type="submit">Send</Button>
    </div>
</form>
