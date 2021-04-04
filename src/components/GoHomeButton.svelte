<script lang="ts">
    import { navigate } from "svelte-routing";

    // for icon use https://cweili.github.io/svelte-fa/
    import Fa from 'svelte-fa';
    import { faStepBackward } from '@fortawesome/free-solid-svg-icons';

    function goHome() {
        // navigate("/") // breaks gh pages
        history.back() // native js browser reloads
    }
</script>

<button on:click={goHome}>
    <Fa icon={faStepBackward} size="lg"/>
</button>

<style>
    button {
        background-color: #f76027;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 0.5rem;
        text-transform: uppercase;

        /* position: sticky; */
        /* align-self: flex-start; */

        position: fixed;
        z-index: 10;

        width: 50px;
        left: 7px;
        top: 10px;
    }
    :global(body.dark-mode) button {
        background-color: #0084f6;
        color: white;
    }
</style>
