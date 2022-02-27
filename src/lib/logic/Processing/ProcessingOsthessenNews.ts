import type { Integrations } from "$lib/types/integrations";
import { Readability } from "@mozilla/readability";
import DOMPurify from 'isomorphic-dompurify';

import type { ArticleType } from "../../types/article";
import type { Requests } from "../Requests";

import { SelectorMagicOsthessenNews } from "../Selectors/SelectorMagicOsthessenNews";
import { BaseProcessing } from "./BaseProcessing";

export class ProcessingOsthessenNews extends BaseProcessing {

    private selectorMagic: SelectorMagicOsthessenNews;

    constructor(integration: Integrations, requests: Requests) {
        super(integration, requests);
        this.selectorMagic = new SelectorMagicOsthessenNews(integration, requests);
    }

    processArticle(doc: Document): ArticleType {
        /* Send article through readability api */
        const readabilityOptions = {
            keepClasses: true, // easier manipulation later
            charThreshold: 40
            // charThreshold: 100 // also parse short teaser text
        }

        // IMPORTANT to deep clone document here because it modifies doc drastically
        const docCopyForReadability = doc.cloneNode(true) as Document;

        // manually get title via selector in overview
        const manuallyExtractedTitle = this.selectorMagic.retrieveOverviewArticleTitle(docCopyForReadability);

        const readArticle = new Readability(docCopyForReadability, readabilityOptions).parse();

        const title = DOMPurify.sanitize(manuallyExtractedTitle || readArticle.title);
        const cleanedArticle = {
            // For these to work it's important to deep clone the doc given into Readability
            // drastically modifies doc in there while parsing
            imageUrls: this.selectorMagic.retrieveArticleImageLinks(doc),
            readMoreLink: DOMPurify.sanitize(this.selectorMagic.retrieveArticleReadMoreLink(doc)),

            title: title,
            anchorId: this.titleToAnchor(title),
            byline: DOMPurify.sanitize(readArticle.byline),
            dir: DOMPurify.sanitize(readArticle.dir),
            content: DOMPurify.sanitize(readArticle.content),
            textContent: DOMPurify.sanitize(readArticle.textContent),
            length: readArticle.length,
            excerpt: DOMPurify.sanitize(readArticle.excerpt),
            siteName: readArticle.siteName,
        };
        cleanedArticle.content = this.selectorMagic.relinkDetailLinksToLocal(cleanedArticle.content);
        cleanedArticle.content = this.selectorMagic.removeImages(cleanedArticle.content);
        return cleanedArticle;
    };

    processHtmlElementsAsArticle(elements: Element[]): ArticleType[] {
        const docs = elements.map((element) => this.requests.htmlToDocument(element.innerHTML));
        const articles = docs.map((doc) => this.processArticle(doc));
        return articles;
    }

}
