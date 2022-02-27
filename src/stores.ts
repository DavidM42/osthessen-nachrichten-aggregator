import { writable } from 'svelte/store';

// TODO breaks with svelteKit ssr move
export const sponsorHater = writable(false);