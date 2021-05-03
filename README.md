# NFT Project Documentation

## Components

### Ethereum Blockchain
- Ethereum development environment I use is Hardhat, which allows for
    - compiling solidity smart contract code locally
    - testing solidity smart contract code using Mocha
    - deploying contracts to a Remote Ethereum node easily
        - Alchemy and Infura are 2 sites that provide Remote Ethereum nodes accessed by Remote Procedure Call APIs
            - To connect a Remote Ethereum node, we go to the site, and copy the RPC url

- Our compiled solidity smart contract will be deployed to the Remote Ethereum node, so external accounts can run public functions on our deployed contract instance
    - Deployed smart contracts are very similar in concept to web applications deployed on Platform as a Service (PaaS) platforms
        - The *web app/smart contract* code is an immutable bundle
        - If code is changed, the *app/contract* needs to be redeployed as a fresh instance
        - Because each deployment is fresh, the state needs to be stored elsewhere such as a database
            - in this project, for each token item we store:
                - item name
                - item description
                - item picture URL
            - these will be lost if we store these on the blockchain for every single redeployment
            - and rewriting all these data for each token item to the blockchain will incur heavy gas fees (that users will not want to pay)
            - so we store the metadata json that has the item name, item description, and item picture URL,  on the Backend component
            - and on the blockchain itself, we store a URL that links to the metadata json stored on the backend
            - Making the token item data extremely loosely coupled from the blockchain (by only storing a URL to the metadata json) means:
                1. Less gas fees when writing new tokens to the blockchain, since much less memory space is used
                1. No gas fees when editing existing token data

### Backend
- If the backend domain changes, we also need to change the tokenURI function in our Solidity contract code to return new backend domain

### Frontend


---

## Environment Variables (.env file)
- Environment variables are used in `hardhat.config.js`
- Each test network has a RPC_URL, and a MNEMONIC
    - To generate 12 word mnemonics, you can run `npx mnemonics`



## Install

```
git clone --recurse-submodules https://github.com/andrew-ma/hardhat_example.git NFT

cd NFT
npm install

cd backend
npm install

cd ../frontend
npm install
```

## Run

### To run our solidity contract code test cases on a temporary hardhat network
```
# in the NFT directory run
npx hardhat test
```

### To play around with our Contract's public functions, we can use Remix (http://remix.ethereum.org/)
```!
# go to the Remix website
# create a new empty .sol file in Remix that we will paste our contract code to

# because our solidity code has dependencies, we will first flatten the code to include all of the dependencies in one place

# in the NFT directory, run
npx hardhat output contracts/NFT.sol

# this will generate a file named "output", and copy and paste the contents of this file to the empty .sol file in Remix

# save the file with Ctrl+S, and on the left side click the button that opens the "Solidity Compiler" tab

# Click the "Compile <Your .sol file> button"

# on the left side click the button that opens the "Deploy & run transactions" tab

# Under the "CONTRACT" dropdown, choose "NFT"

# Change the "GAS LIMIT" number to 5000000

# Click the "Deploy" button

# Under "Deployed Contracts", there is our newly deployed NFT contract, and expand the arrow next to our NFT contract

# Here are all the public functions that we can use in our NFT contract

```

#### To test our localhost hardhat node with Remix
```
In the "Deploy & Run Transactions" tab, under ENVIRONMENT dropdown choose "Injected Web3"

# go to the Remix website
# create a new empty .sol file in Remix that we will paste our contract code to

# because our solidity code has dependencies, we will first flatten the code to include all of the dependencies in one place

# in the NFT directory, run
npx hardhat output contracts/NFT.sol

# this will generate a file named "output", and copy and paste the contents of this file to the empty .sol file in Remix

# save the file with Ctrl+S, and on the left side click the button that opens the "Solidity Compiler" tab

# Click the "Compile <Your .sol file> button"

# on the left side click the button that opens the "Deploy & run transactions" tab

# Under the "CONTRACT" dropdown, choose "NFT"

# Change the "GAS LIMIT" number to 5000000


we assume that our hardnat node is already running (npx hardhat node)

Deploy the Solidity contract with (npx hardhat deploy), or if already deployed copy the DeployedAddress


In Remix, right under the Deploy button, there is an "At Address" button
When we ran (npx hardhat deploy) it should have displayed "<contract> deployed to address: <DeployedAddress>"

Copy the <DeployedAddress> to the "At Address" field, and click the "At Address" button


Now you can run the Contract's public functions easily on our localhost node
```



### To test the Full System (Blockchain + Backend + Frontend)
```
# First we need to start a localhost blockchain node
# in the NFT directory, run
npx hardhat node



## Second we need to compile our contract code
npx hardhat compile



## Third we need to deploy our contract to our localhost blockchain node
npx hardhat deploy


--------------------------------------------------------------

## To start the Backend
# go into backend directory
cd backend

npm start

# if there is an error, run `npm install`
# The backend should be running on "http://127.0.0.1:4000"

--------------------------------------------------------------

## To start the Frontend
# going back up to NFT directory
cd ..

# go into frontend directory
cd frontend

npm start

# The frontend should be running on "http://127.0.0.1:3000"


```


## Basic Order of Steps
1. Start local blockchain node
1. Compile our smart contract
1. Run deploy script, which deploys our smart contract on our local blockchain node, and writes the address and ABI of our deployed contract in the frontend folder
1. Start the backend
1. Start the frontend (if the smart contract is changed and redeployed, the frontend must be restarted since it has to read the new deployed address and ABI)

## Simple One Liner
```
docker-compose up
```



## Troubleshooting

- `Invalid nonce` errors: if you are seeing this error on the `npx hardhat node`
  console, try resetting your Metamask account. This will reset the account's
  transaction history and also the nonce. Open Metamask, click on your account
  followed by `Settings > Advanced > Reset Account`.
