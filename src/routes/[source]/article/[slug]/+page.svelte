<script lang="ts">
	import { browser } from '$app/environment';
	import DarkModeToggle from '$lib/components/DarkModeToggle.svelte';
	import GoHomeButton from '$lib/components/GoHomeButton.svelte';
	import ImageViewer from '$lib/components/ImageViewer.svelte';
	import ShareButton from '$lib/components/ShareButton.svelte';

	// filled by load function
	let { data, params } = $props();

	// optional query parameter for going back to correct page
	const sourcePageNumberString = data.url.searchParams.get('page');
	let sourcePageNumber: number | null = $state(null);
	if (sourcePageNumberString) {
		try {
			sourcePageNumber = Number.parseInt(sourcePageNumberString);
		} catch (e) {
			console.warn(e);
		}
	}

	if (!data.url && browser) {
		data.url = new URL(window.location.href);
	}

	let imageViewerRef: ImageViewer | null = null;
	const imageUrls = data.article?.imageUrls || [];
</script>

<svelte:head>
	{#if data.article}
		<title>ONA - {data.article.title}</title>
		<meta property="og:image" content={data.article.imageUrls[0]} />
		<meta
			name="description"
			content={data.article.excerpt || data.article.textContent.substring(0, 150)}
		/>
	{/if}
</svelte:head>

<main>
	<GoHomeButton {sourcePageNumber} source={params.source} lastPageAnchor={data.article.anchorId} />
	<DarkModeToggle />
	<!-- TODO disabled until client/server side storage topic is decided -->
	<!-- <SponsorHaterToggle /> -->
	<ShareButton title="" text="Hey schau dir diesen Artikel an " url={data.url.href} />

	<article class="readingWrapper">
		<h1>{data.article.title}</h1>
		<h2>{data.article.byline}</h2>

		<div class="masonry">
			<div class="articleTxtColumn">
				<p>{@html data.article.content}</p>
				<a class="moreInfo" href={data.articleUrl} target="_blank"
					>Original auf {data.currentIntegration.HOST}</a
				>
			</div>
			{#each imageUrls as url, index (index)}
				<div
					class="articleImg"
					style="background-image: url('{url}');"
					onclick={() => imageViewerRef?.open(index)}
				></div>
			{/each}
		</div>
	</article>

	<ImageViewer
		bind:this={imageViewerRef}
		{imageUrls}
		currentIntegration={data.currentIntegration}
	/>
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
			cursor: pointer;
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
