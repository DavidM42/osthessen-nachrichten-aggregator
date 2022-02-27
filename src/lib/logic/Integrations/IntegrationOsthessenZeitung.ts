import { Integrations } from "$lib/types/integrations";
import { OSTHESEN_ZEITUNG_HOST, OSTHESSEN_ZEITUNG_BASE_URL } from "../../../constants";
import { ProcessingOsthessenZeitung } from "../Processing/ProcessingOsthessenZeitung";
import { Requests } from "../Requests";
import { SelectorMagicOsthessenZeitung } from "../Selectors/SelectorMagicOsthessenZeitung";
import { BaseIntegration } from "./BaseIntegration";

export class IntegrationOsthessenZeitung extends BaseIntegration {

    constructor() {
        super(Integrations.OSTHESSEN_ZEITUNG, new Requests(OSTHESSEN_ZEITUNG_BASE_URL));
        this.selectorMagic = new SelectorMagicOsthessenZeitung(this.integration, this.requests);
        this.processing = new ProcessingOsthessenZeitung(this.integration, this.requests);
        this.HOST = OSTHESEN_ZEITUNG_HOST;
        this.BASE_URL = OSTHESSEN_ZEITUNG_BASE_URL;
    }

    public async getArticleElements(pageNumber: number) {
		const pageUrl = `${this.BASE_URL}/seite/${
			(pageNumber + 1 || 1) + ""
		}.html`;
        const homepageDom = await this.requests.getDom(pageUrl);
		const articleElements = this.selectorMagic.getArticleSnippetsOnPage(
			homepageDom
		);
		return this.processing.processHtmlElementsAsArticle(articleElements);
    }
}
