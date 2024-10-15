<script lang="ts">
    import { onMount } from "svelte";
    onMount(async () => {
        let d = await getdata();
        console.log(d);
    });
</script>
