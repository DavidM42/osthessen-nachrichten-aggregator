<script lang="ts">
    import { onMount } from "svelte";

    // for icon use https://cweili.github.io/svelte-fa/
    import Fa from "svelte-fa";
    import { faShareAlt } from "@fortawesome/free-solid-svg-icons";

    export let title: string;
    export let text: string;
    export let url: string;

    let shareApiExists = false;

    // TODO maybe smarter pre render then only satisfy condition onMount?
    // but api never exists on server
    const initialize = () => {
        shareApiExists = !!navigator.share;
    };
    onMount(initialize);

    const shareArticle = () => {
        if (navigator?.share) {
            navigator.share({
                title: title,
                text: text,
                url: url,
            })
            .then(() => console.log('Successful share'))
            .catch((error) => console.log('Error sharing', error));
        } else {
            console.warn('PWA share api does not exist');
        }
    };
</script>

{#if shareApiExists}
    <button class="fa-btn-interaction default-color-btn" on:click={shareArticle}>
        <Fa icon={faShareAlt} size="lg" />
    </button>
{/if}

<style lang="scss">
    button {
        position: fixed;
        right: 7px;
        top: 90px;
    }

</style>
