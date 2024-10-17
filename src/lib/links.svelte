<script lang="ts">
    import { Button } from "../lib/components/ui/button/index";
    import "../app.css";
    import { page } from "$app/stores";
    import { isLoggedIn } from "../routes/store";
    import Archive from "svelte-radix/Archive.svelte";
    import Home from "svelte-radix/Home.svelte";
    import Download from "svelte-radix/Download.svelte";
    import Enter from "svelte-radix/Enter.svelte";
    import { Icon } from "svelte-icons-pack";
    import { AiFillSmile } from "svelte-icons-pack/ai";

    let authenticatedLinks = [
        {
            name: Archive,
            value: "/knowledgeboard",
        },
        {
            name: Download,
            value: "/downloadlinks",
        },
    ];

    let unauthenticatedLinks = [
        { type: "nologin", name: Enter, value: "/login" },
    ];

    let links = [{ name: Home, value: "/" }];
</script>

{#each links as link}
    <div>
        <Button variant="link" href={link.value}
            ><span
                class={$page.url.pathname === link.value
                    ? "text-muted-foreground"
                    : "text-secondary-foreground"}
                ><svelte:component this={link.name} /></span
            ></Button
        >
    </div>
{/each}
{#if $isLoggedIn}
    {#each authenticatedLinks as link}
        <div>
            <Button variant="link" href={link.value}
                ><span
                    class={$page.url.pathname === link.value
                        ? "text-muted-foreground"
                        : "text-secondary-foreground"}
                    ><svelte:component this={link.name} /></span
                ></Button
            >
        </div>
    {/each}
    <div>
        <Button variant="link" href="/asb"
            ><span
                class={$page.url.pathname === "asb"
                    ? "text-muted-foreground"
                    : "text-secondary-foreground"}
            >
            <Icon src={AiFillSmile} size={24} />
            </span></Button
        >
    </div>
{:else}
    {#each unauthenticatedLinks as link}
        <div>
            <Button variant="link" href={link.value}
                ><span
                    class={$page.url.pathname === link.value
                        ? "text-muted-foreground"
                        : "text-secondary-foreground"}
                    ><svelte:component this={link.name} /></span
                ></Button
            >
        </div>
    {/each}
{/if}
