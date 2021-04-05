<script lang="ts">
    import { navigate } from "svelte-routing";

    // for icon use https://cweili.github.io/svelte-fa/
    import Fa from "svelte-fa";
    import { faStepBackward } from "@fortawesome/free-solid-svg-icons";

    function goHome() {
        navigate("/"); // breaks gh pages
        // history.back() // native js browser reloads
    }
</script>

<button class="fa-btn-interaction default-color-btn" on:click={goHome}>
    <Fa icon={faStepBackward} size="lg" />
</button>

<style lang="scss">
    button {
        position: fixed;
        left: 7px;
        top: 10px;
    }
</style>
