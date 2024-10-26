<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import { Icon } from "svelte-icons-pack";
    import { FaSolidPencil } from "svelte-icons-pack/fa";
    import { goto } from "$app/navigation";
    import * as Alert from "$lib/components/ui/alert/index.js";
    import { FiAlertTriangle } from "svelte-icons-pack/fi";
    import { userData } from "../../store.js";
    import Comments from "./comment-view.svelte";
    import Idview from "@/components/mycomp/idview.svelte";
    import AvatarBar from "@/components/mycomp/avatar.svelte";
    import CartaRender from "@/components/mycomp/cartarender.svelte";

    let { data } = $props();
</script>

{#if data.posts}
    {#each data.posts as post}
        <div class="flex flex-col w-full">
            <h1
                class="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
            >
                {#if $userData.id == post.owner.id.toString()}
                    <Button
                        variant="outline"
                        on:click={() => goto(`/knowledgeboard/${post.id}/edit`)}
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
            <div
                class="flex flex-col justify-between my-5 [&:not(:first-child)]:mt-6"
            >
                <p class="text-sm text-gray-500">Beschreibung</p>
                <CartaRender text={post.body} />
            </div>
            <div
                class="flex flex-col justify-between my-5 [&:not(:first-child)]:mt-6"
            >
                <p class="text-sm text-gray-500">Lösung</p>
                {#if post.solution}
                    <CartaRender text={post.solution} />
                {:else}
                    <p>Der Autor hat keine Lösung angegeben</p>
                {/if}
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
    {/each}
{/if}
