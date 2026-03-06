import { OSTHESEN_ZEITUNG_HOST, OSTHESSEN_ZEITUNG_BASE_URL } from '$lib/constants';
import { Integrations } from '$lib/types/integrations';
import { ProcessingOsthessenZeitung } from '../Processing/ProcessingOsthessenZeitung';
import { Requests } from '../Requests';
import { SelectorMagicOsthessenZeitung } from '../Selectors/SelectorMagicOsthessenZeitung';
import { BaseIntegration } from './BaseIntegration';

export class IntegrationOsthessenZeitung extends BaseIntegration {
	constructor() {
		super(Integrations.OSTHESSEN_ZEITUNG, new Requests(OSTHESSEN_ZEITUNG_BASE_URL));
		this.selectorMagic = new SelectorMagicOsthessenZeitung(this.integration, this.requests);
		this.processing = new ProcessingOsthessenZeitung(this.integration, this.requests);
		this.HOST = OSTHESEN_ZEITUNG_HOST;
		this.BASE_URL = OSTHESSEN_ZEITUNG_BASE_URL;
	}

	// always delivers original image urls in article snippets so no need to convert thumbnail urls to original urls like in osthessen news
	public getOriginalImageOfThumbnail(thumbnailImgUrl: string): string {
		return thumbnailImgUrl;
	}

	public async getArticleElements(pageNumber: number) {
		// only use locales subpage now
		// ignore all the fußball
		const pageUrl = `${this.BASE_URL}/lokales/seite/${(pageNumber + 1 || 1) + ''}.html`;

		const homepageDom = await this.requests.getDom(pageUrl);
		// console.log(`Getting article elements for page `, homepageDom.textContent);
		const articleElements = this.selectorMagic.getArticleSnippetsOnPage(homepageDom);
		return this.processing.processHtmlElementsAsArticle(articleElements);
	}
}
