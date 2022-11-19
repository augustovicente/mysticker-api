import { abi, contract_address } from "App/Solidity/contract";
import { stickers } from "App/Solidity/stickers";
import Web3 from 'web3';
const web3 = new Web3("https://goerli.infura.io/v3/fee8917ab09e4e409ada6f602b288672");
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
        const contract = new web3.eth.Contract(abi as any, contract_address);
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
        // a raridade do pais é bronze
        let available = await get_available_stickers(country.id);
        if(available > 0)
        {
            for(let index = 0; index < available; index++)
            {
                bronze_stickers.push({
                    id: country.id,
                    name: country.country,
                    rarity: 3
                });   
            }
        }
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

export {
    get_bronze_stickers,
    get_silver_stickers,
    get_gold_stickers
};