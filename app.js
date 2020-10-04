//let web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/2ff10f83a74943d9861720160bcddf45'));
//let web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/2ff10f83a74943d9861720160bcddf45'));

const ABI = [
    {
        "inputs": [],
        "stateMutability": "payable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "NewKing",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "Winner",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "BID_INCRASE",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "MIN_BLOCK_DISTANCE",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "OWNER_REVENUE_PERCENT",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "START_BLOCK_DISTANCE",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "blockDistance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "blocksRemain",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "claim",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "currentBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "currentKing",
        "outputs": [
            {
                "internalType": "address payable",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "lastKingBlock",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "minBid",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "placeABid",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "stateMutability": "payable",
        "type": "receive"
    }
];

const CONTRACT_ADDRESS = '0x3A5003C4DB20b6B4C3473971dB7ecf30831ff71B';

//***************************

let ethconnected = false;


let contract;// = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

async function init() {
    contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
    setInterval(async function update() {
        let blocksRemain = await contract.methods.blocksRemain().call();
        $('.blocksRemain').text(blocksRemain + ' BLOCKS');


        let minBid = await contract.methods.minBid().call();
        window.minBid = minBid;
        $('.minBid').text(Number(minBid / 10e18) + ' ETH');


        let currentKing = await contract.methods.currentKing().call();
        $('.currentKing').text(currentKing);

        let treasury = await contract.methods.currentBalance().call();
        $('#treasury').text(Number(treasury / 10e18) + '');


        if(Number(blocksRemain) > 0 && currentKing.toLowerCase() === window.ethaddress.toLowerCase()) {
            $('.currentKing').addClass('red-button');
        } else {
            $('.currentKing').removeClass('red-button');
        }

        if(Number(blocksRemain) < 1 && currentKing.toLowerCase() === window.ethaddress.toLowerCase()) {
            $('#claim').addClass('red-button');
        } else {
            $('#claim').removeClass('red-button');
        }

        if(Number(blocksRemain) < 1 && currentKing.toLowerCase() !== window.ethaddress.toLowerCase()) {
            $('#makeBid').addClass('red-button');
        } else {
            $('#makeBid').removeClass('red-button');
        }


    }, 1000);

    $('#makeBid').click(async function makeBid() {
        console.log('MAKE BID');
//window.ethaddress
        let txHash = await contract.methods.placeABid().send({from: window.ethaddress, value: window.minBid});
    })

    $('#claim').click(async function claim() {
        let tx = await contract.methods.claim().send({from: window.ethaddress});
        console.log(tx)
        window.open("https://ropsten.etherscan.io/tx/" + tx.transactionHash);
    })


}


async function connectWeb3() {
    if(window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        window.conn = await window.ethereum.enable();
        //console.log(conn.length)

        ethconnected = conn.length > 0
        if(ethconnected) {
            window.ethaddress = conn[0]
        }
        //updateConnectStatus()
        console.log(await web3.eth.getAccounts());

        await init();

        return true;
    } else {
        alert('Hi. It looks like your browser does not support Web3. Please install a MetaMask or a similar product to connect to the Ethereum network');
        return false;
    }
}

connectWeb3();