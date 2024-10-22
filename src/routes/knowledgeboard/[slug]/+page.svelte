<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import { Icon } from "svelte-icons-pack";
    import { FaSolidArrowLeft, FaSolidPencil } from "svelte-icons-pack/fa";
    import { goto } from "$app/navigation";
    import * as Alert from "$lib/components/ui/alert/index.js";
    import { FiAlertTriangle } from "svelte-icons-pack/fi";
    import { userData } from "../../store.js";
    import EditPostDialog from "./edit-post.svelte";
    import Comments from "./comment-view.svelte";
    import DescriptionWithImage from "../description-with-image.svelte";
    import { onMount } from "svelte";
    import type { Post, Topic } from "@/types.js";
    import Idview from "@/components/mycomp/idview.svelte";
    import AvatarBar from "@/components/mycomp/avatar.svelte";

    export let data: { posts: Post[]; topics: Topic[] };

    let post = data.posts[0];
    let editPostOpen = false;
    onMount(() => {
        if (!data) {
            goto("/");
        }
    });
</script>

<EditPostDialog bind:editPostOpen postData={post} />
<div class="flex flex-col w-full">
    <h1
        class="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
    >
        <Button variant="outline" on:click={() => goto("/knowledgeboard")}>
            <Icon src={FaSolidArrowLeft} />
        </Button>
        {#if $userData.id == post.owner.id.toString()}
            <Button
                variant="outline"
                on:click={() => {
                    editPostOpen = true;
                }}
            >
                <Icon src={FaSolidPencil} />
            </Button>
        {/if}
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
        <DescriptionWithImage {post} clickable={true} />
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
        <AvatarBar user={post.owner} />
        {#if post.id}
            <Idview id={post.id} />
        {/if}
    </div>
</div>

<Comments />
