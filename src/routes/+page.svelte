<script lang="ts">
    import { onMount } from "svelte";
    import { db } from "@/db";
    import Addnews from "./addnews.svelte";
    import type { News, News_newspost } from "@/types";
    import { formatDate } from "@/helpers/formating";
    import { adminMode, userData } from "./store";
    import Addnewspost from "./addnewspost.svelte";
    import type { Uuid } from "surrealdb";
    import { Button } from "$lib/components/ui/button/index";
    import { Icon } from "svelte-icons-pack";
    import { FaCalendarDays } from "svelte-icons-pack/fa";
    import AvatarBar from "$lib/components/mycomp/avatar.svelte";
    import { adminOnly } from "@/helpers/admin";

    let news: News_newspost[];

    async function loadData() {
        let query =
            "SELECT *, owner.name, owner.image, -> news_post.out.* as newspost from news ORDER BY date desc";

        let data = await db?.query<Array<Array<News_newspost>>>(query);

        if (!data) return;
        let d = data[0];
        news = d;
    }

    async function subscribeNews(queryUuid: Uuid | undefined) {
        if (!queryUuid) return;
        await db?.subscribeLive(queryUuid!, async (action, _result) => {
            if (
                action === "CREATE" ||
                action === "UPDATE" ||
                action === "DELETE"
            ) {
                await loadData();
            }
        });
    }

    onMount(async () => {
        await loadData();
        const queryUuidNews = await db?.live("news", (action, _result) => {
            if (action === "CLOSE") return;
        });
        const queryUuidNewsPost = await db?.live(
            "newspost",
            (action, _result) => {
                if (action === "CLOSE") return;
            },
        );
        const queryUuidNewsPostRelation = await db?.live(
            "news_post",
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
                        on:click={() => {
                            if (!adminOnly($userData, $adminMode)) return;
                            selectedPost = post;
                            addNewsPostOpen = true;
                        }}>Add post</Button
                    >
                {/if}
            </div>
            <div class="flex flex-col">
                <h2 class="text-1xl p-2 text-gray-500">
                    <span class="flex items-center gap-2">
                        <Icon src={FaCalendarDays} size={15} />
                        {formatDate(post.date)}
                    </span>
                </h2>
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
{/if}

<div>
    <h2 class="text-2xl p-2">Todos</h2>
    <ul class="main-feature-list-item">
        <li>Add Knowledgeboard - WIP</li>
        <li>Add Knowledgeboard addon - Scripts</li>
        <ul class="feature-description-list-item">
            <li>
                A collection of usefull code snippets that can be helpful and
                often get lost in our P: directory
            </li>
        </ul>
        <li>Add Knowledgeboard addon - Problematic fields</li>
        <ul class="feature-description-list-item">
            <li>
                Adds a statistic that shows in which fields the key issues for
                our team are, for example you could see here, if we were to have
                tons of tickets regarding Datev which might indicate a lack of
                knowledge in the topic datev and could be used to precisely talk
                about those issues
            </li>
        </ul>
        <li>Add XML Generator</li>
        <li>Add group file Generator</li>
        <li>Add Coma Structure Generator</li>
        <li>Add Invoice Process generator</li>
        <li>Prompt before Deleting</li>
        <li>Close Dialog when submited</li>
        <li>Add images to posts</li>
        <li>Design Changes</li>
        <li>
            Janky übersetzungen grade ziehen.... (An manchen Tagen bevorzuge ich
            es auf Deutsch zu schreiben on other days I rather write in English,
            this is also auffällig in meinen Notizen, muss ich mir echt mal
            abgewöhnen)
        </li>
    </ul>
</div>

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
