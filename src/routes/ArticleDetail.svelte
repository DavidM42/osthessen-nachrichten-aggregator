<script lang="ts">
	import GoHomeButton from "../components/GoHomeButton.svelte";
	import DarkModeToggle from "../components/DarkModeToggle.svelte";
	import FullScreenCenterLoader from "../components/FullScreenCenterLoader.svelte";
	import SponsorHaterToggle from "../components/SponsorHaterToggle.svelte";
	import ShareButton from "../components/ShareButton.svelte";

	import { IntegrationOsthessenNews } from "../logic/Integrations/IntegrationOsthessenNews";
	import { IntegrationOsthessenZeitung } from "../logic/Integrations/IntegrationOsthessenZeitung";
	import type { BaseIntegration } from "../logic/Integrations/BaseIntegration";
import type { ArticleType } from "../types/article";

	let currentIntegration: BaseIntegration;
	const oNewsI = new IntegrationOsthessenNews();
	const oZeitungI = new IntegrationOsthessenZeitung();

	export let encodedArticleSlug: string;
	let articleUrl: string;

	// filled by content await then call to getArticlePage()
	// then used by svelte head too
	let article: ArticleType;

	const getArticlePage = async () => {
		const decodedSlug = decodeURIComponent(encodedArticleSlug);
		// TODO these checks really safe way or better extra param in url
		const isOsthessenZeitungSlug = decodedSlug.startsWith('einzelansicht');
		// match with regex of n then 8 digits like
		// /n11648422/wir-spielen-wieder-die-70-bad-hersfelder-festspiele-sind-eroeffnet
		const isOsthessenNewsSlug = new RegExp('n\\d{8}\/').test(decodedSlug);

		if (isOsthessenZeitungSlug) {
			currentIntegration = oZeitungI;
		} else if(isOsthessenNewsSlug) {
			currentIntegration = oNewsI;
		} else {
			throw new Error('Unknown detail page url slug!');
		}

		articleUrl = currentIntegration.articleUrlFromslug(encodedArticleSlug);
		const articlePageDom = await currentIntegration.requests.getDom(articleUrl);

		const articleElement = currentIntegration.selectorMagic.getSingularBigArticleOnPage(
			articlePageDom
		);
		article = currentIntegration.processing.processHtmlElementsAsArticle([
			articleElement,
		])[0];

		article = currentIntegration.processing.processArticle(articlePageDom);
		return article;
	};
</script>

<svelte:head>
	{#if article}
		<title>ONA - {article.title}</title>
		<meta property="og:image" content="{article.imageUrls[0]}">
		<meta name="description" content="{ (article.excerpt || article.textContent.substring(0, 150)) }"/>
	{/if}
</svelte:head>

<main>
	<GoHomeButton />
	<DarkModeToggle />
	<SponsorHaterToggle />
	<ShareButton title="" text="Hey schau dir diesen Artikel an " url="{window.location.href}"/>

	{#await getArticlePage()}
		<FullScreenCenterLoader />
	{:then article}
		<article class="readingWrapper">
			<h1>{article.title}</h1>
			<h2>{article.byline}</h2>

			<div class="masonry">
				<div class="articleTxtColumn">
					<p>{@html article.content}</p>
					<a
						class="moreInfo"
						href={articleUrl}
						target="_blank">Original auf {currentIntegration.HOST}</a
					>
				</div>
				{#each article.imageUrls as url}
					<div
						class="articleImg"
						style="background-image: url('{url}');"
					/>
				{/each}
			</div>
		</article>
	{/await}
</main>

<style lang="scss">
	/* masonry inspiration from https://css-tricks.com/piecing-together-approaches-for-a-css-masonry-layout/ */
	.masonry {
		display: flex;
		flex-wrap: wrap;

		div {
			margin: 0 1rem 1rem 0;
		}

		.articleTxtColumn {
			max-width: 55%;
		}

		.articleImg {
			/* background: #25313a3f; */
			flex: 1 0 auto;

			min-height: 20vh;
			min-width: 15vw;

			background-size: contain;
			background-repeat: no-repeat;
			/* background-position: center; */
			background-position: top center;
		}

		/* on phones require bigger widths for text and images */
		@media (max-width: 1024px) {
			.articleTxtColumn {
				/* Full width for article */
				max-width: 100%;
			}

			.articleImg {
				min-height: 30vh;
				min-width: 45vw;
			}
		}
	}
</style>
