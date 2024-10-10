<script lang="ts">
    import { Button } from "../lib/components/ui/button/index";
    import { getDb, initDb, signOut } from "../lib/db";
    import { onMount } from "svelte";
    import { ModeWatcher } from "mode-watcher";
    import "../app.css";
    import { page } from "$app/stores";
    import Sun from "svelte-radix/Sun.svelte";
    import Moon from "svelte-radix/Moon.svelte";
    import { toggleMode } from "mode-watcher";
    import { checkIsLoggedIn, isLoggedIn } from "./store";

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

    async function checkStatus() {
        let db = await getDb();
        if (!db) await initDb();
        if (db) checkIsLoggedIn(true);
    }

    onMount(() => {
        checkStatus();
    });
</script>

<ModeWatcher />
<nav
    class="flex flex-col w-full p-2 my-2 justify-start border-t-solid border-sky-500 items-center justify-between"
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
        {#if $isLoggedIn}
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
        {#if $isLoggedIn}
            <Button
                variant="link"
                on:click={async () => {
                    signOut();
                    checkIsLoggedIn(false);
                }}><span class="text-secondary-foreground">LOGOUT</span></Button
            >
        {/if}
        <Button on:click={toggleMode} variant="outline" size="icon">
            <Sun
                class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
            />
            <Moon
                class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
            />
            <span class="sr-only">Toggle theme</span>
        </Button>
    </div>
</nav>
<slot></slot>

<style>
    .logo {
        width: 10em;
        height: 1em;
        background-image: url(../lib/assets/Evia-Board.svg);
        background-size: contain;
        background-repeat: no-repeat;
        margin: 1em 2em;
        position: relative;
    }
    .logo:after {
        content: "";
        width: 100%;
        height: 100%;
        top: 0;
        position: absolute;
        background: inherit;
        filter: blur(20px);
        z-index: -1;
    }
</style>
