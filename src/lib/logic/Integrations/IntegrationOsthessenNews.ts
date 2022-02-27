import { Integrations } from "$lib/types/integrations";
import { OSTHESEN_NEWS_HOST, OSTHESSEN_NEWS_BASE_URL } from "../../../constants";
import { ProcessingOsthessenNews } from "../Processing/ProcessingOsthessenNews";
import { Requests } from "../Requests";
import { SelectorMagicOsthessenNews } from "../Selectors/SelectorMagicOsthessenNews";
import { BaseIntegration } from "./BaseIntegration";

export class IntegrationOsthessenNews extends BaseIntegration {

    constructor() {
        super(Integrations.OSTHESEN_NEWS, new Requests(OSTHESSEN_NEWS_BASE_URL));
        this.selectorMagic = new SelectorMagicOsthessenNews(this.integration, this.requests);
        this.processing = new ProcessingOsthessenNews(this.integration, this.requests);
        this.HOST = OSTHESEN_NEWS_HOST;
        this.BASE_URL = OSTHESSEN_NEWS_BASE_URL;
    }

    /**
	 * Gets Dom for pageNumber
     * @param pageNumber Current page
	 */
    public async getDomForPage(pageNumber: number) {
		const homepageUrl = this.BASE_URL;

        // TODO error handling when we can't find next page link don't just return last dom?
        let currentUrl = homepageUrl;
        let currentDom = await this.requests.getDom(homepageUrl)
        for (let i = 0; i < pageNumber; i++) {
            // TODO cleaner way than typecast here
            currentUrl = (this.selectorMagic as SelectorMagicOsthessenNews).getNextPageLink(currentDom);         
            currentDom = await this.requests.getDom(currentUrl);
        }

		return currentDom;
    }

    public async getArticleElements(pageNumber: number) {
        let dom;
        if (pageNumber == 0) {
            const url = this.BASE_URL;
            dom = await this.requests.getDom(url);
        } else {
            dom = await this.getDomForPage(pageNumber);
        }

		const articleElements = this.selectorMagic.getArticleSnippetsOnPage(
			dom
		);
		return this.processing.processHtmlElementsAsArticle(articleElements);
    }
}
