<script lang="ts">
	let { source } = $props();
</script>

<header>
	<div class="container">
		<div id="sourceSelectorGroup" class={source}>
			<a href="/ohn/page/1" data-sveltekit-preload-data="hover">Osthessen-News</a>
			<a href="/all/page/1" data-sveltekit-preload-data="hover">Alle</a>
			<a href="/ohz/page/1" data-sveltekit-preload-data="hover">Osthessen-Zeitung</a>
		</div>
		<div id="logoContainer">
			<a href="/">
				<img src="/icons/logo.svg" alt="Osthessen Nachrichten Aggregator" />
			</a>
		</div>
		<h1>Osthessen Nachrichten Aggregator</h1>
	</div>
</header>

<style lang="scss">
	@use '../globalStyles/colors.scss' as *; // all the color definitions

	header {
		padding-top: 50px;
	}

	#sourceSelectorGroup {
		display: flex;
		justify-content: space-between;
		margin-bottom: 25px;

		padding: 10px;
		border-radius: 3px;
		/* fallback just to see text if source given */
		background-color: #333;

		&.ohz {
			background-color: $color-ohz;
		}

		&.ohn {
			background-color: $color-ohn;
		}

		&.all {
			background-color: $color-ohn;
			background-image: linear-gradient(90deg, $color-ohn 30%, $color-ohz 70%);
		}

		& a {
			color: #dadada;
			text-decoration: none;
		}
	}

	#logoContainer {
		width: 20%;
	}
</style>
