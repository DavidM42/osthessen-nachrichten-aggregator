import { browser } from '$app/env';

import parseDom from 'dom-parse';
// import { HappyDOMContext } from '@happy-dom/server-rendering';
// import { Script } from 'vm';

export class Requests {

    private baseUrl: string;

    constructor (baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    public async getDom(url: string) {
        if (browser) {
            // use proxy endpoint for cors avoiding if ran in browser
            // load functions invoking this can be either server on first load or client on hydration/prefetching
            url = `/content/${encodeURIComponent(url)}`;
        }

        return this.htmlToDocument(await (await fetch(url)).text());
    }

    public htmlToDocument(html: string) {
        // see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
        const doc: Document = parseDom(html);
        // let doc: Document;
        // if (browser) {
        //     const domParser = new DOMParser();
        //     doc = domParser.parseFromString(html, "text/html");
        // } else {
        //     // const { JSDOM } = await import('jsdom');
        //     // doc = new jsdom.JSDOM(html).window.document;
        // }

        // appending this is important so links work later
        const baseHeaderElement = doc.createElement('base');
        baseHeaderElement.setAttribute('href', this.baseUrl);
        doc.head.append(baseHeaderElement);
        return doc;
    }

    /**
     * @param {String} HTML representing a single element
     * @return {Element}
     */
    public htmlDocumentFragmentFromString(html: string) {
        // from https://stackoverflow.com/a/35385518
        // let wrapTemplate: HTMLTemplateElement;
        const doc: Document = parseDom('<template></template>');

        const wrapTemplate = doc.querySelector('template');

        // if (browser) {
        //     wrapTemplate = document.createElement('template');
        // } else {
        //     const { JSDOM } = await import('jsdom');
        //     wrapTemplate = new jsdom.JSDOM('').window.document.createElement('template');
        // }
        // const innerTemplate = document.createElement('template');
        // innerTemplate.id = "innerTemplateFragment";
        // innerTemplate.innerHTML = html;
        // wrapTemplate.appendChild(innerTemplate);
        // console.log(wrapTemplate);
        wrapTemplate.innerHTML = html;
        return wrapTemplate.content;
    }
}
