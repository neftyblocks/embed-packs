import { useFetch, useAssetData, useImageUrl } from '@nefty/use';
import type { Payload } from '../types';
import { getNameAsHex } from '../utils';

export const getPacks = async ({ atomic_url, chain_url, collection, account }) => {
    const hexName = getNameAsHex(collection);

    const tableData = {};
    const templateIds = [];
    const result = [];

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
        for (let i = 0; i < data.rows.length; i++) {
            const { pack_template_id, display_data, unlock_time, use_count, pack_id, recipe_id } = data.rows[i];

            tableData[pack_template_id] = {
                pack_id,
                recipe_id,
                template_id: pack_template_id,
                display_data: display_data ? JSON.parse(display_data) : null,
                unlock_time,
                use_count,
                asset_ids: [],
                name: null,
                image: null,
                video: null,
                template_mint: null,
            };

            templateIds.push(pack_template_id);
        }
    }

    const { data: dataTemplates, error: errorTemplates } = await useFetch<Payload>('/atomicassets/v1/assets', {
        baseUrl: atomic_url,
        params: {
            owner: account.actor,
            collection_name: collection,
            template_ids: templateIds.join(','),
        },
    });

    if (errorTemplates) {
        console.error(errorTemplates);
        return null;
    }

    if (dataTemplates) {
        for (let i = 0; i < dataTemplates.data.length; i++) {
            const { template, asset_id } = dataTemplates.data[i];

            if (template?.template_id && tableData[template.template_id]) {
                const asset = useAssetData(dataTemplates.data[i]);
                const { img, name, video } = asset;

                tableData[template.template_id].asset_ids.push(asset_id);
                tableData[template.template_id].name = name;
                tableData[template.template_id].image = img ? useImageUrl(img as string) : null;
                tableData[template.template_id].video = video ? useImageUrl(video as string) : null;
                tableData[template.template_id].template_mint = template.template_mint;
            }
        }

        const keys = Object.keys(tableData);

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];

            if (tableData[keys[i]].asset_ids.length > 0) result.push(tableData[key]);
        }
    }

    return result;
};
