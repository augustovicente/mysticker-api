const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { abi, evm } = require('./compile');

require('dotenv').config()
const INITIAL_MESSAGE = "Hi there!"

// web3 instance
const provider = new HDWalletProvider(
    process.env.WALLET_WORDS,
    "https://goerli.infura.io/v3/fee8917ab09e4e409ada6f602b288672"
)
const web3 = new Web3(provider)

const deploy = async () => {
    const accounts = await web3.eth.getAccounts()
    console.log("Attempting to deploy from account", accounts[0])

    const result = await new web3.eth.Contract(abi)
        .deploy({ data: evm.bytecode.object, arguments: [INITIAL_MESSAGE] })
        .send({ gas: '1000000', from: accounts[1] });

    console.log("Contract deployed to", result.options.address)
    // comment out the below line to avoid deploying the contract again
    provider.engine.stop()
}

deploy()