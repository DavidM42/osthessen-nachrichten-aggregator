import { mergeTwoArraysSwitching } from '$lib/logic/arrayMixerHelper';
import { IntegrationOsthessenNews } from '$lib/logic/Integrations/IntegrationOsthessenNews';
import { IntegrationOsthessenZeitung } from '$lib/logic/Integrations/IntegrationOsthessenZeitung';
import type { ArticleType } from '$lib/types/article';
import { Integrations } from '$lib/types/integrations.js';

const getHomepage = async (integrationString: string, pageNumber: string) => {
	let ozDetails: ArticleType[] = [];
	let onDetails: ArticleType[] = [];
	let articleDetails = [];

	const oNewsI = new IntegrationOsthessenNews();
	const oZeitungI = new IntegrationOsthessenZeitung();

	const zeroIndexedPage = Number.parseInt(pageNumber) - 1;

	if (
		integrationString === Integrations.OSTHESSEN_ZEITUNG ||
		integrationString === Integrations.ALL
	) {
		ozDetails = await oZeitungI.getArticleElements(zeroIndexedPage);
	}

	if (integrationString === Integrations.OSTHESEN_NEWS || integrationString === Integrations.ALL) {
		onDetails = await oNewsI.getArticleElements(zeroIndexedPage);
	}

	// mix both sourced articles switching between them if both are filled, otherwise just add the one that is filled
	articleDetails = mergeTwoArraysSwitching(ozDetails, onDetails);
	return articleDetails;
};

/** @type {import('@sveltejs/kit').Load} */
export async function load({ params }) {
	return {
		// TODO find out how to do this again
		// // cache page for 2 minutes
		// // https://kit.svelte.dev/docs/loading#output-maxage
		// maxage: 120,

		homepageArticles: await getHomepage(params.source, params.pageNumber)
	};
}
