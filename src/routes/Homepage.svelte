<script lang="ts">
	import { link } from "svelte-routing";

	import DarkModeToggle from "../components/DarkModeToggle.svelte";
	import FullScreenCenterLoader from "../components/FullScreenCenterLoader.svelte";
	import SponsorHaterToggle from "../components/SponsorHaterToggle.svelte";
	import PageChange from "../components/PageChange.svelte";
	import Header from "../components/Header.svelte";

	import { IntegrationOsthessenNews } from "../logic/Integrations/IntegrationOsthessenNews";
	import { IntegrationOsthessenZeitung } from "../logic/Integrations/IntegrationOsthessenZeitung";
import { mergeTwoArraysSwitching } from "../logic/arrayMixerHelper";

	// has to be string not intuitive number because svelte routing gives strings
	export let pageString: string;

	const oNewsI = new IntegrationOsthessenNews();
	const oZeitungI = new IntegrationOsthessenZeitung();


	const getHomepage = async () => {

		const zeroIndexedPage = Number.parseInt(pageString) - 1;
		const ozDetails = await oZeitungI.getArticleElements(zeroIndexedPage);
		const onDetails = await oNewsI.getArticleElements(zeroIndexedPage);

		// mix both sourced articles switching between them
		const articleDetails = mergeTwoArraysSwitching(ozDetails, onDetails);
		return articleDetails;
	};
</script>

<main id="homepage">
	<Header/>
	<DarkModeToggle />
	<SponsorHaterToggle />

	{#await getHomepage()}
		<FullScreenCenterLoader />
	{:then homepageArticles}
		<article class="readingWrapper">
			{#each homepageArticles as homepageArticle}
				{#if homepageArticle}
					<h1 class="articleTitle">{homepageArticle.title}</h1>
					<h2>{homepageArticle.byline}</h2>

					<div class="detailRow">
						<div class="imageColumn">
							{#each homepageArticle.imageUrls as url}
								<div
									class="articleImg"
									style="background-image: url('{url}');"
								/>
							{/each}
						</div>
						<div class="articleTxtColumn">
							<p>{@html homepageArticle.content}</p>
							<a href={homepageArticle.readMoreLink} use:link
								>Weiterlesen</a
							>
						</div>
					</div>
				{/if}
			{/each}
			<PageChange bind:currentPage={pageString} />
		</article>
	{/await}
</main>

<style lang="scss">
	h1.articleTitle {
		margin-top: 25px;
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
