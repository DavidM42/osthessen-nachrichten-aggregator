import { OSTHESEN_NEWS_HOST, OSTHESEN_ZEITUNG_HOST } from '$lib/constants';
import { error } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET({ params }) {
	const url = new URL(params.url);

	if (!url.hostname.includes(OSTHESEN_ZEITUNG_HOST) && !url.hostname.includes(OSTHESEN_NEWS_HOST)) {
		error(401, 'Not allowed to proxy this pag');
	}

	const response = await fetch(url.href);
	return new Response(response.body);
	// TODO fix cache
	// cache page for 60 minutes
	// https://kit.svelte.dev/docs/loading#output-maxage
	// maxage: 60 * 60,
}
