import type { Integrations } from '$lib/types/integrations';
import type { ArticleType } from '../../types/article';
import type { ProcessingOsthessenNews } from '../Processing/ProcessingOsthessenNews';
import type { ProcessingOsthessenZeitung } from '../Processing/ProcessingOsthessenZeitung';
import type { Requests } from '../Requests';
import type { SelectorMagicOsthessenNews } from '../Selectors/SelectorMagicOsthessenNews';
import type { SelectorMagicOsthessenZeitung } from '../Selectors/SelectorMagicOsthessenZeitung';

/**
 * Base integration class containing all needed sub classes and vars for the integrations
 */
export abstract class BaseIntegration {
	public selectorMagic!: SelectorMagicOsthessenNews | SelectorMagicOsthessenZeitung;
	public processing!: ProcessingOsthessenZeitung | ProcessingOsthessenNews;

	public HOST!: string;
	public BASE_URL!: string;

	constructor(
		public integration: Integrations,
		public requests: Requests
	) {}

	/**
	 * Gives full url to retrieve article just from slug
	 * @param encodedArticleSlug Slug to get article url for
	 */
	public articleUrlFromslug(encodedArticleSlug: string) {
		return this.BASE_URL + decodeURIComponent(encodedArticleSlug) + '.html';
	}

	/**
	 * Get original image from thumbnail. Input url to thumbnail image and get back url to original image.
	 * Currently only needed for osthessen news as osthessen zeitung already has original images in article snippets.
	 */
	public abstract getOriginalImageOfThumbnail(thumbnailImgUrl: string): string;

	/**
	 * Gets all article elements on given page of integration
	 * @param pageNumber number Current page index starting from 0
	 */
	public abstract getArticleElements(pageNumber: number): Promise<ArticleType[]>;
}
