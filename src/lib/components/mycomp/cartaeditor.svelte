<script lang="ts">
    import { Carta, MarkdownEditor } from "carta-md";
    import { code } from "@cartamd/plugin-code";
    import { attachment } from "@cartamd/plugin-attachment";
    import { anchor } from "@cartamd/plugin-anchor";
    import { imsize } from "carta-plugin-imsize";
    import DOMPurify from "isomorphic-dompurify";
    import { uploadFileGeneric } from "@/helpers/minio.js";
    import "$lib/themes/github.scss";
    import "$lib/themes/discord.scss";
    import "carta-md/default.css";
    import "@cartamd/plugin-anchor/default.css";
    import "@cartamd/plugin-code/default.css";
    import "@cartamd/plugin-attachment/default.css";

    const carta = new Carta({
        sanitizer: DOMPurify.sanitize,
        extensions: [
            anchor(),
            code(),
            imsize(),
            attachment({
                upload(file) {
                    return uploadFileGeneric(file);
                },
            }),
        ],
    });

    let { text = $bindable() }: { text: string } = $props();
</script>

<MarkdownEditor scroll="async" mode="tabs" theme="github" {carta} bind:value={text} />
