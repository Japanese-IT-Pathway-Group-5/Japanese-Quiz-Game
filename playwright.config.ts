import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: {
		// `npm` deliberately, not `pnpm`: npm ships with Node so it is always on PATH,
		// including on machines where the corepack pnpm shim was never installed.
		// It only invokes the local binaries here — no dependency resolution happens.
		command: 'npm run build && npm run preview',
		port: 4173,
		// Default is 60s, which the build (~20s) plus a cold `wrangler dev` start
		// can exceed on Windows and on a cold CI runner.
		timeout: 180_000,
		reuseExistingServer: !process.env.CI
	},
	testMatch: '**/*.e2e.{ts,js}',
	reporter: process.env.CI ? [['html'], ['github']] : 'list',
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 1 : 0
});
