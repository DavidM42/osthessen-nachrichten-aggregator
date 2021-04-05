import { PROXY_BASE_URL, OSTHESEN_HOST, OSTHESSEN_BASE_URL } from "../constants";
import { sponsorHater } from "../stores";
import { Requests } from "./Requests";

export class SelectorMagic {

    private requests = new Requests();

    private isSponsorHater = false;

    constructor() {
        sponsorHater.subscribe(isHater => {
            this.isSponsorHater = isHater;
        });
    }

    /**
     * Extracts all image links in articles but readabilityJS sometimes keeps them if you use it right.
     * @param doc Document of page
     * @returns Links to all images contained in an article
     */
    retrieveArticleImageLinks(doc: Document) {
        let articleNormalImagesElements = Array.from(doc.querySelectorAll('img[src^="fileadmin/user_upload/"]'));

        // more aggresive specific query if wants to block even sponsor images for e.g. soccer games
        if (this.isSponsorHater) {
            articleNormalImagesElements = Array.from(doc.querySelectorAll('img[src^="fileadmin/user_upload/user_upload/"]'));
        }

        const articleSlideshowImageElements = Array.from(doc.querySelectorAll('img[src^="fileadmin/fotostrecken/"]'));
        const allImageElements = articleNormalImagesElements.concat(articleSlideshowImageElements);

        return allImageElements.map((element: HTMLImageElement) => {
            // remap url to proxy
            return PROXY_BASE_URL + element.src;
        });
    }

    /**
     * Extracts link to read more in articles
     * @param doc Document of page
     * @returns Link to details page
     */
    retrieveArticleReadMoreLink(doc: Document) {
        // const aTag = doc.querySelector('a.more') as HTMLLinkElement;
        const aTag = (doc.querySelector('a[href*="einzelansicht/news/"]') as HTMLLinkElement);

        if (aTag && aTag.href) {
            const cleanedArticleSlug = aTag.href.replace(OSTHESSEN_BASE_URL, '').replace('.html', '');
            return '/article/' + encodeURIComponent(cleanedArticleSlug);
        }
    }

    /**
     * First article on homepage is special type where retrieving headline needs extra work
     * @param doc Document of page
     * @returns Either found article headline or empty string
     */
    retrieveOverviewArticleTitle(doc: Document) {
        return doc.querySelector('span[itemprop="headline"]')?.textContent || '';
    }

    /**
     * Returns cleaned article element list from homepage without banner ads
     * @param doc Document of page
     * @returns Singular div.article element
     */
    getArticleSnippetsOnPage(doc: Document): Element[] {
        const rawArticelElements = Array.from(doc.querySelectorAll('div.news-list-view > div.article'));
        rawArticelElements.map((element) => {
            const footer = element.getElementsByClassName('footer');
            if (footer.length > 0) {
                // thank https://stackoverflow.com/a/13555826
                while (footer.length > 0) {
                    // console.log(footer);
                    footer[0].parentNode.removeChild(footer[0]);
                }
            }

            const ad = element.getElementsByClassName('content-banner');
            if (ad.length > 0) {
                while (ad.length > 0) {
                    // console.log(ad);
                    ad[0].parentNode.removeChild(ad[0]);
                }
            }
        })
        return rawArticelElements;
    }

    /**
     * Returns cleaned big article element from einzelansicht page
     * @param doc Document of page
     * @returns Singular div.article element without banner ads hopefully
     */
    getSingularBigArticleOnPage(doc: Document): Element {
        const element = doc.querySelector('div.news-single > div.article');
        const footer = element.getElementsByClassName('footer');
        if (footer.length > 0) {
            // thank https://stackoverflow.com/a/13555826
            while (footer.length > 0) {
                // console.log(footer);
                footer[0].parentNode.removeChild(footer[0]);
            }
        }

        const ad = element.getElementsByClassName('content-banner');
        if (ad.length > 0) {
            while (ad.length > 0) {
                // console.log(ad);
                ad[0].parentNode.removeChild(ad[0]);
            }
        }
        return element;
    }

    /**
     * @deprecated
     * Pipe html in pipe html out of page where link to continue reading single articles get changed.
     * This way the navigation stays on the wrapper page.
     * @param content Html content of returned page
     * @returns Html content of page with relinked article links
     */
    relinkDetailLinksToLocal(content: string): string {
        const element = this.requests.htmlDocumentFragmentFromString(content);
        const allDetailsLinks = Array.from(element.querySelectorAll('a[href*="einzelansicht/news/"]'));
        allDetailsLinks.map((aTag: HTMLLinkElement) => {
            const cleanedArticleSlug = aTag.href.replace(OSTHESSEN_BASE_URL, '').replace('.html', '');
            aTag.href = '/article/' + encodeURIComponent(cleanedArticleSlug);
        });
        return element.querySelector('div.page').innerHTML;
    }

    /**
     * Pipe html in pipe html out of page where link to continue reading single articles get removed.
     * @param content Html content of returned page
     * @returns Html content of page without any read more links
     */
    removeDetailsLinks(content: string): string {
        const element = this.requests.htmlDocumentFragmentFromString(content);
        const allDetailsLinks = Array.from(element.querySelectorAll('a[href*="einzelansicht/news/"]'));
        // removes all of them
        allDetailsLinks.forEach((aTag) => aTag.parentNode.removeChild(aTag));
        return element.querySelector('div').innerHTML;
    }

    /**
     * Pipe html in pipe html out of page where all images get removed.
     * @param content Html content of returned page
     * @returns Html content of page without any images
     */
    removeImages(content: string): string {
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