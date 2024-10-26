<script lang="ts">
import { cn } from "$lib/utils.js";
import type { Command as CommandPrimitive } from "cmdk-sv";

type $$Props = CommandPrimitive.EmptyProps;
const className: string | undefined | null = undefined;
export { className as class };
</script>

<CommandPrimitive.Empty class={cn("py-6 text-center text-sm", className)} {...$$restProps}>
	<slot />
</CommandPrimitive.Empty>
