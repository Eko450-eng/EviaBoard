<script lang="ts">
import AvatarBar from "$lib/components/mycomp/avatar.svelte";
import { Button } from "$lib/components/ui/button/index";
import { Skeleton } from "$ui/skeleton";
import { db } from "@/db";
import { adminOnly } from "@/helpers/admin";
import { formatDate } from "@/helpers/formating";
import type { News, News_newspost } from "@/types";
import type { Uuid } from "surrealdb";
import { onMount } from "svelte";
import { Icon } from "svelte-icons-pack";
import { FaCalendarDays } from "svelte-icons-pack/fa";
import Addnews from "./addnews.svelte";
import Addnewspost from "./addnewspost.svelte";
import { adminMode, userData } from "./store";

let news: News_newspost[];

async function loadData() {
	const query =
		"SELECT *, owner.name, owner.image, -> news_post.out.* as newspost from news ORDER BY date desc";

	const data = await db?.query<Array<Array<News_newspost>>>(query);

	if (!data) return;
	const d = data[0];
	news = d;
}

async function subscribeNews(queryUuid: Uuid | undefined) {
	if (!queryUuid) return;
	// eslint-disable-next-line
	await db?.subscribeLive(queryUuid!, async (action, _result) => {
		if (action === "CREATE" || action === "UPDATE" || action === "DELETE") {
			await loadData();
		}
	});
}

onMount(async () => {
	await loadData();
	// eslint-disable-next-line
	const queryUuidNews = await db?.live("news", (action, _result) => {
		if (action === "CLOSE") return;
	});
	const queryUuidNewsPost = await db?.live(
		"newspost",
		// eslint-disable-next-line
		(action, _result) => {
			if (action === "CLOSE") return;
		},
	);
	const queryUuidNewsPostRelation = await db?.live(
		"news_post",
		// eslint-disable-next-line
		(action, _result) => {
			if (action === "CLOSE") return;
		},
	);

	subscribeNews(queryUuidNews);
	subscribeNews(queryUuidNewsPost);
	subscribeNews(queryUuidNewsPostRelation);
});

let addPostOpen = false;
let addNewsPostOpen = false;
let selectedPost: News | undefined;
</script>

{#if adminOnly($userData, $adminMode)}
    <Addnews bind:addPostOpen />
{/if}
<Addnewspost bind:addPostOpen={addNewsPostOpen} post={selectedPost} />

{#if news}
    {#each news as post}
        <div class="border rounded my-2 py-2">
            <div class="flex justify-between">
                <h2 class="text-2xl p-2">{post.title}</h2>
                {#if adminOnly($userData, $adminMode)}
                    <Button
                        aria-label="Add a post"
                        on:click={() => {
                            if (!adminOnly($userData, $adminMode)) return;
                            selectedPost = post;
                            addNewsPostOpen = true;
                        }}>Add post</Button
                    >
                {/if}
            </div>
            <div class="flex flex-col">
                <p class="p-2 text-blue-200">
                    <span class="flex items-center gap-2">
                        <Icon src={FaCalendarDays} size={15} />
                        {formatDate(post.date)}
                    </span>
                </p>
                <ul class="feature-description-list-item list-disc">
                    {#each post.newspost as entry}
                        <li>
                            {entry.name}
                        </li>
                    {/each}
                </ul>
            </div>
            <AvatarBar user={post.owner} />
        </div>
    {/each}
{:else}
    <div class="flex items-center space-x-4">
        <div class="space-y-2 w-full">
            <Skeleton class="h-4 w-4/5 rounded-full" />
            <Skeleton class="h-4 w-2/5 rounded-full" />
            <Skeleton class="h-4 w-3/5 rounded-full" />
        </div>
    </div>
{/if}

<style>
    ul {
        margin-inline: 1rem;
        padding-inline: 1rem;
    }

    .main-feature-list-item {
        list-style-type: disc;
    }

    .main-feature-list-item > ul {
        list-style-type: circle;
    }
</style>
