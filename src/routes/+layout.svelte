<script>
    import { Button } from "../lib/components/ui/button/index";
    import { initDb } from "../lib/db";
    import { onMount } from "svelte";
    import { ModeWatcher } from "mode-watcher";
    import "../app.css";
    import { page } from "$app/stores";

    const links = [{ name: "/todos" }, { name: "/" }, { name: "/login" }];

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
        {/each}
    </div>
</nav>
<slot></slot>
