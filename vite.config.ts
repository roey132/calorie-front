import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	build: {
		sourcemap: true
	},
	server: {
		proxy: {
			'/rust': {
				target: 'http://localhost:8080',
				rewrite: (path: string) => path.replace(/^\/rust/, '')
			}
		}
	}
});
