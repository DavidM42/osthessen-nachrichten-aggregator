<script lang="ts">
    import { onMount } from 'svelte';

    // for icon use https://cweili.github.io/svelte-fa/
    import Fa from 'svelte-fa';
    import { faAdjust } from '@fortawesome/free-solid-svg-icons';
    
    import { DARK_MODE_STORAGE_KEY } from '../constants';
    import { isCurrentlyDarkMode } from '../logic/DarkMode';

    let isDarkMode = false;

    function toggleClasses() {
        window.document.body.classList.toggle("light-mode");
        window.document.body.classList.toggle("dark-mode");
    }

    const initialize = () => {
        // initialize at loading;
        // if not exists is null which is also falsey
        const storedValue = localStorage.getItem(DARK_MODE_STORAGE_KEY);
        isDarkMode = !!storedValue && storedValue === 'true';

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
        localStorage.setItem(DARK_MODE_STORAGE_KEY, isDarkMode + '');

        // and set styles
        toggleClasses();
    }
</script>

<button on:click={changeMode}>
    <Fa icon={faAdjust} size="lg"/>
</button>

<style>
    button {
        background-color: #f76027;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 0.5rem;
        text-transform: uppercase;

        /* position: sticky;
        align-self: flex-end; */
        position: fixed;
        z-index: 10;

        width: 50px;
        right: 7px;
        top: 10px;
    }
    :global(body.dark-mode) button {
        background-color: #0084f6;
        color: white;
    }
</style>
