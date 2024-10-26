<script lang="ts">
import { cn } from "$lib/utils.js";
import type { Avatar as AvatarPrimitive } from "bits-ui";

type $$Props = AvatarPrimitive.ImageProps;

const className: $$Props["class"] = undefined;
export const src: $$Props["src"] = undefined;
export const alt: $$Props["alt"] = undefined;
export { className as class };
</script>

<AvatarPrimitive.Image
	{src}
	{alt}
	class={cn("aspect-square h-full w-full", className)}
	{...$$restProps}
/>
