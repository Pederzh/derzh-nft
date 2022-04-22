import {ethers} from "ethers";
import WalletBalance from "./WalletBalance";
import {useState, useEffect} from "react";
import DerzhNFT from '../artifacts/contracts/DerzhNFT.sol/DerzhNFT.json'
import {Card, Button, Row, Col, Layout, Typography, Divider} from 'antd';
import {Content} from "antd/es/layout/layout";

const {Title} = Typography;

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
        setTotalMinted(parseInt(count));
    };

    return (
        <Layout className="layout" style={{display: 'flex', justifyContent: 'center', textAlign: 'center', padding: 8}}>
            <Title level={1}>ACN Eyes</Title>
            <WalletBalance />
            <Divider/>
            <Title level={4}>NFT Collection</Title>
            <Content style={{ padding: '0 50px', height: '100vh', display: 'flex', justifyContent: 'center', }}>
            <div style={{maxWidth: 1600, minWidth: 800}}>
                <Row gutter={16}>
                    {Array(totalMinted + 1)
                        .fill(0)
                        .map((_, i) => (
                            <Col key={i} span={8}>
                                <NFTImage tokenId={i + 1} getCount={getCount} />
                            </Col>
                        ))}
                </Row>
            </div>
            </Content>
        </Layout>
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
        <Card
            hoverable
            style={{maxWidth: 400}}
            cover={<img className="card-img-top" src={isMinted ? imageURI : 'img/placeholder.png'}></img>}
        >
            <Card.Meta
                title={`ID ${tokenId}`}
                description={
                <div>
                    {!isMinted ? (
                        <Button type="primary" onClick={mintToken}>
                            Mint
                        </Button>
                    ) : (
                        <Button onClick={getURI}>
                            Taken! Show URI
                        </Button>
                    )}
                </div>
                }
            />
        </Card>
    );
}

export default Home;