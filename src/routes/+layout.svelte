<script lang="ts">
    import Links from "$lib/links.svelte";
    import Optionbuttons from "$lib/optionbuttons.svelte";
    import { getDb, initDb } from "../lib/db";
    import { onMount } from "svelte";
    import { ModeWatcher } from "mode-watcher";
    import "../app.css";
    import { checkIsLoggedIn, alertData } from "./store";
    import * as Alert from "$lib/components/ui/alert/index";

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

{#if $alertData.active}
    <div class="alert">
        <Alert.Root variant={$alertData.type}>
            <Alert.Title>{$alertData.title}</Alert.Title>
            <Alert.Description>{$alertData.message}</Alert.Description>
        </Alert.Root>
    </div>
{/if}

<div class="logo"></div>
<div class="mainview">
    <nav>
        <div class="spacebetween">
            <div>
                <Links />
            </div>
            <Optionbuttons />
        </div>
    </nav>
    <main>
        <slot></slot>
    </main>
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
    }

    nav {
        height: 100vh;
        display: flex;
        width: min-content;
        align-items: center;
        flex-direction: column;
        border-right: 1px solid teal;
        border-top: 1px solid teal;
        border-top-right-radius: 10px;
    }

    .mainview {
        display: flex;
        grid-template-columns: 1fr 10fr;
    }

    .spacebetween {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 90%;
    }
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

    .alert {
        position: absolute;
        right: 1em;
        width: 25%;
        z-index: 200000;
    }
</style>
