<script lang="ts">
import { cn } from "$lib/utils.js";
import type { Command as CommandPrimitive } from "cmdk-sv";

type $$Props = CommandPrimitive.CommandProps;

export const value: $$Props["value"] = undefined;

const className: string | undefined | null = undefined;
export { className as class };
</script>

<CommandPrimitive.Root
	class={cn(
		"bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md",
		className
	)}
	bind:value
	{...$$restProps}
>
	<slot />
</CommandPrimitive.Root>
