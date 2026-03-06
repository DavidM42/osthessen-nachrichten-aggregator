<script lang="ts">
	// for icon use https://cweili.github.io/svelte-fa/
	import { faStepBackward } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	export let source: string;
	export let sourcePageNumber: number | null;
	export let lastPageAnchor: string;

	let backUrl = sourcePageNumber ? `/${source}/page/${sourcePageNumber}` : '/';
	if (lastPageAnchor) {
		backUrl += `#${lastPageAnchor}`;
	}
</script>

<a class="fa-btn-interaction default-color-btn" href={backUrl} data-sveltekit-preload-data="hover">
	<Fa icon={faStepBackward} size="lg" />
</a>

<style lang="scss">
	a {
		position: fixed;
		left: 7px;
		top: 10px;
		text-align: center;
	}
</style>
