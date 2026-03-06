import { OSTHESSEN_NEWS_BASE_URL } from '$lib/constants';
import type { Integrations } from '$lib/types/integrations';
import type { Requests } from '../Requests';
import { BaseSelectorMagic } from './BaseSelectorMagic';

export class SelectorMagicOsthessenNews extends BaseSelectorMagic {
	constructor(integration: Integrations, requests: Requests) {
		super(integration, requests);
	}

	/**
	 * Extracts all image links in articles but readabilityJS sometimes keeps them if you use it right.
	 * @param doc Document of page
	 * @returns Links to all images contained in an article
	 */
	retrieveArticleImageLinks(doc: Document) {
		// have weird https://oshessen-news.b-cdn.net/images/... urls now with mispronounced cdn domain
		const showImageElement = Array.from(doc.querySelectorAll('img[src*="-news.b-cdn.net/show/"]'));

		const articleRawLinkedImageElements = Array.from(
			doc.querySelectorAll('img[src*="-news.b-cdn.net/images/"]')
		);
		const allImageElements = showImageElement.concat(articleRawLinkedImageElements);

		const filteredImageElements = allImageElements.filter((element) => {
			// filter out all the job logos
			const imageElementSrc = (element as HTMLImageElement).src;
			return (
				!imageElementSrc.includes('/jobs/logo/') &&
				!imageElementSrc.includes('/service/jobs_logo/') &&
				!imageElementSrc.includes('/static/')
			);
		});

		// map only image source
		return filteredImageElements.map((element) => (element as HTMLImageElement).src);
	}

	/**
	 * Extracts link to read more in articles
	 * @param doc Document of page
	 * @returns Link to details page
	 */
	retrieveArticleReadMoreLink(doc: Document) {
		const nonSportSelector = 'a[href*="https://osthessen-news.de/n"]';
		// sometimes for sports different url
		const sportSelector = 'a[href*="https://osthessen-news.de/sport/n"]';
		// for fastnacht too
		const fastnachtSelector = 'a[href*="https://osthessen-news.de/naerrisch/n"]';

		const aTag = doc.querySelector(
			`${nonSportSelector},${sportSelector},${fastnachtSelector}`
		) as HTMLLinkElement;

		if (aTag && aTag.href) {
			const cleanedArticleSlug = aTag.href
				.replace(OSTHESSEN_NEWS_BASE_URL, '')
				.replace('.html', '');
			return `/${this.currentIntegration}/article/${encodeURIComponent(cleanedArticleSlug)}`;
		}
	}

	getArticleSnippetsOnPage(doc: Document): Element[] {
		const rawArticelElements = Array.from(doc.querySelectorAll('article'));
		rawArticelElements.map((element) => {
			// here you could remove unwanted stuff
		});
		return rawArticelElements;
	}

	/**
	 * Gets next page number by looking for date edge linked at bottom
	 * @param doc Document of page
	 * @returns Link to next osthessen news page with older articles than current
	 */
	public getNextPageLink(doc: Document): string {
		const aTag = doc.querySelector(
			'a[href*="https://osthessen-news.de?datum="]'
		) as HTMLLinkElement;

		if (aTag && aTag.href) {
			return aTag.href;
		}
	}

	/**
	 * Extra parse out article title in list view articles because readability sees it's h4 nesss as not headline understandably
	 * @param doc Document of page
	 * @returns Either found article headline or empty string
	 */
	retrieveOverviewArticleTitle(doc: Document) {
		const headline = doc.querySelector('h3.headline,h4.headline');
		if (headline) {
			headline.parentNode.removeChild(headline);
		}
		return headline?.textContent || '';
	}

	// TODO video posts like https://osthessen-news.de/mediathek/video.php?vid=6680#utm_source=website&utm_medium=banner&utm_campaign=mediathek_box_home
	/**
	 * Returns cleaned big article element from einzelansicht page
	 * @param doc Document of page
	 * @returns Singular div.article element without banner ads hopefully
	 */
	getSingularBigArticleOnPage(doc: Document): Element {
		const element = doc.querySelector('div#news');

		// do this with job listing ads maybe if get annoying
		// const ad = element.getElementsByClassName('content-banner');
		// if (ad.length > 0) {
		// 	while (ad.length > 0) {
		// 		// console.log(ad);
		// 		ad[0].parentNode.removeChild(ad[0]);
		// 	}
		// }
		return element;
	}

	relinkDetailLinksToLocal(content: string): string {
		const element = this.requests.htmlDocumentFragmentFromString(content);

		const nonSportSelector = 'a[href*="https://osthessen-news.de/n"]';
		// sometimes for sports different url
		const sportSelector = 'a[href*="https://osthessen-news.de/sport/n"]';

		const allDetailsLinks = Array.from(
			element.querySelectorAll(`${nonSportSelector},${sportSelector}`)
		);
		allDetailsLinks.map((aTag: HTMLLinkElement) => {
			const cleanedArticleSlug = aTag.href
				.replace(OSTHESSEN_NEWS_BASE_URL, '')
				.replace('.html', '');
			aTag.href = `/article/${this.currentIntegration}/${encodeURIComponent(cleanedArticleSlug)}`;
		});
		return element.querySelector('div.page').innerHTML;
	}

	removeImages(content: string): string {
		const element = this.requests.htmlDocumentFragmentFromString(content);
		const allImages = Array.from(element.querySelectorAll('img'));
		// removes all of them
		allImages.forEach((imgTag) => imgTag.parentNode.removeChild(imgTag));

		const editedHtml = element.querySelector('div')?.innerHTML;
		if (!editedHtml) {
			// TODO fix this problem
			// console.log(content);
			// console.warn('Could not successfully remove images from html!');
		}
		return editedHtml || content;
	}

	isAd(doc: Document): boolean {
		return (
			doc.querySelector('div.kicker > strong')?.textContent?.toLowerCase().includes('anzeige') ||
			false
		);
	}
}
