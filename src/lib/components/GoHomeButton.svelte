<script lang="ts">
	import { beforeNavigate, goto } from '$app/navigation';
	// for icon use https://cweili.github.io/svelte-fa/
	import { faStepBackward } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	export let originatingFeed: string;
	export let sourcePageNumber: number | null;
	export let lastPageAnchor: string;

	let backUrl = sourcePageNumber ? `/${originatingFeed}/page/${sourcePageNumber}` : '/';
	if (lastPageAnchor) {
		backUrl += `#${lastPageAnchor}`;
		// pushState('', backUrl);
		// console.log('pushing into backUrl with anchor into history: ', backUrl);
	}

	beforeNavigate((navigation) => {
		// override back navigation to restore anchor if navigating back from article to page
		if (navigation.to && navigation.to.route.id === '/[source]/page/[pageNumber]') {
			// eslint-disable-next-line svelte/no-navigation-without-resolve
			goto(backUrl, { replaceState: false });
		}
	});
</script>

<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
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
