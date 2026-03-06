<script lang="ts">
	import { browser } from '$app/environment';
	import DarkModeToggle from '$lib/components/DarkModeToggle.svelte';
	import GoHomeButton from '$lib/components/GoHomeButton.svelte';
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

	// Popout image viewer state
	let showImageViewer = $state(false);
	let currentImageIndex = $state(0);
	const imageUrls = data.article?.imageUrls || [];

	function openImageViewer(idx: number) {
		currentImageIndex = idx;
		showImageViewer = true;
	}
	function closeImageViewer() {
		showImageViewer = false;
	}
	function prevImage() {
		currentImageIndex = (currentImageIndex - 1 + imageUrls.length) % imageUrls.length;
	}
	function nextImage() {
		currentImageIndex = (currentImageIndex + 1) % imageUrls.length;
	}
	function getDownloadHref() {
		// need to serve this from same domain because of security restrictions in new browsers
		// https://stackoverflow.com/a/59031245
		const currentImageUrl = imageUrls[currentImageIndex];
		const nonThumbnailLink = data.currentIntegration.getOriginalImageOfThumbnail(currentImageUrl);
		return `/content/${encodeURIComponent(nonThumbnailLink)}`;
	}

	function getDownloadFileName() {
		const currentImageUrl = imageUrls[currentImageIndex];
		const nonThumbnailLink = data.currentIntegration.getOriginalImageOfThumbnail(currentImageUrl);
		return nonThumbnailLink.split('/').pop() || 'image_' + Math.random().toString(36).substring(7);
	}

	// Keybindings for image viewer
	function handleViewerKeydown(e: KeyboardEvent) {
		if (!showImageViewer) return;
		if (e.key === 'Escape') {
			closeImageViewer();
		} else if (e.key === 'ArrowLeft') {
			prevImage();
		} else if (e.key === 'ArrowRight') {
			nextImage();
		} else if (e.key === 'Enter') {
			const a = document.createElement('a');
			a.href = getDownloadHref();
			a.download = getDownloadFileName();
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		}
	}

	$effect(() => {
		if (showImageViewer) {
			window.addEventListener('keydown', handleViewerKeydown);
			return () => window.removeEventListener('keydown', handleViewerKeydown);
		}
	});
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
					onclick={() => openImageViewer(index)}
				></div>
			{/each}
		</div>
	</article>

	{#if showImageViewer}
		<div class="imageViewerOverlay">
			<button class="closeBtn" onclick={closeImageViewer} aria-label="Close">✕</button>
			<button class="navBtn left" onclick={prevImage} aria-label="Previous">◀</button>
			<img
				class="popoutImg"
				src={data.currentIntegration.getOriginalImageOfThumbnail(imageUrls[currentImageIndex])}
				alt="Popout view"
			/>
			<button class="navBtn right" onclick={nextImage} aria-label="Next">▶</button>
			<a
				class="downloadBtn"
				download={getDownloadFileName()}
				href={getDownloadHref()}
				aria-label="Download">⬇️ Download</a
			>
		</div>
	{/if}
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

	.imageViewerOverlay {
		position: fixed;
		inset: 0;
		z-index: 99999;
		background: rgba(0, 0, 0, 0.85);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		animation: fadeIn 0.2s;

		.closeBtn {
			position: absolute;
			top: 32px;
			right: 32px;
			background: none;
			border: none;
			color: #fff;
			font-size: 2.5rem;
			cursor: pointer;
			z-index: 100001;
		}

		.navBtn {
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			background: rgba(0, 0, 0, 0.5);
			border: none;
			color: #fff;
			font-size: 2.5rem;
			cursor: pointer;
			z-index: 100001;
			&.left {
				left: 32px;
			}
			&.right {
				right: 32px;
			}
		}

		.popoutImg {
			max-width: 80vw;
			max-height: 80vh;
			border-radius: 8px;
			box-shadow: 0 0 32px rgba(0, 0, 0, 0.5);
			margin: 0 auto;
		}

		.downloadBtn {
			position: absolute;
			bottom: 32px;
			left: 50%;
			transform: translateX(-50%);
			background: rgba(0, 0, 0, 0.7);
			color: #fff;
			border: none;
			padding: 0.75em 2em;
			border-radius: 24px;
			font-size: 1.2rem;
			cursor: pointer;
			z-index: 100001;
			text-decoration: none;
		}
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
