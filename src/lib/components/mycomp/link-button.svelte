<script lang="ts">
import { Button } from "$lib/components/ui/button";
import * as Tooltip from "$lib/components/ui/tooltip";
import { Icon } from "svelte-icons-pack";

//eslint-disable-next-line
export let link: any;
export let pathname: string;
</script>

<Tooltip.Root>
    <Tooltip.Trigger asChild let:builder>
        <Button aria-label={link.value} variant="link" builders={[builder]} href={link.value}>
            <span
                class={pathname === link.value
                    ? "linkButton-active text-muted-foreground"
                    : "linkButton text-secondary-foreground"}
            >
                <Icon src={link.icon} size={24} />
            </span>
        </Button>
    </Tooltip.Trigger>
    <Tooltip.Content>
        <p>{link.name}</p>
    </Tooltip.Content>
</Tooltip.Root>

<style>
    .linkButton, .linkButton-active  {
        overflow: hidden;
        position: relative;
        display: inline-block;
        padding: .5em;
        border-radius: 15px;
        font-size: 24px;
        border: 2px solid transparent;
    }

    .linkButton::before {
        content: "";
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        border: 2px solid teal; /* The border color you want to animate */
        transform: rotate(0deg); /* Start at 0 degrees */
        opacity: 0; /* Start as invisible */
        transition:
            transform 0.6s ease-out,
            opacity 0.3s ease-out; /* Transition both rotation and opacity */
        z-index: -1; /* Ensure it stays behind the content */
    }

    .linkButton:hover::before {
        transform: rotate(360deg); /* Full rotation */
        opacity: 1; /* Become visible */
    }

    .linkButton-active {
        border: 2px solid teal; /* The border color you want to animate */
    }
</style>
