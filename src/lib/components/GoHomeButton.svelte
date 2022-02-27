<script lang="ts">
    // for icon use https://cweili.github.io/svelte-fa/
    import Fa from "svelte-fa";
    import { faStepBackward } from "@fortawesome/free-solid-svg-icons";

    export let sourcePageNumber: number;
    export let lastPageAnchor: string;

    let backUrl = sourcePageNumber ? `/page/${sourcePageNumber}` : "/";
    if (lastPageAnchor) {
        backUrl += `#${lastPageAnchor}`;
    }
</script>

<a class="fa-btn-interaction default-color-btn" href={backUrl} sveltekit:prefetch>
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