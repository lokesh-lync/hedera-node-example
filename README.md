# hedera-node-example
Deploy solidity smart contract and do transactions on the hashgraph network using Node.js

### Step by step instructions

- Step 1: Clone the repo: 
```bash
git clone https://github.com/codeTIT4N/hedera-node-example
```

- Step 2: Install node modules:
```bash
npm i
```

- Step 3: Create a free developer account on hedera using: https://portal.hedera.com/

- Step 4: Rename .env.example to .env and update the variables you get from step 3

- Step 5: Run the project using:
```bash
node index.js
```

- Step 6: If you want to change anything in the smart contract don't forget to recompile the contract using:
```bash
solcjs --bin LookupContract.sol
```

### Example output:
![Screenshot 2022-11-30 at 5 56 03 PM](https://user-images.githubusercontent.com/71545386/204795951-090b7310-67e5-4c92-a9e0-096c6894c52f.png)
