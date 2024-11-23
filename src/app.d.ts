// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// declare var self: ServiceWorker & {
//   __WB_MANIFEST: Array<{
//     revision: string | null;
//     url: string;
//   }>;
//   skipWaiting: () => Promise<void>;
//   clients: {
//     claim: () => Promise<void>;
//     matchAll: () => Promise<any>;
//   };
// };
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			jwt: string;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}
export {};
