import { abi, contract_address } from "App/Solidity/contract";
import { stickers } from "App/Solidity/stickers";
import { no_wallet_web3 } from "./Web3Service";
export type Sticker = {
    id: number,
    name: string,
    rarity: number,
};
// contract get available stickers
const get_available_stickers: (number) => Promise<number> = (id:number) =>
{
    return new Promise((resolve, reject) =>
    {
        const contract = new no_wallet_web3.eth.Contract(abi as any, contract_address);
        contract.methods.getAvailable(id).call().then((result) =>
        {
            resolve(result);
        })
        .catch((error) =>
        {
            reject(error);
        });
    });
}
// get the stickers
const get_bronze_stickers = async () =>
{
    let bronze_stickers:Sticker[] = [];
    for(const country of stickers)
    {
        // pegando os jogadores
        for(const player of country.players)
        {
            if(player.rarity === 3)
            {
                let _available = await get_available_stickers(player.id);
                if(_available > 0)
                {
                    for(let index = 0; index < _available; index++)
                    {
                        bronze_stickers.push({
                            id: player.id,
                            name: player.name,
                            rarity: player.rarity
                        });
                    }
                }
            }
        }
    }

    return bronze_stickers;
};
const get_silver_stickers = async () =>
{
    let silver_stickers:Sticker[] = [];
    for(const country of stickers)
    {
        // pegando os jogadores
        for(const player of country.players)
        {
            if(player.rarity === 2)
            {
                let _available = await get_available_stickers(player.id);
                if(_available > 0)
                {
                    for(let index = 0; index < _available; index++)
                    {
                        silver_stickers.push({
                            id: player.id,
                            name: player.name,
                            rarity: player.rarity
                        });
                    }
                }
            }
        }
    }

    return silver_stickers;
};
const get_gold_stickers = async () =>
{
    let gold_stickers:Sticker[] = [];
    for(const country of stickers)
    {
        // pegando os jogadores
        for(const player of country.players)
        {
            if(player.rarity === 1)
            {
                let _available = await get_available_stickers(player.id);
                if(_available > 0)
                {
                    for(let index = 0; index < _available; index++)
                    {
                        gold_stickers.push({
                            id: player.id,
                            name: player.name,
                            rarity: player.rarity
                        });
                    }
                }
            }
        }
    }

    return gold_stickers;
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
    get_bronze_stickers,
    get_silver_stickers,
    get_gold_stickers,
    check_if_has_all_from_country
};