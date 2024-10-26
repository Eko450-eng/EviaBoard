<script lang="ts">
import { cn } from "$lib/utils.js";
import type { Avatar as AvatarPrimitive } from "bits-ui";

type $$Props = AvatarPrimitive.Props;

const className: $$Props["class"] = undefined;
export const delayMs: $$Props["delayMs"] = undefined;
export { className as class };
</script>

<AvatarPrimitive.Root
	{delayMs}
	class={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
	{...$$restProps}
>
	<slot />
</AvatarPrimitive.Root>
