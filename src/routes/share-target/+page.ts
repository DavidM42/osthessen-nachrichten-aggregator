import { OSTHESEN_NEWS_HOST, OSTHESEN_ZEITUNG_HOST } from '$lib/constants';
import { Integrations } from '$lib/types/integrations';
import { redirect } from '@sveltejs/kit';
import { error } from 'console';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ url }) => {
	const sharedTitle = url.searchParams.get('title');
	const sharedText = url.searchParams.get('text');
	const sharedUrl = url.searchParams.get('url');
	console.log('Received shared data:', { sharedTitle, sharedText, sharedUrl });

	let urlToResolve = sharedText;

	if (sharedUrl) {
		urlToResolve = sharedUrl;
	}

	if (urlToResolve) {
		if (urlToResolve.includes(OSTHESEN_ZEITUNG_HOST)) {
			const cleanedArticleSlug = urlToResolve
				.replace(OSTHESEN_ZEITUNG_HOST, '')
				.replace('.html', '');
			console.log('Cleaned article slug:', cleanedArticleSlug);
			const articleUrl = `/${Integrations.OSTHESSEN_ZEITUNG}/article/${encodeURIComponent(cleanedArticleSlug)}`;
			console.log(articleUrl);
			redirect(302, articleUrl);
		} else if (urlToResolve.includes(OSTHESEN_NEWS_HOST)) {
			const cleanedArticleSlug = urlToResolve.replace(OSTHESEN_NEWS_HOST, '').replace('.html', '');
			console.log('Cleaned article slug:', cleanedArticleSlug);
			const articleUrl = `/${Integrations.OSTHESEN_NEWS}/article/${encodeURIComponent(cleanedArticleSlug)}`;
			console.log(articleUrl);
			redirect(302, articleUrl);
		}
	} else {
		error(400, 'Keine valide URL von Osthessen-News oder Osthessen-Zeitung gefunden!');
	}
};
