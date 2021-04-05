<script lang="ts">
    // for icon use https://cweili.github.io/svelte-fa/
    import Fa from "svelte-fa";
    import { faBackward, faForward } from "@fortawesome/free-solid-svg-icons";

    // has to be string not intuitive number because svelte routing gives strings
    export let currentPage: string;

    const previousPage = () => {
        const previousPage = Number.parseInt(currentPage) - 1;
        const firstPageAlready = previousPage < 1;
        // bit of workaround but whatever
        return firstPageAlready ? "javascript:;" : `/page/${previousPage}`;
    };

    const nextPage = () => {
        return `/page/${Number.parseInt(currentPage) + 1}`;
    };
</script>

<div id="pagerContainer">
    {@debug currentPage}
    <a class="pageChange default-color-btn" href={previousPage()}>
        <Fa icon={faBackward} size="lg" />
    </a>
    <span id="currentPage" class="default-color-btn">{currentPage}</span>
    <a class="pageChange default-color-btn" href={nextPage()}>
        <Fa icon={faForward} size="lg" />
    </a>
</div>

<style lang="scss">
    div#pagerContainer {
        text-align: center;
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
