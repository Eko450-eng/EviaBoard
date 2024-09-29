<script lang="ts">
    import { Button } from "../lib/components/ui/button/index";
    import { initDb, signOut } from "../lib/db";
    import { onMount } from "svelte";
    import { ModeWatcher } from "mode-watcher";
    import "../app.css";
    import { page } from "$app/stores";

    type link = {
        type: string;
        name: string;
        value: string;
    };

    let links: Array<link> = [
        { type: "default", name: "home", value: "/" },
        { type: "notauthenicated", name: "login", value: "/login" },
        {
            type: "authenticated",
            name: "knowledgeboard",
            value: "/knowledgeboard",
        },
        {
            type: "authenticated",
            name: "download links",
            value: "/downloadlinks",
        },
    ];

    onMount(() => {
        initDb();
    });
</script>

<ModeWatcher />
<nav
    class="flex w-full p-2 justify-start border-t-solid border-sky-500 items-center justify-between"
>
    <h1 class="text-3xl p-2">Evia-Board</h1>
    <div>
        {#each links as link}
            <Button variant="link" href={link.value}
                ><span
                    class={$page.url.pathname === link.value
                        ? "text-muted-foreground"
                        : "text-secondary-foreground"}
                    >{link.name.toUpperCase()}</span
                ></Button
            >
        {/each}
        <Button variant="link" on:click={() => signOut()}
            ><span class="text-secondary-foreground">LOGOUT</span></Button
        >
    </div>
</nav>
<slot></slot>
