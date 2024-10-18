<script lang="ts">
    import type { post } from "@/db.js";
    import { Button } from "../../../lib/components/ui/button/index.js";
    import { Icon } from "svelte-icons-pack";
    import { FaSolidArrowLeft } from "svelte-icons-pack/fa";
    import { goto } from "$app/navigation";
    import * as Alert from "$lib/components/ui/alert/index.js";
    import { FiAlertTriangle } from "svelte-icons-pack/fi";

    export let data: { posts: post[] };

    let post = data.posts[0];
</script>

<div class="flex flex-col w-full">
    <h1
        class="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
    >
        <Button variant="outline" on:click={() => goto("/knowledgeboard")}>
            <Icon src={FaSolidArrowLeft} />
        </Button>
        {post.title}
        {#if post.deleted}
            <Alert.Root>
                <Icon src={FiAlertTriangle} />
                <Alert.Title>Heads up!</Alert.Title>
                <Alert.Description
                    >Dieser Post wurde gelöscht!</Alert.Description
                >
            </Alert.Root>
        {/if}
    </h1>
    <div class="flex flex-col justify-between my-5 [&:not(:first-child)]:mt-6">
        <p class="text-sm text-gray-500">Beschreibung</p>
        <p class="leading-7">{post.body}</p>
    </div>
    <div class="flex flex-col justify-between my-5 [&:not(:first-child)]:mt-6">
        <p class="text-sm text-gray-500">Lösung</p>
        <p class="leading-7">
            {post.solution
                ? post.solution
                : "Der Autor hat keine Lösung angegeben"}
        </p>
    </div>
    <div
        class="flex flex-col justify-between my-5 border-t text-sm text-gray-500"
    >
        <p>Kategorie: {post.topic}</p>
        <p>Autor: {post.owner.name}</p>
    </div>
</div>
