<svelte:options tag="nefty-packs-item" />

<script lang="ts">
    import { get_current_component, onMount } from 'svelte/internal';
    import { settings } from '../store';

    // COMPONENTS

    // GLOBALS
    const component = get_current_component();

    // STATES
    let data = undefined;

    // METHODS
    const unsubscribe = settings.subscribe(async ({ pack }) => {
        if (pack) {
            data = pack;
        }
    });

    onMount(() => {
        return () => {
            unsubscribe();
        };
    });
</script>

<svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="0"
    height="0"
    style="position: absolute"
>
    <symbol
        id="smile"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        ><circle cx="12" cy="12" r="10" /><path
            d="M8 14s1.5 2 4 2 4-2 4-2"
        /><line x1="9" x2="9.01" y1="9" y2="9" /><line
            x1="15"
            x2="15.01"
            y1="9"
            y2="9"
        /></symbol
    >
    <symbol
        id="packs"
        xml:space="preserve"
        fill-rule="evenodd"
        stroke-linecap="round"
        stroke-linejoin="round"
        clip-rule="evenodd"
        viewBox="0 0 24 24"
        ><path
            class="packs-card"
            fill="var(--nb-bg)"
            fill-rule="nonzero"
            stroke="currentColor"
            stroke-width="1.9"
            d="M1.87 6.3 10.46 4l3.7 13.84-8.58 2.3L1.88 6.3Z"
        /><path
            class="packs-card"
            fill="var(--nb-bg)"
            fill-rule="nonzero"
            stroke="currentColor"
            stroke-width="1.89"
            d="m13.54 4 8.59 2.3L18.46 20l-8.59-2.3L13.54 4Z"
        /><path
            class="packs-card"
            fill="var(--nb-bg)"
            fill-rule="nonzero"
            stroke="currentColor"
            stroke-width="2"
            d="M7.56 4h8.89v16H7.56z"
        /></symbol
    >
</svg>

<main>
    {#if data}
        <div>
            {data.name}
        </div>
    {:else if data === null}
        <p class="error">
            <svg role="presentation" focusable="false" aria-hidden="true">
                <use xlink:href="#smile" />
            </svg>
            Whoops someone dropped the pack
        </p>
    {:else}
        <p class="loading">
            <svg role="presentation" focusable="false" aria-hidden="true">
                <use xlink:href="#packs" />
            </svg>
            loading pack...
        </p>
    {/if}
</main>

<!-- svelte-ignore css-unused-selector -->
<style lang="scss">
    @import '../style/global.scss';
    @import '../style/states.scss';
    @import '../style/button.scss';
</style>
