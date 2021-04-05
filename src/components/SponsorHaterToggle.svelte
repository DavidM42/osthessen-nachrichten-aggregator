<script lang="ts">
    import { onMount } from "svelte";

    // for icon use https://cweili.github.io/svelte-fa/
    import Fa from "svelte-fa";
    import { faAd } from "@fortawesome/free-solid-svg-icons";

    import { AGGRESIVE_SPONSOR_HATER_KEY } from "../constants";
    import { sponsorHater } from "./../stores";

    let isSponsorHater = false;

    const initialize = () => {
        // initialize at loading;
        // if not exists is null which is also falsey
        const storedValue = localStorage.getItem(AGGRESIVE_SPONSOR_HATER_KEY);
        isSponsorHater = !!storedValue && storedValue === "true";
        sponsorHater.set(isSponsorHater);
    };
    onMount(initialize);

    const changeOpinion = () => {
        // reverse value and save to localStorage
        isSponsorHater = !isSponsorHater;
        localStorage.setItem(AGGRESIVE_SPONSOR_HATER_KEY, isSponsorHater + "");
        sponsorHater.update((v) => !v); // toggle

        // TODO somehow have to smarter re render current page in this case
        window.location.reload();
    };
</script>

<button
    class="fa-btn-interaction"
    on:click={changeOpinion}
    class:enabled={isSponsorHater}
    title="Block alle Sponsor Bilder"
>
    <Fa icon={faAd} size="lg" />
</button>

<style lang="scss">
    button {
        // sponsor block button get's special colors
        // no change between light and dark mode too
        background-color: #333;
        color: white;

        position: fixed;
        right: 7px;
        top: 50px;
    }

    button.enabled {
        background-color: rgb(175, 2, 2);
    }
</style>
