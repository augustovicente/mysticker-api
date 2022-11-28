import { abi, contract_address } from "App/Solidity/contract";
import { stickers } from "App/Solidity/stickers";
import { no_wallet_web3 } from "./Web3Service";
export type Sticker = {
    id: number,
    name: string,
    rarity: number,
};
// contract get available stickers
const get_available_stickers_batch: (ids:number[]) => Promise<number[]> = (ids:number[]) =>
{
    return new Promise((resolve, reject) =>
    {
        const contract = new no_wallet_web3.eth.Contract(abi as any, contract_address);
        contract.methods.getAvailableBatch(ids).call().then((result) =>
        {
            resolve(result);
        })
        .catch((error) =>
        {
            reject(error);
        });
    });
}
// get all stickers
const get_all_stickers = async () =>
{
    let all_stickers:any = {
        bronze: [],
        silver: [],
        gold: []
    };
    let all_stickers_return:any = {
        bronze: [],
        silver: [],
        gold: []
    };
    for(const country of stickers)
    {
        // pegando os jogadores
        for(const player of country.players)
        {
            switch(player.rarity)
            {
                case 3:
                    all_stickers.bronze.push({
                        id: player.id,
                        name: player.name,
                        rarity: player.rarity
                    });
                    break;
                case 2:
                    all_stickers.silver.push({
                        id: player.id,
                        name: player.name,
                        rarity: player.rarity
                    });
                    break;
                case 1:
                    all_stickers.gold.push({
                        id: player.id,
                        name: player.name,
                        rarity: player.rarity
                    });
                    break;
            }
        }
    }

    let available_broze = await get_available_stickers_batch(all_stickers.bronze.map((sticker) => sticker.id));
    let available_silver = await get_available_stickers_batch(all_stickers.silver.map((sticker) => sticker.id));
    let available_gold = await get_available_stickers_batch(all_stickers.gold.map((sticker) => sticker.id));
    
    for (const [_i, available] of available_broze.entries())
    {
        if(available > 0)
        {
            for(let index = 0; index < available; index++)
            {
                all_stickers_return.bronze.push(all_stickers.bronze[_i]);
            }
        }
    }

    for (const [_i, available] of available_silver.entries())
    {
        if(available > 0)
        {
            for(let index = 0; index < available; index++)
            {
                all_stickers_return.silver.push(all_stickers.silver[_i]);
            }
        }
    }

    for (const [_i, available] of available_gold.entries())
    {
        if(available > 0)
        {
            for(let index = 0; index < available; index++)
            {
                all_stickers_return.gold.push(all_stickers.gold[_i]);
            }
        }
    }

    return all_stickers_return;
}

const check_if_has_all_from_country = async (country_id: number, user_address:string) =>
{
    let country_count:number = 0;
    for(const country of stickers)
    {
        if(country.id === country_id)
        {
            for(const player of country.players)
            {
                const contract = new no_wallet_web3.eth.Contract(abi as any, contract_address);
                const amount = await contract.methods.balanceOf(user_address, player.id).call()
                if(amount > 0)
                {
                    country_count++;
                }
            }
            if(country_count === country.players.length)
            {
                return country.players.map((player) => player.id);
            }
            else
            {
                return false;
            }
        }
    }
}

export {
    check_if_has_all_from_country,
    get_all_stickers
};