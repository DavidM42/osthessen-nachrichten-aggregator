import type { BaseIntegration } from '$lib/logic/Integrations/BaseIntegration';
import { IntegrationOsthessenNews } from '$lib/logic/Integrations/IntegrationOsthessenNews';
import { IntegrationOsthessenZeitung } from '$lib/logic/Integrations/IntegrationOsthessenZeitung';
import type { ArticleType } from '$lib/types/article';
import { Integrations } from '$lib/types/integrations';

let currentIntegration: BaseIntegration;
const oNewsI = new IntegrationOsthessenNews();
const oZeitungI = new IntegrationOsthessenZeitung();

let articleUrl: string;

const getArticlePage = async (
	integrationString: string,
	encodedArticleSlug: string
): Promise<{
	articleUrl: string;
	article: ArticleType;
}> => {
	let article: ArticleType;
	const isOsthessenZeitungSlug = integrationString === Integrations.OSTHESSEN_ZEITUNG;
	const isOsthessenNewsSlug = integrationString === Integrations.OSTHESEN_NEWS;

	if (isOsthessenZeitungSlug) {
		currentIntegration = oZeitungI;
	} else if (isOsthessenNewsSlug) {
		currentIntegration = oNewsI;
	} else {
		throw new Error('Unknown detail page url slug!');
	}

	articleUrl = currentIntegration.articleUrlFromslug(encodedArticleSlug);
	const articlePageDom = await currentIntegration.requests.getDom(articleUrl);

	const articleElement =
		currentIntegration.selectorMagic.getSingularBigArticleOnPage(articlePageDom);
	article = currentIntegration.processing.processHtmlElementsAsArticle([articleElement])[0];

	article = currentIntegration.processing.processArticle(articlePageDom);
	return {
		articleUrl: articleUrl,
		article: article
	};
};

/** @type {import('@sveltejs/kit').Load} */
export async function load({ url, params }) {
	const articlePageData = await getArticlePage(params.source, params.slug);
	return {
		// TODO find out how to do this again
		// cache page for 5 minutes
		// https://kit.svelte.dev/docs/loading#output-maxage
		// maxage: 60 * 5,

		articleUrl: articlePageData.articleUrl,
		article: articlePageData.article,
		url: url,
		currentIntegration: currentIntegration
	};
}
