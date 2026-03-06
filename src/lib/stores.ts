import { writable } from 'svelte/store';

// TODO breaks with svelteKit ssr move
// TODO need to thing about user session storage in kv maybe?
export const sponsorHater = writable(true);
