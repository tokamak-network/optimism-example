# optimism-example

You can develop, deploy and test equally on L1 and L2 with one code.

## Configuration
1. Install the packages
```
npm install
```

2. Copy the env file to your one
```
cp .env.example .env
```

3. Edit `.env` to set the parameters

## Build
Build the sample contract
```
npm run build
```

## Test
Test the contract on hardhat node
```
npm run test
```

## Deploy on L1(Goerli)
Deploy the contract on goerli testnet
```
npm run deploy:l1
```

## Deploy on L2
Deploy the contract on tokamak-optimism testnet
```
npm run deploy:l2
```

## Interact with the contract on L1
Send transaction to transfer the token on L1
```
npm run transfer:l1
```

## Interact with the contract on L2
Send transaction to transfer the token on L2
```
npm run transfer:l2
```
