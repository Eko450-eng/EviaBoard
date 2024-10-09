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
        { type: "nologin", name: "login", value: "/login" },
        {
            type: "loggedin",
            name: "knowledgeboard",
            value: "/knowledgeboard",
        },
        {
            type: "loggedin",
            name: "download links",
            value: "/downloadlinks",
        },
    ];

    onMount(async () => {
        initDb();
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
        <Button variant="link" on:click={() => signOut()}
            ><span class="text-secondary-foreground">LOGOUT</span></Button
        >
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
