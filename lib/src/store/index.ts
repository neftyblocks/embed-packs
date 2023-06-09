import { writable } from 'svelte/store';
import type { Settings } from '../types';

export const settings = writable<Settings>({
    account: null,
    config: null,
    transactionId: null,
    pack: null,
});

export * from './packsActions';
