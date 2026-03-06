import { OSTHESEN_NEWS_HOST, OSTHESEN_ZEITUNG_HOST } from '$lib/constants';
import { Integrations } from '$lib/types/integrations';
import { error, redirect } from '@sveltejs/kit';
import { SvelteURL } from 'svelte/reactivity';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ url }) => {
	const sharedText = url.searchParams.get('text');
	// const sharedTitle = url.searchParams.get('title');
	// const sharedUrl = url.searchParams.get('url');
	// console.log('Received shared data:', { sharedTitle, sharedText, sharedUrl });

	if (!sharedText) {
		error(400, 'Kein geteilter Text gefunden!');
	}

	const sharedArticleUrl = sharedText;
	const pathForSlug = new SvelteURL(sharedArticleUrl).pathname.replace('.html', '');

	// in testing url was alway in text field
	// if (sharedUrl) {
	// 	urlToResolve = sharedUrl;
	// }

	if (sharedArticleUrl.includes(OSTHESEN_ZEITUNG_HOST)) {
		const articleUrl = `/${Integrations.OSTHESSEN_ZEITUNG}/article/${encodeURIComponent(pathForSlug)}`;
		console.log(articleUrl);
		redirect(302, articleUrl);
	} else if (sharedArticleUrl.includes(OSTHESEN_NEWS_HOST)) {
		const articleUrl = `/${Integrations.OSTHESEN_NEWS}/article/${encodeURIComponent(pathForSlug)}`;
		console.log(articleUrl);
		redirect(302, articleUrl);
	}
	error(400, 'Keine valide URL von Osthessen-News oder Osthessen-Zeitung gefunden!');
};
