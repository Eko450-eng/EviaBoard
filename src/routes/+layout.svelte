<script>
    import { Button } from "../lib/components/ui/button/index";
    import { initDb, user_token } from "../lib/db";
    import { onMount } from "svelte";
    import { ModeWatcher } from "mode-watcher";
    import "../app.css";
    import { page } from "$app/stores";

    let links = [
        { type: "default", name: "/todos" },
        { type: "default", name: "/" },
        { type: "no-login", name: "/login" },
        { type: "no-login", name: "/knowledgeboard" },
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
            {#if link.type === "no-login" && !user_token}
                <Button variant="link" href={link.name}
                    ><span
                        class={$page.url.pathname === link.name
                            ? "text-muted-foreground"
                            : "text-secondary-foreground"}
                        >{link.name === "/"
                            ? "HOME"
                            : link.name.replace("/", "").toUpperCase()}</span
                    ></Button
                >
            {/if}
        {/each}
    </div>
</nav>
<slot></slot>
