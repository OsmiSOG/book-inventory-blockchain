let web3Provider

$(document).ready(() => {
    if (typeof web3 !== 'undefined') {
        web3Provider = web3.currentProvider
    } else {
        web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    console.log(web3Provider.eth);
    // web3.eth.defaultAccount = web3.eth.accounts[0];
    // console.log(web3.eth.defaultAccount);
    getWeb3(web3Provider).then(() => {

    })
})

async function getWeb3(web3) {
    web3 = new Web3(web3Provider)  
    web3.eth.defaultAccount = await web3.eth.accounts[0];
    console.log(web3.eth.defaultAccount);
}