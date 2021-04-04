<script lang="ts">
	import GoHomeButton from "../components/GoHomeButton.svelte";
	import DarkModeToggle from "../components/DarkModeToggle.svelte";
	import FullScreenCenterLoader from "../components/FullScreenCenterLoader.svelte";
	import SponsorHaterToggle from "../components/SponsorHaterToggle.svelte";

	import { SelectorMagic } from "../logic/SelectorMagic";
	import { Processing } from "../logic/Processing";
	import { Requests } from "../logic/Requests";

	import { OSTHESSEN_BASE_URL } from "../constants";

	const req = new Requests();
	const processing = new Processing();
	const selectorMagic = new SelectorMagic();

	export let encodedArticleSlug: string;

	const articleUrlFromslug = () => {
		return (
			OSTHESSEN_BASE_URL +
			decodeURIComponent(encodedArticleSlug) +
			".html"
		);
	};

	const getArticlePage = async () => {
		const articlePageDom = await req.getDom(articleUrlFromslug());

		const articleElement = selectorMagic.getSingularBigArticleOnPage(
			articlePageDom
		);
		let article = processing.processHtmlElementsAsArticle([
			articleElement,
		])[0];

		article = processing.processArticle(articlePageDom);
		return article;
	};
</script>

<main>
	<GoHomeButton />
	<DarkModeToggle />
	<SponsorHaterToggle/>

	{#await getArticlePage()}
		<FullScreenCenterLoader />
	{:then article}
		<article class="readingWrapper">
			<h1>{article.title}</h1>
			<h2>{article.byline}</h2>

			<div class="detailRow">
				<div class="articleTxtColumn">
					<p>{@html article.content}</p>
					<a href={articleUrlFromslug()} target="_blank"
						>Original auf www.osthessen-zeitung.de</a
					>
				</div>
				<div class="imageColumn">
					{#each article.imageUrls as url}
						<div
							class="articleImg"
							style="background-image: url('{url}');"
						/>
					{/each}
				</div>
			</div>
		</article>
	{/await}
</main>

<style>
	.detailRow {
		display: flex;
		/* desktop side by side */
		flex-direction: row;
	}

	@media (max-width: 640px) {
		/* phones basically */
		.detailRow {
			/* under the article */
			flex-direction: column;
		}
	}

	.imageColumn {
		margin-left: 25px;

		flex-direction: column;
		flex-basis: auto;
		align-items: flex-start;
		justify-content: flex-start;
	}

	.articleImg {
		flex-grow: 1;
		width: 20vw;
		height: 35vh;
		margin: 10px;
		background-size: contain;
		background-repeat: no-repeat;
		background-position: center;
	}
</style>
