<script lang="ts">
	import { Router, Link, Route } from "svelte-routing";

	import ArticleDetail from "./routes/ArticleDetail.svelte";
	import Homepage from "./routes/Homepage.svelte";

	// Used for SSR. A falsy value is ignored by the Router.
	// TODO check out ssr performance
	// export let url = "";
</script>

<!-- importing global stylesheets -->
<svelte:head>
	<style lang="scss">
		/* Global CSS via SCSS imports */
		@import "globalStyles/flushing.scss"; // clearing defaults
		@import "globalStyles/colors.scss"; // all the color definitions
		@import "globalStyles/readability.scss"; // make easy to read with fonts, spacing,...
		@import "globalStyles/darkMode.scss"; // globals concerning dark mode
		@import "globalStyles/customGlobal.scss"; // custom global definitions
	</style>
</svelte:head>


<!-- TODO eslint and typical rules like '' not "" -->
<Router>
	<!-- url="{url}" -->
	<nav>
		<!-- <Link to="/">Homepage</Link> -->
		<!-- <Link to="about">About</Link> -->
		<!-- <Link to="blog">Blog</Link> -->
	</nav>

	<Route path="article/:encodedArticleSlug" component={ArticleDetail} />
	<!-- <Route path="article/:articleUrl" let:params>
		<ArticleDetail articleUrl="{params.articleUrl}" />
	</Route> -->
	<Route path="/:pageString" component={Homepage} />
	<Route path="" pageString="1" component={Homepage} />
</Router>
