<script lang="ts">
    import { onMount, tick } from "svelte";
    import * as Command from "../../lib/components/ui/command/index.js";
    import * as Popover from "../../lib/components/ui/popover/index.js";
    import * as Card from "../../lib/components/ui/card/index.js";
    import { Button } from "../../lib/components/ui/button/index.js";
    import { getDb, getPost, getTopics, initDb } from "../../lib/db";
    import type Surreal from "surrealdb";
    import { env } from "$env/dynamic/public";
    import { Label } from "@/components/ui/label/index.js";
    import Input from "@/components/ui/input/input.svelte";

    let NS = env.PUBLIC_DB_NS;
    let DB = env.PUBLIC_DB_DB;
    let ROOT_USER = env.PUBLIC_DB_ROOT_NAME;
    let ROOT_PW = env.PUBLIC_DB_ROOT_PW;

    type topic = {
        name: string;
    };

    const topics = [
        {
            value: "datev",
            label: "Datev",
        },
        {
            value: "eom",
            label: "EOM",
        },
        {
            value: "invoice",
            label: "Invoice",
        },
        {
            value: "contract",
            label: "Contract",
        },
        {
            value: "workflows",
            label: "Workflows",
        },
    ];

    let open = false;
    let value = "";

    $: selectedValue =
        topics.find((f) => f.value === value)?.label ?? "Select a Topic";

    function closeAndFocusTrigger(triggerId: string) {
        open = false;
        tick().then(() => {
            document.getElementById(triggerId)?.focus();
        });
    }

    type post = {
        title: string;
        body: string;
        topic: topic;
    };

    let posts: post[] = [];
    let topicsList: any;

    export async function getTo() {
        initDb();
        let db: Surreal | undefined = getDb();
        if (!db) return;
        await db.connect(env.PUBLIC_DB_HOST, {
            namespace: NS,
            database: DB,
            auth: {
                username: ROOT_USER,
                password: ROOT_PW,
            },
        });
        let posts = await db?.select("post_topic");
        return posts;
    }

    export async function getT(id: string) {
        initDb();
        let db: Surreal | undefined = getDb();
        if (!db) return;
        await db.connect(env.PUBLIC_DB_HOST, {
            namespace: NS,
            database: DB,
            auth: {
                username: ROOT_USER,
                password: ROOT_PW,
            },
        });
        let posts = await db?.select(id);
        return posts;
    }

    onMount(async () => {
        posts = (await getPost()) as unknown as post[];
        topicsList = await getTopics();
        let po = await getTo();
    });
</script>

<h1>Knowledgebase</h1>
<div class="p-4">
    <Popover.Root bind:open let:ids>
        <Popover.Trigger asChild let:builder>
            <Button
                builders={[builder]}
                variant="outline"
                role="combobox"
                aria-expanded={open}
                class="w-[200px] justify-between"
            >
                {selectedValue}
            </Button>
        </Popover.Trigger>
        <Popover.Content class="w-[200px] p-0">
            <Command.Root>
                <Command.Input placeholder="Search topics" class="h-9" />
                <Command.Empty>No framework found.</Command.Empty>
                <Command.Group>
                    {#each topics as topic}
                        <Command.Item
                            value={topic.value}
                            onSelect={(currentValue) => {
                                value = currentValue;
                                closeAndFocusTrigger(ids.trigger);
                            }}
                        >
                            {topic.label}
                        </Command.Item>
                    {/each}
                </Command.Group>
            </Command.Root>
        </Popover.Content>
    </Popover.Root>

    {#each posts as post}
        <Card.Root class="my-2 w-[350px]">
            <Card.Header>
                <Card.Title>{post.title}</Card.Title>
                <Card.Description>{post.topic}</Card.Description>
            </Card.Header>
            <Card.Content>
                <form>
                    <div class="grid w-full items-center gap-4">
                        <div class="flex flex-col space-y-1.5">
                            <p>{post.body}</p>
                        </div>
                    </div>
                </form>
            </Card.Content>
            <!-- <Card.Footer class="flex justify-between"> -->
            <!--     <Button variant="outline">Cancel</Button> -->
            <!--     <Button>Deploy</Button> -->
            <!-- </Card.Footer> -->
        </Card.Root>
    {/each}
</div>
