<script lang="ts">
    import * as Select from "$lib/components/ui/select/index.js";
    import { db } from "$lib/db";
    import { toast } from "svelte-sonner";
    import { Button } from "$lib/components/ui/button/index.js";
    import { userData } from "../../store.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import type { Post, Topic } from "@/types.js";
    import { sendPush } from "@/helpers/push.js";
    import Cartaeditor from "@/components/mycomp/cartaeditor.svelte";

    let { data } = $props();
    let selectedTopic: any = $state();
    let topics: Topic[] = $state([]);

    let postData: Post = $state({
        deleted: false,
        title: "",
        body: "",
        solution: "",
        owner: { id: "", name: "" },
        topic: "",
    });

    $effect(() => {
        topics = data.topics as Topic[];
    });

    async function addPost() {
        let topic = `topics:${selectedTopic}`;
        postData.topic = topic;

        if (postData.topic === "") {
            toast.error("Fehler", {
                description: "Kategorie nicht vergessen!",
            });
            return;
        }
        try {
            if (!postData) return;
            await db
                ?.query(
                    ` CREATE posts CONTENT{
            title:  "${postData.title}",
            deleted:  ${postData.deleted},
            body:  "${postData.body}",
            solution:  "${postData.solution}",
            owner: ${$userData.id},
            topic: ${topic},
            created_at: d"${new Date().toISOString()}"
        }`,
                )
                .then(() => {
                    sendPush("New Posts", "Es gab einen neuen Post!");
                });
        } catch (e) {
            toast.error("Fehler", {
                description: `This failed due to: ${e}, probably not my fault`,
            });
        }
    }
</script>

<h1>Post beitragen</h1>
<p>Trage zur Knowledgebase bei!</p>
<div class="grid gap-4 py-4">
    <div>
        <Label for="title" class="text-right">Titel</Label>
        <Input id="title" bind:value={postData.title} class="col-span-3" />
    </div>
    <div>
        <Label for="body" class="text-right">Beschreibung</Label>
        <Cartaeditor bind:text={postData.body} />
    </div>
    <div>
        <Label for="solution" class="text-right">Lösung</Label>
        <Cartaeditor bind:text={postData.solution} />
    </div>
    <Select.Root
        selected={selectedTopic}
        onSelectedChange={(v) => {
            v && (selectedTopic = v.value);
        }}
    >
        <Select.Trigger class="w-[180px]">
            <Select.Value
                placeholder={selectedTopic == "" ? "Kategorie" : selectedTopic}
            />
        </Select.Trigger>
        <Select.Content>
            <Select.Group>
                <Select.Label>Themen</Select.Label>
                {#if topics}
                    {#each topics as topic}
                        <Select.Item value={topic.name} label={topic.name}
                            >{topic.name}</Select.Item
                        >
                    {/each}
                {/if}
            </Select.Group>
        </Select.Content>
        <Select.Input name="selectedTopic" />
    </Select.Root>
</div>
<Button type="submit" on:click={addPost}>Posten</Button>
