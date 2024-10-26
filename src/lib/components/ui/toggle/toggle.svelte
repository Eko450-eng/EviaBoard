<script lang="ts">
import { cn } from "$lib/utils.js";
import type { Toggle as TogglePrimitive } from "bits-ui";
import { type Size, type Variant, toggleVariants } from "./index.js";

type $$Props = TogglePrimitive.Props & {
	variant?: Variant;
	size?: Size;
};
type $$Events = TogglePrimitive.Events;

const className: $$Props["class"] = undefined;
export const variant: $$Props["variant"] = "default";
export const size: $$Props["size"] = "default";
export const pressed: $$Props["pressed"] = undefined;
export { className as class };
</script>

<TogglePrimitive.Root
	bind:pressed
	class={cn(toggleVariants({ variant, size, className }))}
	{...$$restProps}
	on:click
	on:keydown
>
	<slot />
</TogglePrimitive.Root>
