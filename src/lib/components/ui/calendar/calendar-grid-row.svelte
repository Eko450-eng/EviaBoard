<script lang="ts">
import { cn } from "$lib/utils.js";
import type { Calendar as CalendarPrimitive } from "bits-ui";

type $$Props = CalendarPrimitive.GridRowProps;

const className: $$Props["class"] = undefined;
export { className as class };
</script>

<CalendarPrimitive.GridRow class={cn("flex", className)} {...$$restProps}>
	<slot />
</CalendarPrimitive.GridRow>
