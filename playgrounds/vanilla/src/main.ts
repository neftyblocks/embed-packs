import './style.scss';
import '@neftyblocks/packs';
import { WalletUser } from '@nefty/use/dist/wallet';
import { useWallet } from './wallet';

const el = document.querySelector('#neftyblocks-packs');
const form = document.querySelector('#neftyblocks-form');
const login = document.querySelector('#wallet-login');
const logout = document.querySelector('#wallet-logout');

let account: { actor: string; permission: string } | null = null;
let collection = 'alpacaworlds';

const mountEl = () => {
    if (el) {
        el.innerHTML = '';

        const config = {
            atomic_url: 'https://aa.neftyblocks.com',
            chain_url: 'https://wax.neftyblocks.com',
            marketplace_url: 'https://neftyblocks.com/marketplace/listing',
            chain: 'wax',
            collection,
        };

        const embed = `<neftyblocks-packs 
                        config=${JSON.stringify(config)} 
                    />`;

        el.innerHTML = embed;

        // Listen for sign event
        const component = document.querySelector('neftyblocks-packs');

        if (component && window.provider_user) {
            component.addEventListener('sign', async ({ detail }: any) => {
                try {
                    const result = await window.provider_user.signTransaction(
                        { actions: detail },
                        {
                            broadcast: true,
                            blocksBehind: 3,
                            expireSeconds: 120,
                        },
                    );

                    component.setAttribute('transaction', result.transaction.transaction_id);
                } catch (e) {
                    console.error(e);

                    component.setAttribute('transaction', 'unset');
                }
            });
        }
    }
};

const callback = (users: WalletUser[]): void => {
    const component = document.querySelector('neftyblocks-packs');

    const [walletUser] = users;

    window.provider_user = walletUser;
    window.provider_user.requestPermission = walletUser.requestPermission || 'active';

    login?.classList.add('hidden');
    logout?.classList.remove('hidden');

    if (walletUser) {
        account = {
            actor: walletUser.accountName,
            permission: walletUser.requestPermission || 'active',
        };

        console;

        if (component) component.setAttribute('account', JSON.stringify(account));

        if (logout) logout.innerHTML = `Logout (${account.actor})`;

        logout?.addEventListener('click', () => {
            window.provider.logoutUser();
            account = null;

            login?.classList.remove('hidden');
            logout.classList.add('hidden');
            logout.innerHTML = '';

            if (component) component.setAttribute('account', 'unset');
        });
    }

    const anchorModal = document.querySelector('.anchor-link-active');
    if (anchorModal) anchorModal.classList.remove('anchor-link-active');
};

useWallet({
    chain_url: 'https://wax.neftyblocks.com',
    chain_id: '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4',
    callback,
});

form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form as HTMLFormElement);
    const collectionData = formData.get('neftyblocks-collection');

    if (collectionData) {
        collection = collectionData as string;

        mountEl();

        if (account) {
            const component = document.querySelector('neftyblocks-packs');

            if (component) component.setAttribute('account', JSON.stringify(account));
        }
    }
});

login?.addEventListener('click', () => {
    window.provider.loginUser(window.wallet_anchor);
});

mountEl();
