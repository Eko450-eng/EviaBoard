<script lang="ts">
import { cn, flyAndScale } from "$lib/utils.js";
import type { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";

type $$Props = DropdownMenuPrimitive.SubContentProps;

const className: $$Props["class"] = undefined;
export const transition: $$Props["transition"] = flyAndScale;
export const transitionConfig: $$Props["transitionConfig"] = {
	x: -10,
	y: 0,
};
export { className as class };
</script>

<DropdownMenuPrimitive.SubContent
	{transition}
	{transitionConfig}
	class={cn(
		"bg-popover text-popover-foreground z-50 min-w-[8rem] rounded-md border p-1 shadow-lg focus:outline-none",
		className
	)}
	{...$$restProps}
	on:keydown
	on:focusout
	on:pointermove
>
	<slot />
</DropdownMenuPrimitive.SubContent>
