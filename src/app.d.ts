// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Platform {
			env: Env;
			ctx: ExecutionContext;
			caches: CacheStorage;
			cf?: IncomingRequestCfProperties;
		}
		// interface Error {}
		interface Locals {
			/** The current visitor's player id, set once per request in hooks.server.ts. */
			playerId: string;
		}
		// interface PageData {}
		// interface PageState {}
	}
}

export {};
