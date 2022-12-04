import HDWalletProvider from '@truffle/hdwallet-provider';
import NonceTrackerSubprovider from "web3-provider-engine/subproviders/nonce-tracker";
import Web3 from 'web3';
import Env from '@ioc:Adonis/Core/Env';
import { abi, contract_address } from 'App/Solidity/contract';

const endpoint = "https://polygon-rpc.com/";
// const endpoint = "https://goerli.infura.io/v3/fee8917ab09e4e409ada6f602b288672";
const provider = new HDWalletProvider( Env.get('WALLET_WORDS'), endpoint );
const nonceTracker = new NonceTrackerSubprovider()
provider.engine._providers.unshift(nonceTracker)
nonceTracker.setEngine(provider.engine)

const web3 = new Web3(provider);
const contract = new web3.eth.Contract(abi as any, contract_address);
const no_wallet_web3 = new Web3(endpoint);

const mint_package = async (pack_type: 1|2|3, address: string, stickers:number[], amount:number) =>
{
    let gasPrice = await web3.eth.getGasPrice()
    // mintando nfts
    return await contract.methods.mint_stycker_pack(stickers, address, pack_type, amount)
        .send({
            from: provider.getAddress(0),
            gasPrice: gasPrice,
        });
}

const burn_for_mint = async (stickers_to_burn: number[], address: string, stickers_to_mint:number[]) =>
{
    let amounts_burn = stickers_to_burn.map(() => 1);
    let amounts_mint = stickers_to_mint.map(() => 1);
    let gasPrice = await web3.eth.getGasPrice()
    // mintando nfts
    return await contract.methods
        .manager_burnForMint(address, stickers_to_burn, amounts_burn, stickers_to_mint, amounts_mint)
        .send({
            from: provider.getAddress(0),
            gasPrice: gasPrice,
        })
}

const get_sticker_balance = async (address: string, sticker_ids: number[]) =>
{
    return await contract.methods
        .balanceOfBatch(
            sticker_ids.map(() => address),
            sticker_ids
        )
        .call();
}

export {
    no_wallet_web3,
    burn_for_mint,
    mint_package,
    get_sticker_balance,
}