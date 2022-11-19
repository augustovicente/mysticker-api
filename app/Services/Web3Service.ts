import HDWalletProvider from '@truffle/hdwallet-provider';
import Web3 from 'web3';
import Env from '@ioc:Adonis/Core/Env';
import { abi, contract_address } from 'App/Solidity/contract';

export const mint_package = async (pack_type: 1|2|3, address: string, stickers:number[]) =>
{
    const provider = new HDWalletProvider(
        Env.get('WALLET_WORDS'),
        "https://goerli.infura.io/v3/fee8917ab09e4e409ada6f602b288672"
    );
    const web3 = new Web3(provider);
    
    const contract = new web3.eth.Contract(abi as any, contract_address);
    const {1: contract_account} = await web3.eth.getAccounts();
    // mintando nfts
    return await contract.methods.mint_stycker_pack(stickers, address, pack_type, 1)
        .send({ from: contract_account})
}