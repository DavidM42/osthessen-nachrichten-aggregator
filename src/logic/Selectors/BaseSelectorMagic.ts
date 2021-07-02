import type { Requests } from "../Requests";

export abstract class BaseSelectorMagic {

    protected requests: Requests;

    constructor(requests: Requests) {
        this.requests = requests;
    }

    /**
     * Extracts all image links in articles but readabilityJS sometimes keeps them if you use it right.
     * @param doc Document of page
     * @returns Links to all images contained in an article
     */
    protected abstract retrieveArticleImageLinks(doc: Document);

    /**
     * Extracts link to read more in articles
     * @param doc Document of page
     * @returns Link to details page
     */
    public abstract retrieveArticleReadMoreLink(doc: Document);

    /**
     * Returns cleaned article element list from homepage without banner ads
     * @param doc Document of page
     * @returns Singular div.article element
     */
    public abstract getArticleSnippetsOnPage(doc: Document): Element[];

    /**
     * Returns cleaned big article element from einzelansicht page
     * @param doc Document of page
     * @returns Singular div.article element without banner ads hopefully
     */
    public abstract getSingularBigArticleOnPage(doc: Document): Element;

    /**
     * @deprecated
     * Pipe html in pipe html out of page where link to continue reading single articles get changed.
     * This way the navigation stays on the wrapper page.
     * @param content Html content of returned page
     * @returns Html content of page with relinked article links
     */
    abstract relinkDetailLinksToLocal(content: string): string;

    /**
     * Pipe html in pipe html out of page where all images get removed.
     * @param content Html content of returned page
     * @returns Html content of page without any images
     */
    public removeImages(content: string): string {
        const element = this.requests.htmlDocumentFragmentFromString(content);
        const allImages = Array.from(element.querySelectorAll('img'));
        // removes all of them
        allImages.forEach((imgTag) => imgTag.parentNode.removeChild(imgTag));

        const editedHtml = element.querySelector('div')?.innerHTML;
        if (!editedHtml) {
            console.warn("Could not successfully remove images from html!");
        }
        return editedHtml || content;
    }

}