<script lang="ts">
import { cn } from "$lib/utils.js";
import type * as FormPrimitive from "formsnap";

type $$Props = FormPrimitive.LegendProps;

const className: $$Props["class"] = undefined;
export { className as class };
</script>

<FormPrimitive.Legend
	{...$$restProps}
	class={cn("data-[fs-error]:text-destructive text-sm font-medium leading-none", className)}
	let:legendAttrs
>
	<slot {legendAttrs} />
</FormPrimitive.Legend>
