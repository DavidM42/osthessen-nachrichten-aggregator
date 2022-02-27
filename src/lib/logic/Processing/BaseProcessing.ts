import type { Integrations } from "$lib/types/integrations";
import type { ArticleType } from "$lib/types/article";
import type { Requests } from "$lib/logic/Requests";

export abstract class BaseProcessing {

    constructor(protected integration: Integrations, protected requests: Requests) {}

    /**
     * Trim but with specific character not whitespace.
     * From https://stackoverflow.com/a/55292366
     * @param str String to trim
     * @param ch Character to trim away
     */
    private trimChar(str: string, ch: string) {
        let start = 0, end = str.length;
    
        while(start < end && str[start] === ch)
            ++start;
    
        while(end > start && str[end - 1] === ch)
            --end;
    
        return (start > 0 || end < str.length) ? str.substring(start, end) : str;
    }

    private removeDuplicateDash(str: string) {
        let changes = true;
        let newStr = null;

        while (changes) {
            newStr = str.replace(/--/g, '-');
            if (newStr === str) {
                changes = false;
            }
            str = newStr;
        }
        return newStr;
    }

	/**
	 * Create usable anchor id for titles
	 * @param title
	 */
    protected titleToAnchor(title: string) {
        const basicModifications = title.toLowerCase().trim();
        let replacedText = basicModifications.replace(/\u00df/g, 'ss').replace(/\u00e4/g, 'ae').replace(/\u00f6/g, 'oe').replace(/\u00fc/g, 'ue');
        replacedText = replacedText.replace(/[^a-z0-9]/g, '-');
        return this.removeDuplicateDash(this.trimChar(replacedText, '-'));
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
