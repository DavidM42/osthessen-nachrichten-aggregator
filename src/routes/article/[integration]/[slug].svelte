<script lang="ts" context="module">
	import { IntegrationOsthessenNews } from "$lib/logic/Integrations/IntegrationOsthessenNews";
	import { IntegrationOsthessenZeitung } from "$lib/logic/Integrations/IntegrationOsthessenZeitung";
	import type { BaseIntegration } from "$lib/logic/Integrations/BaseIntegration";
    import type { ArticleType } from "$lib/types/article";
    import { Integrations } from "$lib/types/integrations";

	let currentIntegration: BaseIntegration;
	const oNewsI = new IntegrationOsthessenNews();
	const oZeitungI = new IntegrationOsthessenZeitung();

	let articleUrl: string;

	const getArticlePage = async (integrationString: string, encodedArticleSlug: string): Promise<ArticleType> => {
        let article;
		const decodedSlug = decodeURIComponent(encodedArticleSlug);
		const isOsthessenZeitungSlug = integrationString === Integrations.OSTHESSEN_ZEITUNG;
		const isOsthessenNewsSlug = integrationString === Integrations.OSTHESEN_NEWS;

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

    /** @type {import('@sveltejs/kit').Load} */
    export async function load({
        url,
		params
	}) {
		return {
			// cache page for 5 minutes
			// https://kit.svelte.dev/docs/loading#output-maxage
			maxage: 60 * 5,

			props: {
				article: await getArticlePage(params.integration, params.slug),
                url: url
			}
		};
	}

</script>

<script lang="ts">
	import GoHomeButton from "$lib/components/GoHomeButton.svelte";
	import DarkModeToggle from "$lib/components/DarkModeToggle.svelte";
	import SponsorHaterToggle from "$lib/components/SponsorHaterToggle.svelte";
	import ShareButton from "$lib/components/ShareButton.svelte";
    import { browser } from "$app/env";

	// filled by load function
	// then used by svelte head too
	export let article: ArticleType;

    export let url: URL;

	// optional query parameter for going back to correct page
	const sourcePageNumberString = url.searchParams.get('page');
	let sourcePageNumber = null;
	if (sourcePageNumberString) {
		try {
			sourcePageNumber = Number.parseInt(sourcePageNumberString);
		} catch(e) {
			console.warn(e);
		}
	}


    if (!url && browser) {
        url = new URL(window.location.href);
    }
</script>

<svelte:head>
	{#if article}
		<title>ONA - {article.title}</title>
		<meta property="og:image" content="{article.imageUrls[0]}">
		<meta name="description" content="{ (article.excerpt || article.textContent.substring(0, 150)) }"/>
	{/if}
</svelte:head>

<main>
	<GoHomeButton {sourcePageNumber} lastPageAnchor={article.anchorId}/>
	<DarkModeToggle />
	<!-- TODO disabled until client/server side storage topic is decided -->
	<!-- <SponsorHaterToggle /> -->
	<ShareButton title="" text="Hey schau dir diesen Artikel an " url="{url.href}"/>

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
                ></div>
            {/each}
        </div>
    </article>
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
			// max-width: 55vw;
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
