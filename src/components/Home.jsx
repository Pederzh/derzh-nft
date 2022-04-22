import {ethers} from "ethers";
import WalletBalance from "./WalletBalance";
import {useState, useEffect} from "react";
import DerzhNFT from '../artifacts/contracts/DerzhNFT.sol/DerzhNFT.json'

const contractAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3';
const provider = new ethers.providers.Web3Provider(window.ethereum); //ethers creates a web3 provider

//get the end user (that signed the contract)
const signer = provider.getSigner();

//get the smart contract
const contract = new ethers.Contract(contractAddress, DerzhNFT.abi, signer);

function Home(){
    const [totalMinted, setTotalMinted] = useState(0);
    useEffect(() => {
        getCount();
    }, []);

    const getCount = async () => {
        const count = await contract.count();
        console.log(parseInt(count));
        setTotalMinted(parseInt(count));
    };

    return (
        <div>
            <WalletBalance />

            <h1>Fired Guys NFT Collection</h1>
            <div className="container">
                <div className="row">
                    {Array(totalMinted + 1)
                        .fill(0)
                        .map((_, i) => (
                            <div key={i} className="col-sm">
                                <NFTImage tokenId={i + 1} getCount={getCount} />
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}

function NFTImage({ tokenId, getCount }) {
    const contentId = 'QmaV8KCKPK12KaP2F8pqRcSZHr8jstTejbvya3esUeHitm'; //Pinata folder containing NFTs
    const metadataURI = `${contentId}/${tokenId}.json`;
    const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.png`;
    //const imageURI = `img/${tokenId}.png`;
    console.log(imageURI)

    const [isMinted, setIsMinted] = useState(false);
    useEffect(() => {
         getMintedStatus();
    }, [isMinted]);

    const getMintedStatus = async () => {
        const result = await contract.isContentOwned(metadataURI);
        console.log(result)
        setIsMinted(result);
    };

    const mintToken = async () => {
        //On Metamask localhost change open Settings -> Networks -> Localhost:8545
        //And change the Chain ID to 31337
        const connection = contract.connect(signer); //connect the contract and the signer
        const addr = connection.address; //so we can access the recipient wallet address
        //call the function 'payToMint' of our contract
        const result = await contract.payToMint(addr, metadataURI, {
            value: ethers.utils.parseEther('0.05'), //amount of ether to pay
        });

        await result.wait();
        getMintedStatus();
        getCount();
    };

    async function getURI() {
        const uri = await contract.tokenURI(tokenId);
        alert(uri);
    }
    return (
        <div className="card" style={{ width: '18rem' }}>
            <img className="card-img-top" src={isMinted ? imageURI : 'img/placeholder.png'}></img>
            <div className="card-body">
                <h5 className="card-title">ID #{tokenId}</h5>
                {!isMinted ? (
                    <button className="btn btn-primary" onClick={mintToken}>
                        Mint
                    </button>
                ) : (
                    <button className="btn btn-secondary" onClick={getURI}>
                        Taken! Show URI
                    </button>
                )}
            </div>
        </div>
    );
}

export default Home;