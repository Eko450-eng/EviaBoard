<script lang="ts">
import { cn } from "$lib/utils.js";
import type { Accordion as AccordionPrimitive } from "bits-ui";
import { slide } from "svelte/transition";

type $$Props = AccordionPrimitive.ContentProps;

const className: $$Props["class"] = undefined;
export const transition: $$Props["transition"] = slide;
export const transitionConfig: $$Props["transitionConfig"] = {
	duration: 200,
};

export { className as class };
</script>

<AccordionPrimitive.Content
	class={cn("overflow-hidden text-sm", className)}
	{transition}
	{transitionConfig}
	{...$$restProps}
>
	<div class="pb-4 pt-0">
		<slot />
	</div>
</AccordionPrimitive.Content>
