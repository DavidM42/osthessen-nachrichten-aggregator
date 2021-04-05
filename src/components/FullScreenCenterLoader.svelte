<script lang="ts">
	import { Stretch } from 'svelte-loading-spinners'
    import { isCurrentlyDarkMode } from '../logic/DarkMode';

    const spinnerColor = () => {
        if (isCurrentlyDarkMode()) {
            return '#0084f6';
        } else {
            return '#f76027';
        }
    };
</script>

<div id="spinnerContainer">
    <div id="spinner" >
        <Stretch size="60" color="{spinnerColor()}" unit="px"></Stretch>
    </div>
</div>

<style lang="scss">
#spinnerContainer {
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
