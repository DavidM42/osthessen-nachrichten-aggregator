// copy from readability lib with mods
export interface ArticleType {
    /** Added myself to this use case */
    imageUrls: string[],
    readMoreLink: string,

    /** article title */
    title: string;
    /** author metadata */
    byline: string;
    /** content direction */
    dir: string;
    /** HTML of processed article content */
    content: any;
    /** text content of the article (all HTML removed) */
    textContent: string;
    /** length of an article, in characters */
    length: number;
    /** article description, or short excerpt from the content */
    excerpt: string;
    siteName: string;
}