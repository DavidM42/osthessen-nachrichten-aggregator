<script lang="ts">
	import { Stretch } from 'svelte-loading-spinners';
	import { isCurrentlyDarkMode } from '../logic/DarkMode';

	const spinnerColor = () => {
		if (isCurrentlyDarkMode()) {
			// TODO get scss vars somehow
			return '#0084f6';
		} else {
			return '#f76027';
		}
	};
</script>

<!-- TODO timeout for this boy so you know it's broken at some point -->
<div id="spinnerContainer">
	<div id="spinner">
		<Stretch size="60" color={spinnerColor()} unit="px" />
	</div>
</div>

<style lang="scss">
	#spinnerContainer {
		/* make full viewport and sit above all content */
		position: fixed;
		inset: 0; /* top:0; right:0; bottom:0; left:0; */
		width: 100%;
		height: 100%;
		z-index: 9999;

		/* semi-opaque overlay */
		background-color: rgba(0, 0, 0, 0.45);

		/* center spinner */
		display: flex;
		justify-content: center;
		align-items: center;

		/* optional smooth fade in/out */
		opacity: 1;
		transition: opacity 200ms ease;
	}

	#spinner {
		/* keep spinner visually above overlay if needed */
		z-index: 10000;
		pointer-events: none; /* spinner won't block pointer events if you want clicks to pass through — remove to block interactions */
	}
</style>
