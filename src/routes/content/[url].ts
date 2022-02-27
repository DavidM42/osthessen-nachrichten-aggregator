import { OSTHESEN_ZEITUNG_HOST, OSTHESEN_NEWS_HOST} from "../../constants";

import fetch from 'node-fetch';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get({ params }) {
    const url = new URL(params.url);

    if (!url.hostname.includes(OSTHESEN_ZEITUNG_HOST) && !url.hostname.includes(OSTHESEN_NEWS_HOST)) {
        return {
            status: 401,
            body: 'Not allowed to proxy this page'
        }
    }

    const response = await fetch(url.href);
    return {
        // cache page for 60 minutes
        // https://kit.svelte.dev/docs/loading#output-maxage
        maxage: 60 * 60,

        body: response.body,
    };
};