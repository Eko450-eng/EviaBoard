import { uploadFileGeneric } from "@/helpers/minio.js";
import { anchor } from "@cartamd/plugin-anchor";
import { attachment } from "@cartamd/plugin-attachment";
import { code } from "@cartamd/plugin-code";
import { Carta } from "carta-md";
import { imsize } from "carta-plugin-imsize";
import DOMPurify from "isomorphic-dompurify";

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
