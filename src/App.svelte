


<script lang="ts">
	import { Router, Link, Route } from "svelte-routing";

	import ArticleDetail from "./routes/ArticleDetail.svelte";
	import Homepage from "./routes/Homepage.svelte";
	

  	// Used for SSR. A falsy value is ignored by the Router.
	// TODO check out ssr
	// export let url = "";
</script>

<Router> <!-- url="{url}" -->
	<nav>
		<!-- <Link to="/">Homepage</Link> -->
		<!-- <Link to="about">About</Link> -->
		<!-- <Link to="blog">Blog</Link> -->
	</nav>

	<!-- TODO better way than prefixing project name eventually or just own subdomain -->
	<Route path="article/:encodedArticleSlug" component="{ArticleDetail}"/>
	<!-- <Route path="article/:articleUrl" let:params>
		<ArticleDetail articleUrl="{params.articleUrl}" />
	</Route> -->
    <Route path="/:pageString" component="{Homepage}"/>
    <Route path="" pageString="1" component="{Homepage}"/>
</Router>

<style>
</style>