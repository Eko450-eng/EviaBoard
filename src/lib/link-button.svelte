<script lang="ts">
    import * as Tooltip from "$lib/components/ui/tooltip/index";
    import { Button } from "../lib/components/ui/button/index";
    import "@fortawesome/fontawesome-free/css/all.min.css";
    import "../app.css";
    import { Icon } from "svelte-icons-pack";

    export let link: any;
    export let pathname: string;
</script>

<Tooltip.Root>
    <Tooltip.Trigger asChild let:builder>
        <Button variant="link" builders={[builder]} href={link.value}>
            <span
                class={pathname === link.value
                    ? "text-muted-foreground"
                    : "text-secondary-foreground"}
            >
                <Icon src={link.icon} size={24} />
            </span>
        </Button>
    </Tooltip.Trigger>
    <Tooltip.Content>
        <p>{link.name}</p>
    </Tooltip.Content>
</Tooltip.Root>
