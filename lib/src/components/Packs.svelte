<svelte:options tag="nefty-packs-group" />

<script lang="ts">
    import { get_current_component, onMount } from 'svelte/internal';
    import { useSWR } from '@nefty/use';
    import { getPacks, settings } from '../store';

    // COMPONENTS

    // GLOBALS
    const component = get_current_component();

    // STATES
    let data = undefined;

    // METHODS
    const asyncData = async (config, account) => {
        data = await useSWR<any>(`packs-${config.collection}`, () =>
            getPacks({
                atomic_url: config.atomic_url,
                chain_url: config.chain_url,
                collection: config.collection,
                account,
            })
        );
    };

    const unsubscribe = settings.subscribe(async ({ config, account }) => {
        if (config && account) {
            await asyncData(config, account);
        }
    });

    onMount(() => {
        return () => {
            unsubscribe();
        };
    });
</script>

<main />
