import { useFetch } from '@nefty/use';
import type { Payload } from '../types';
import { getNameAsHex } from '../utils';

export const getPacks = async ({ atomic_url, chain_url, collection, account }) => {
    const hexName = getNameAsHex(collection);

    const tableData = {};
    const templateIds = [];

    const { data, error } = await useFetch<any>('/v1/chain/get_table_rows', {
        baseUrl: chain_url,
        method: 'POST',
        body: {
            json: true,
            code: 'neftyblpacks',
            scope: 'neftyblpacks',
            table: 'packs',
            lower_bound: `0000000000000000${hexName}00000000000000000000000000000000`,
            upper_bound: `0000000000000000${hexName}ffffffffffffffffffffffffffffffff`,
            index_position: 3,
            key_type: 'sha256',
            limit: 1000,
            reverse: true,
            show_payer: false,
        },
    });

    if (error) {
        console.error(error);
        return null;
    }

    if (data) {
        console.log(data);

        for (let i = 0; i < data.rows.length; i++) {
            const { pack_template_id, display_data, unlock_time, use_count, pack_id, recipe_id } = data.rows[i];

            tableData[pack_template_id] = {
                pack_id,
                recipe_id,
                template_id: pack_template_id,
                display_data: display_data ? JSON.parse(display_data) : null,
                unlock_time,
                use_count,
            };

            console.log(pack_template_id);

            templateIds.push(pack_template_id);
        }
    }

    const { data: dataTemplates, error: errorTemplates } = await useFetch<Payload>('/atomicassets/v1/assets', {
        baseUrl: atomic_url,
        params: {
            owner: account,
            collection_name: collection,
            template_ids: templateIds.join(','),
        },
    });

    if (errorTemplates) {
        console.error(errorTemplates);
        return null;
    }

    if (dataTemplates) {
        console.log(dataTemplates);
    }
};
