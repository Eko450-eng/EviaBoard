<script lang="ts">
import { cubicOut } from 'svelte/easing';
import { onMount } from 'svelte';
import { tweened } from 'svelte/motion';
import { cn } from '$lib/utils';
// let value = 100;
// let initial = 0;
// let duration = 6000;
// { className as class };

let {
	value = $bindable(100),
	initial = 0,
	duration = 3000,
	className = '',
}: {
	value?: number;
	initial?: number;
	duration?: number;
	className?: string;
} = $props();

let num = tweened(initial, {
	duration: duration,
	easing: cubicOut,
});

$effect(() => {
	num.set(value);
});
</script>

<div
  class={cn(
    "inline-block  text-black dark:text-white tracking-normal",
    className
  )}
>
  {$num.toFixed(0)}
</div>
