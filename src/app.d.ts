// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Platform {
			env: Env & {
				AUTH_SECRET: string;
				ADMIN_PASSWORD: string;
				GOOGLE_CLIENT_ID?: string;
				GOOGLE_CLIENT_SECRET?: string;
				DB: D1Database;
			};
			ctx: ExecutionContext;
			caches: CacheStorage;
			cf?: IncomingRequestCfProperties;
		}
		// interface Error {}
		interface Locals {
			/** The current visitor's player id, set once per request in hooks.server.ts. */
			playerId: string;
			/** The current visitor's player record (if found in the database), set in hooks.server.ts. */
			player?: import('$lib/server/db/schema').Player | null;
		}
		// interface PageData {}
		// interface PageState {}
	}
}

export {};
