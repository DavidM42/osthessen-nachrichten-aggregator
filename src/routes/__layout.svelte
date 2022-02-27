<!-- importing global stylesheets -->
<svelte:head>
	<style lang="scss">
		/* Global CSS via SCSS imports */
		@import "../globalStyles/flushing.scss"; // clearing defaults
		@import "../globalStyles/colors.scss"; // all the color definitions
		@import "../globalStyles/readability.scss"; // make easy to read with fonts, spacing,...
		@import "../globalStyles/darkMode.scss"; // globals concerning dark mode
		@import "../globalStyles/customGlobal.scss"; // custom global definitions
	</style>
</svelte:head>

<slot></slot>