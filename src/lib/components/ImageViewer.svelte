<script lang="ts">
	let { imageUrls, currentIntegration } = $props();

	let showImageViewer = $state(false);
	let currentImageIndex = $state(0);

	// Expose open(idx) for parent control
	export function open(idx: number) {
		currentImageIndex = idx;
		showImageViewer = true;
	}
	function close() {
		showImageViewer = false;
	}
	function prev() {
		currentImageIndex = (currentImageIndex - 1 + imageUrls.length) % imageUrls.length;
	}
	function next() {
		currentImageIndex = (currentImageIndex + 1) % imageUrls.length;
	}
	function getDownloadHref() {
		const currentImageUrl = imageUrls[currentImageIndex];
		const nonThumbnailLink = currentIntegration.getOriginalImageOfThumbnail(currentImageUrl);
		return `/content/${encodeURIComponent(nonThumbnailLink)}`;
	}
	function getDownloadFileName() {
		const currentImageUrl = imageUrls[currentImageIndex];
		const nonThumbnailLink = currentIntegration.getOriginalImageOfThumbnail(currentImageUrl);
		return nonThumbnailLink.split('/').pop() || 'image_' + Math.random().toString(36).substring(7);
	}

	function handleViewerKeydown(e: KeyboardEvent) {
		if (!showImageViewer) return;
		if (e.key === 'Escape') {
			close();
		} else if (e.key === 'ArrowLeft') {
			prev();
		} else if (e.key === 'ArrowRight') {
			next();
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

/* eslint-disable svelte/no-navigation-without-resolve */
{#if showImageViewer}
	<div class="imageViewerOverlay">
		<button class="closeBtn" onclick={close} aria-label="Close">✕</button>
		<button class="navBtn left" onclick={prev} aria-label="Previous">◀</button>
		<img
			class="popoutImg"
			src={currentIntegration.getOriginalImageOfThumbnail(imageUrls[currentImageIndex])}
			alt="Popout view"
		/>
		<button class="navBtn right" onclick={next} aria-label="Next">▶</button>
		<a
			class="downloadBtn"
			download={getDownloadFileName()}
			href={getDownloadHref()}
			aria-label="Download">⬇️ Download</a
		>
	</div>
{/if}

<style lang="scss">
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
