<script context="module" lang="ts">
	import { IntegrationOsthessenNews } from '$lib/logic/Integrations/IntegrationOsthessenNews';
	import { IntegrationOsthessenZeitung } from '$lib/logic/Integrations/IntegrationOsthessenZeitung';
	import { mergeTwoArraysSwitching } from '$lib/logic/arrayMixerHelper';

	const oNewsI = new IntegrationOsthessenNews();
	const oZeitungI = new IntegrationOsthessenZeitung();

	const getHomepage = async (pageNumber: string) => {
		const zeroIndexedPage = Number.parseInt(pageNumber) - 1;
		const ozDetails = await oZeitungI.getArticleElements(zeroIndexedPage);
		const onDetails = await oNewsI.getArticleElements(zeroIndexedPage);

		// mix both sourced articles switching between them
		const articleDetails = mergeTwoArraysSwitching(ozDetails, onDetails);
		return articleDetails;
	};

	/** @type {import('@sveltejs/kit').Load} */
	export async function load({ params, fetch }) {
		const pageNumber = params.pageNumber;
		return {
			// cache page for 2 minutes
			// https://kit.svelte.dev/docs/loading#output-maxage
			maxage: 120,

			props: {
				homepageArticles: await getHomepage(pageNumber),
				pageString: pageNumber
			}
		};
	}
</script>

<script lang="ts">
	import { beforeNavigate } from '$app/navigation';

	import DarkModeToggle from '$lib/components/DarkModeToggle.svelte';
	import SponsorHaterToggle from '$lib/components/SponsorHaterToggle.svelte';
	import PageChange from '$lib/components/PageChange.svelte';
	import Header from '$lib/components/Header.svelte';

	import type { ArticleType } from '$lib/types/article';

	// has to be string not intuitive number because svelte routing gives strings
	export let pageString: string;

	export let homepageArticles: ArticleType[];

	function appendSourcePageNumberToLink(link: string) {
		return `${link}?page=${pageString}`;
	}

	/** add anchor to url before moving away for back button return */
	// does not work like this and probably not needed anyways since server side rendering state can be restored
	// would need to add title anchor conversion as hash not url

	// beforeNavigate((navigation: { from: URL; to: URL | null; cancel: () => void }) => {
	// 	if (navigation.to) {
	// 		const split = navigation.to.pathname.split('article/');

	// 		if (split.length === 2) {
	// 			const hashAnchor = split[1];
	// 			const url = new URL(window.location.href);
	// 			url.hash = hashAnchor;
	// 			window.history.pushState({}, '', url);
	// 		}
	// 	}
	// });
</script>

<svelte:head>
	<title>ONA - Osthessen Nachrichten Aggregator</title>
	<meta name="description" content="Nachrichten aus Osthessen gesammelt und schön aufbereitet" />

	<meta property="og:image" content="/icons/android-chrome-512x512.png" />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="512" />
	<meta property="og:image:height" content="512" />
</svelte:head>

<main id="homepage">
	<Header />
	<DarkModeToggle />
	<!-- TODO disabled until client/server side storage topic is decided -->
	<!-- <SponsorHaterToggle /> -->

	<article class="readingWrapper">
		{#each homepageArticles as homepageArticle}
			{#if homepageArticle}
				<h1 id={homepageArticle.anchorId || 'hää'} class="articleTitle">{homepageArticle.title}</h1>

				{#if homepageArticle.byline}
					<h2>{homepageArticle.byline}</h2>
				{/if}

				<div class="detailRow">
					<div class="imageColumn">
						{#each homepageArticle.imageUrls as url}
							<div class="articleImg" style="background-image: url('{url}');" />
						{/each}
					</div>
					<div class="articleTxtColumn">
						<p>{@html homepageArticle.content}</p>
						<a href={appendSourcePageNumberToLink(homepageArticle.readMoreLink)} sveltekit:prefetch
							>Weiterlesen</a
						>
					</div>
				</div>
			{/if}
		{/each}
		<PageChange bind:currentPage={pageString} />
	</article>
</main>

<style lang="scss">
	h1.articleTitle {
		padding-top: 25px;
	}

	.detailRow {
		display: flex;
		flex-direction: row;
		/* flex-basis: 40%; */
	}

	.imageColumn {
		margin-right: 25px;

		flex-direction: column;
		flex-basis: auto;
	}

	.articleImg {
		flex-grow: 1;
		width: 20vw;
		height: 100%;
		background-size: contain;
		background-repeat: no-repeat;
		background-position: left top;
	}
</style>
