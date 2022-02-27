import type { Integrations } from "$lib/types/integrations";
import { Readability } from "@mozilla/readability";
import DOMPurify from 'isomorphic-dompurify';

import type { ArticleType } from "../../types/article";
import type { Requests } from "../Requests";

import { SelectorMagicOsthessenZeitung } from "../Selectors/SelectorMagicOsthessenZeitung";
import { BaseProcessing } from "./BaseProcessing";

export class ProcessingOsthessenZeitung extends BaseProcessing {

    private selectorMagic: SelectorMagicOsthessenZeitung

    constructor(integration: Integrations, requests: Requests) {
        super(integration, requests);
        this.selectorMagic = new SelectorMagicOsthessenZeitung(integration, requests);
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
        const readArticle = new Readability(docCopyForReadability, readabilityOptions).parse();

        const manuallyExtractedTitle = this.selectorMagic.retrieveOverviewArticleTitle(doc);
        const title = DOMPurify.sanitize(readArticle.title || manuallyExtractedTitle);

        const cleanedArticle: ArticleType = {
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
        // cleanedArticle.content = this.selectorMagic.relinkDetailLinksToLocal(cleanedArticle.content);
        cleanedArticle.content = this.selectorMagic.removeDetailsLinks(cleanedArticle.content);
        cleanedArticle.content = this.selectorMagic.removeImages(cleanedArticle.content);
        return cleanedArticle;
    };

    processHtmlElementsAsArticle(elements: Element[]): ArticleType[] {
        const docs = elements.map((element) => this.requests.htmlToDocument(element.innerHTML));
        const articles = docs.map((doc) => this.processArticle(doc));
        // for (let i = 0; i < articles.length; i++) {
            // TODO sort after element <time datetime="03.04.2021">03.04.2021</time>
        // }
        return articles;
    }

}
