<script lang="ts">
    import { onMount } from "svelte";

    // for icon use https://cweili.github.io/svelte-fa/
    import Fa from "svelte-fa";
    import { faAdjust } from "@fortawesome/free-solid-svg-icons";

    import { DARK_MODE_STORAGE_KEY } from "../constants";
    import { isCurrentlyDarkMode } from "../logic/DarkMode";

    let isDarkMode = false;

    function toggleClasses() {
        window.document.body.classList.toggle("light-mode");
        window.document.body.classList.toggle("dark-mode");
    }

    const initialize = () => {
        // initialize at loading;
        // if not exists is null which is also falsey
        const storedValue = localStorage.getItem(DARK_MODE_STORAGE_KEY);
        isDarkMode = !!storedValue && storedValue === "true";

        if (isDarkMode && !isCurrentlyDarkMode()) {
            // default class is light so toggle to wanted dark mode
            toggleClasses();
        }
    };
    onMount(initialize);

    // thank https://svelte.dev/repl/ed4fef4beceb4b0eb295d1f9fdf3bd62?version=3.6.9
    const changeMode = () => {
        // reverse value and save to localStorage
        isDarkMode = !isDarkMode;
        localStorage.setItem(DARK_MODE_STORAGE_KEY, isDarkMode + "");

        // and set styles
        toggleClasses();
    };
</script>

<button class="fa-btn-interaction default-color-btn" on:click={changeMode}>
    <Fa icon={faAdjust} size="lg" />
</button>

<style lang="scss">
    button {
        position: fixed;
        right: 7px;
        top: 10px;
    }
</style>
