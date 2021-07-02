import { PROXY_BASE_URL } from "../constants";

const domParser = new DOMParser();

export class Requests {

    private baseUrl: string;

    constructor (baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    public async getDom(url: string) {
        return this.htmlToDocument(await (await fetch(PROXY_BASE_URL + url)).text());
    }

    public htmlToDocument(html: string) {
        // see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
        const doc = domParser.parseFromString(html, "text/html");

        // appending this is important so links work later
        let baseHeaderElement = doc.createElement('base');
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
        const wrapTemplate = document.createElement('template');
        // const innerTemplate = document.createElement('template');
        // innerTemplate.id = "innerTemplateFragment";
        // innerTemplate.innerHTML = html;
        // wrapTemplate.appendChild(innerTemplate);
        // console.log(wrapTemplate);
        wrapTemplate.innerHTML = html;
        return wrapTemplate.content;
    }
}
