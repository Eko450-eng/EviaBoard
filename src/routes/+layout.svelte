<script lang="ts">
    import { Button } from "../lib/components/ui/button/index";
    import { getDb, initDb, signOut } from "../lib/db";
    import { onMount } from "svelte";
    import { ModeWatcher } from "mode-watcher";
    import "../app.css";
    import { page } from "$app/stores";

    type link = {
        type: string;
        name: string;
        value: string;
    };

    let authenticatedLinks = [
        {
            name: "knowledgeboard",
            value: "/knowledgeboard",
        },
        {
            name: "download links",
            value: "/downloadlinks",
        },
    ];
    let unauthenticatedLinks = [
        { type: "nologin", name: "login", value: "/login" },
    ];
    let links = [{ name: "home", value: "/" }];

    let isLoggedIn = false;

    onMount(async () => {
        initDb();
        let db = await getDb();
        if (db) isLoggedIn = true;
    });
</script>

<ModeWatcher />
<nav
    class="flex w-full p-2 my-2 justify-start border-t-solid border-sky-500 items-center justify-between"
>
    <div class="logo"></div>
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
        {#if isLoggedIn}
            {#each authenticatedLinks as link}
                <Button variant="link" href={link.value}
                    ><span
                        class={$page.url.pathname === link.value
                            ? "text-muted-foreground"
                            : "text-secondary-foreground"}
                        >{link.name.toUpperCase()}</span
                    ></Button
                >
            {/each}
        {:else}
            {#each unauthenticatedLinks as link}
                <Button variant="link" href={link.value}
                    ><span
                        class={$page.url.pathname === link.value
                            ? "text-muted-foreground"
                            : "text-secondary-foreground"}
                        >{link.name.toUpperCase()}</span
                    ></Button
                >
            {/each}
        {/if}
        {#if isLoggedIn}
            <Button variant="link" on:click={() => signOut()}
                ><span class="text-secondary-foreground">LOGOUT</span></Button
            >
        {/if}
    </div>
</nav>
<slot></slot>

<style>
    .logo {
        width: 14em;
        height: 2em;
        background-image: url(../lib/assets/Evia-Board.svg);
        background-size: contain;
        background-repeat: no-repeat;
        margin: 1em 2em;
        position: relative;
    }
    .logo:after {
        content: "";
        width: 14em;
        height: 2em;
        top: 0;
        position: absolute;
        background: inherit;
        filter: blur(20px);
        z-index: -1;
    }
</style>
