<script lang="ts">
    import { Markdown, Carta } from "carta-md";
    import "$lib/themes/github.scss";
    import "$lib/themes/discord.scss";
    import "carta-md/default.css";
    import "@cartamd/plugin-anchor/default.css";
    import "@cartamd/plugin-code/default.css";
    import "@cartamd/plugin-attachment/default.css";
    import DOMPurify from "isomorphic-dompurify";
    import { code } from "@cartamd/plugin-code";
    import { anchor } from "@cartamd/plugin-anchor";
    import { imsize } from "carta-plugin-imsize";

    const carta = new Carta({
        sanitizer: DOMPurify.sanitize,
        extensions: [
            anchor(),
            code(),
            imsize(),
        ],
    });

    let { text }: { text: string } = $props();
</script>

<Markdown {carta} value={text} />
