<svelte:options tag="neftyblocks-packs" />

<script lang="ts">
    import { settings } from './store';
    import { onMount } from 'svelte/internal';

    // COMPONENTS
    import './components/Packs.svelte';
    // GLOBALS

    // STATES
    export let account: string | null = null;
    export let config: string | null = null;
    export let transactionid: string | null = null;

    // METHODES
    onMount(() => {
        // onDestroy clean up store
        return () => {
            $settings = {
                account: null,
                config: null,
                transactionId: null,
            };

            account = null;
            config = null;
            transactionid = null;
        };
    });

    $: {
        if (account && account !== JSON.stringify($settings.account)) {
            settings.update((s) => {
                s.account = account !== 'unset' ? JSON.parse(account) : null;
                account = null;

                return s;
            });
        }

        if (config && config !== JSON.stringify($settings.config)) {
            settings.update((s) => {
                s.config = JSON.parse(config);
                config = null;

                return s;
            });
        }

        if (transactionid) {
            settings.update((s) => {
                s.transactionId = transactionid;
                transactionid = null;

                return s;
            });
        }
    }
</script>

<main>
    <nefty-packs-group />
</main>
