import {useState} from "react";
import {ethers} from "ethers"; //easy to communicate between smart contract and end user wallet
import {Space, Button, Typography} from "antd";
import {
    EyeInvisibleOutlined,
    EyeOutlined
} from '@ant-design/icons';
const {Text} = Typography;

function WalletBalance() {
    const [balance, setBalance] = useState(null);

    const getBalance = async () => {
        if(balance != null){
            setBalance(null);
            return;
        }
        const [account] = await window.ethereum.request({method: 'eth_requestAccounts'}); //get connected account
        const provider = new ethers.providers.Web3Provider(window.ethereum); //ethers creates a web3 provider
        //provider: provides all kind of different methods for interactive with the blockchain
        const userBalance = await provider.getBalance(account);
        setBalance(ethers.utils.formatEther(userBalance));

    }

    return(
        <div className="card">
            <Space>
                <Text strong>{`Your Balance: ${(balance != null) ? `${balance} ETH` : ''}`}</Text>
                <Button
                    onClick={() => getBalance()}
                    shape="circle"
                    icon={(balance != null) ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                />
            </Space>
        </div>
    );
}

export default WalletBalance;