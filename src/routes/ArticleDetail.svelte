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

			<div class="masonry">
				<div class="articleTxtColumn">
					<p>{@html article.content}</p>
					<a class="moreInfo" href={articleUrlFromslug()} target="_blank"
						>Original auf www.osthessen-zeitung.de</a
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
