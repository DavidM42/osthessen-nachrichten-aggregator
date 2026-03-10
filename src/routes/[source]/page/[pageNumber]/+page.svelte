<script lang="ts">
	import DarkModeToggle from '$lib/components/DarkModeToggle.svelte';
	import Header from '$lib/components/Header.svelte';
	import PageChange from '$lib/components/PageChange.svelte';

	let { data, params } = $props();

	function appendSourcesToLink(link: string) {
		return `${link}?page=${params.pageNumber}&feed=${params.source}`;
	}

	let currentPage = $derived(params.pageNumber);

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
	<Header source={params.source} />
	<DarkModeToggle />
	<!-- TODO disabled until client/server side storage topic is decided -->
	<!-- <SponsorHaterToggle /> -->

	<article class="readingWrapper">
		{#each data.homepageArticles as homepageArticle, index (index)}
			{#if homepageArticle}
				<h1 id={homepageArticle.anchorId || ''} class="articleTitle">{homepageArticle.title}</h1>
				{#if params.source === 'all'}
					<div class={['source', homepageArticle.siteName]}></div>
				{/if}

				{#if homepageArticle.byline}
					<h2>{homepageArticle.byline}</h2>
				{/if}

				<div class="detailRow">
					<div class="imageColumn">
						{#each homepageArticle.imageUrls as url, index (index)}
							<div class="articleImg" style="background-image: url('{url}');"></div>
						{/each}
					</div>
					<div class="articleTxtColumn">
						<p>{@html homepageArticle.content}</p>
						<a
							href={appendSourcesToLink(homepageArticle.readMoreLink)}
							data-sveltekit-preload-data="hover">Weiterlesen</a
						>
					</div>
				</div>
			{/if}
		{/each}
		<PageChange {currentPage} />
	</article>
</main>

<style lang="scss">
	@use '../../../../lib/globalStyles/colors.scss' as *;

	h1.articleTitle {
		padding-top: 25px;
	}

	.detailRow {
		display: flex;
		flex-direction: row;
		/* flex-basis: 40%; */
	}

	.source {
		width: 20vw;
		height: 3px;

		&.ohz {
			background-color: $color-ohz;
		}

		&.ohn {
			background-color: $color-ohn;
		}
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
