import {useState} from "react";
import {ethers} from "ethers"; //easy to communicate between smart contract and end user wallet


function WalletBalance() {
    const [balance, setBalance] = useState();

    const getBalance = async () => {
        const [account] = await window.ethereum.request({method: 'eth_requestAccounts'}); //get connected account
        const provider = new ethers.providers.Web3Provider(window.ethereum); //ethers creates a web3 provider
        //provider: provides all kind of different methods for interactive with the blockchain
        const balance = await provider.getBalance(account);
        setBalance(ethers.utils.formatEther(balance));

    }

    return(
        <div className="card">
            <div>
                <h5>Your balance: {balance}</h5>
                <button onClick={() => getBalance()}>Show balance</button>
            </div>
        </div>
    );
}

export default WalletBalance;