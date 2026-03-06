<script lang="ts">
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import favicon from '$lib/assets/favicon.svg';
	import FullScreenCenterLoader from '$lib/components/FullScreenCenterLoader.svelte';

	let { children } = $props();

	let loading = $state(false);

	beforeNavigate(() => (loading = true));

	afterNavigate(() => (loading = false));
</script>

<svelte:head>
	<link rel="icon" href={favicon} />

	<style lang="scss">
		/* Global CSS via SCSS imports */
		@use '$lib/globalStyles/flushing.scss'; // clearing defaults
		@use '$lib/globalStyles/colors.scss'; // all the color definitions
		@use '$lib/globalStyles/readability.scss'; // make easy to read with fonts, spacing,...
		@use '$lib/globalStyles/darkMode.scss'; // globals concerning dark mode
		@use '$lib/globalStyles/customGlobal.scss'; // custom global definitions
	</style>
</svelte:head>

{#if loading}
	<FullScreenCenterLoader />
{/if}

{@render children()}
