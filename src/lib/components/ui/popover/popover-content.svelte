<script lang="ts">
import { cn, flyAndScale } from "$lib/utils.js";
import type { Popover as PopoverPrimitive } from "bits-ui";

type $$Props = PopoverPrimitive.ContentProps;

const className: $$Props["class"] = undefined;
export const transition: $$Props["transition"] = flyAndScale;
export const transitionConfig: $$Props["transitionConfig"] = undefined;
export const align: $$Props["align"] = "center";
export const sideOffset: $$Props["sideOffset"] = 4;
export { className as class };
</script>

<PopoverPrimitive.Content
	{transition}
	{transitionConfig}
	{align}
	{sideOffset}
	{...$$restProps}
	class={cn(
		"bg-popover text-popover-foreground z-50 w-72 rounded-md border p-4 shadow-md outline-none",
		className
	)}
>
	<slot />
</PopoverPrimitive.Content>
