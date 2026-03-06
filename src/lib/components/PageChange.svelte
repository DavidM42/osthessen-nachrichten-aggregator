<script lang="ts">
	// for icon use https://cweili.github.io/svelte-fa/
	import { afterNavigate } from '$app/navigation';
	import { faBackward, faForward } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import FullScreenCenterLoader from './FullScreenCenterLoader.svelte';

	// has to be string not intuitive number because svelte routing gives strings
	let { currentPage } = $props();

	let loading = $state(false);

	const previousPage = () => {
		const previousPage = Number.parseInt(currentPage) - 1;
		const firstPageAlready = previousPage < 1;
		// bit of workaround but whatever
		return firstPageAlready ? 'javascript:;' : `./${previousPage}`;
	};

	const nextPage = () => {
		return `./${Number.parseInt(currentPage) + 1}`;
	};

	afterNavigate(() => {
		loading = false;
	});
</script>

{#if loading}
	<FullScreenCenterLoader />
{/if}
<div id="pagerContainer">
	<a
		class="pageChange default-color-btn"
		href={previousPage()}
		onclick={() => (loading = true)}
		data-sveltekit-preload-data="hover"
	>
		<Fa icon={faBackward} size="lg" />
	</a>
	<span id="currentPage" class="default-color-btn">{currentPage}</span>
	<a
		class="pageChange default-color-btn"
		href={nextPage()}
		onclick={() => (loading = true)}
		data-sveltekit-preload-data="hover"
	>
		<Fa icon={faForward} size="lg" />
	</a>
</div>

<style lang="scss">
	div#pagerContainer {
		text-align: center;
		height: 50px;
		margin-top: 50px;
	}

	a.pageChange {
		border-radius: 4px;
		padding: 0.5rem;
	}

	span#currentPage {
		border-radius: 4px;
		padding: 0.5rem 3rem;
		font-size: 1.5em;
	}
</style>
