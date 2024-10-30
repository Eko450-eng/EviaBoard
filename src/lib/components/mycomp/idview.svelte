<script lang="ts">
import type { RecordId } from 'surrealdb';
import { Icon } from 'svelte-icons-pack';
import { FaSolidCodeCommit } from 'svelte-icons-pack/fa';
import * as Tooltip from '$lib/components/ui/tooltip/index';
import { Button } from '$lib/components/ui/button/index';

export let id: RecordId;
function copy() {
	navigator.clipboard.writeText(id.toString());
}
</script>


<Tooltip.Provider>
    <Tooltip.Root>
        <Tooltip.Trigger>
            <Button
                variant="ghost"
                role="button"
                aria-label="Copy id"
                onkeydown={copy}
                onclick={copy}
                class="flex w-min center gap-2 items-center btn"
            >
                <Icon src={FaSolidCodeCommit} />
                <p>{id}</p>
            </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>
            <p>Copy the ID</p>
        </Tooltip.Content>
    </Tooltip.Root>
</Tooltip.Provider>
