<script lang="ts">
    // for icon use https://cweili.github.io/svelte-fa/
    import Fa from 'svelte-fa';
    import { faBackward, faForward } from '@fortawesome/free-solid-svg-icons';

    // has to be string not intuitive number because svelte routing gives strings
    export let currentPage: string;

    const previousPage = () => {
        const previousPage = Number.parseInt(currentPage) - 1;
        const firstPageAlready = previousPage < 1;
        // bit of workaround but whatever
        return firstPageAlready? 'javascript:;' : `./${previousPage}`;
    };

    const nextPage = () => {
        return `./${Number.parseInt(currentPage) + 1}`;
    }
</script>

<div id="pagerContainer">
    {@debug currentPage}
    <a class="pageChange" href={previousPage()} >
        <Fa icon={faBackward} size="lg"/>
    </a>
    <span id="currentPage">{currentPage}</span>
    <a class="pageChange" href={nextPage()}>
        <Fa icon={faForward} size="lg"/>
    </a>
</div>

<style>
    div#pagerContainer {
        text-align: center;
        margin-top: 50px;
    }

    a.pageChange {
        /* consolidate all those buttons into global styles */
        background-color: #f76027;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 0.5rem;
    }
    :global(body.dark-mode) a.pageChange {
        background-color: #0084f6;
        color: white;
    }

    /* TODO consolidate css more */
    span#currentPage {
        background-color: #f76027;
        color: white;
        border-radius: 4px;
        padding: 0.5rem 3rem;
        font-size: 1.5em;
    }
    :global(body.dark-mode) span#currentPage {
        background-color: #0084f6;
        color: white;
    }
</style>
