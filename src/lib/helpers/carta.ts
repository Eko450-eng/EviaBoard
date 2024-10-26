import { Carta } from "carta-md";
import { code } from "@cartamd/plugin-code";
import { attachment } from "@cartamd/plugin-attachment";
import { anchor } from "@cartamd/plugin-anchor";
import { imsize } from "carta-plugin-imsize";
import DOMPurify from "isomorphic-dompurify";
import { uploadFileGeneric } from "@/helpers/minio.js";

export default new Carta({
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
