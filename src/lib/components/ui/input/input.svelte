<script lang="ts">
import type { HTMLInputAttributes } from 'svelte/elements';
import type { WithElementRef } from 'bits-ui';
import { cn } from '$lib/utils.js';

let {
	ref = $bindable(null),
	value = $bindable(),
	class: className,
	...restProps
}: WithElementRef<HTMLInputAttributes> = $props();
</script>

<!-- <input -->
<!-- 	bind:this={ref} -->
<!-- 	class={cn( -->
<!-- 		"border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50", -->
<!-- 		className -->
<!-- 	)} -->
<!-- 	bind:value -->
<!-- 	{...restProps} -->
<!-- /> -->

<input
    bind:value
    {...restProps}
    bind:this={ref}
    class="border-1 block h-10 w-52 rounded-md border border-double border-slate-800 border-transparent bg-[linear-gradient(#000,#000),linear-gradient(to_right,#334454,#334454)] bg-origin-border px-3 py-2 text-slate-200 transition-all duration-500 [background-clip:padding-box,_border-box] placeholder:text-slate-500 focus:bg-[linear-gradient(#000,#000),linear-gradient(to_right,#c7d2fe,#8678f9)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
/>
