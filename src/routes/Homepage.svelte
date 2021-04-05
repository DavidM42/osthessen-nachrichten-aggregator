<script lang="ts">
	import { link } from 'svelte-routing';

	import DarkModeToggle from '../components/DarkModeToggle.svelte';
	import FullScreenCenterLoader from '../components/FullScreenCenterLoader.svelte';
	import SponsorHaterToggle from '../components/SponsorHaterToggle.svelte';
	import PageChange from '../components/PageChange.svelte';

	import { SelectorMagic } from '../logic/SelectorMagic';
	import { Processing } from '../logic/Processing';
	import { Requests } from '../logic/Requests';

    // has to be string not intuitive number because svelte routing gives strings
	export let pageString: string;

	const req = new Requests();
	const processing = new Processing();
	const selectorMagic = new SelectorMagic();

	const getHomepage = async () => {
		// first page if none given else further ones
		const homepageUrl = `https://www.osthessen-zeitung.de/seite/${(Number.parseInt(pageString) || 1) + ''}.html`;
		const homepageDom = await req.getDom(homepageUrl);
		const articleElements = selectorMagic.getArticleSnippetsOnPage(homepageDom);
		return processing.processHtmlElementsAsArticle(articleElements);
	}
</script>

<main id="homepage">
	<DarkModeToggle/>
	<SponsorHaterToggle/>

	<!-- TODO more pages like page 2 and so on -->
	{#await getHomepage()}
		<FullScreenCenterLoader></FullScreenCenterLoader>
	{:then homepageArticles}
		<article class="readingWrapper">
			{#each homepageArticles as homepageArticle}
				{#if homepageArticle}
					<h1 class="articleTitle">{homepageArticle.title}</h1>
					<h2>{homepageArticle.byline}</h2>

					<div class="detailRow">
						<div class="imageColumn">
							{#each homepageArticle.imageUrls as url}
								<div class="articleImg" style="background-image: url('{url}');"></div>
							{/each}
						</div>
						<div class="articleTxtColumn">
							<p>{@html homepageArticle.content}</p>
							<a href="{homepageArticle.readMoreLink}" use:link>Weiterlesen</a>
						</div>
					</div>
				{/if}
			{/each}
			<PageChange bind:currentPage={pageString}></PageChange>
		</article>
	{/await}
</main>

<style>
h1.articleTitle {
	margin-top: 50px;
}

.detailRow {
	display: flex;
	flex-direction: row;
	/* flex-basis: 40%; */
}

.imageColumn  {
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