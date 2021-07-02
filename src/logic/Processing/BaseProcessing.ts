import type { ArticleType } from "../../types/article";
import type { Requests } from "../Requests";

export abstract class BaseProcessing {

    protected requests: Requests;

    constructor(requests: Requests) {
        this.requests = requests;
    }

    /**
     * Process one article. Basically get all data from dom. Via readability js and more manipulation.
     * @param doc Doc to extract from
     */
    protected abstract processArticle(doc: Document): ArticleType;

    /**
     * Same as processArticle but with multiple elements so in a list of a view
     * @param elements List of dom elements to extract articles from
     */
    abstract processHtmlElementsAsArticle(elements: Element[]): ArticleType[];
}
