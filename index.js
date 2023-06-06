console.clear();
require("dotenv").config();

const {
  AccountId,
  PrivateKey,
  Client,
  FileCreateTransaction,
  ContractCreateTransaction,
  ContractFunctionParameters,
  ContractExecuteTransaction,
  ContractCallQuery,
  Hbar,
  ContractCreateFlow,
} = require("@hashgraph/sdk");
const fs = require("fs");
// Config accounts and client
const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromString(process.env.OPERATOR_PVT_KEY);

const client = Client.forTestnet().setOperator(operatorId, operatorKey);

async function main() {
  // Import the compiled contract bytecode
  const contractByteCode = fs.readFileSync(
    "contracts_LookupContract_sol_LookupContract.bin"
  );
  // Create a file on Hedera and store the bytecode
  const fileCreateTx = new FileCreateTransaction()
    .setContents(contractByteCode)
    .setKeys([operatorKey])
    .setMaxTransactionFee(new Hbar(2))
    .freezeWith(client);
  const fileCreateSign = await fileCreateTx.sign(operatorKey);
  const fileCreateSubmit = await fileCreateSign.execute(client);
  const fileCreateRx = await fileCreateSubmit.getReceipt(client);
  const bytecodeFileId = fileCreateRx.fileId;
  console.log(`The bytecode file ID is: ${bytecodeFileId}`);

  // Instantiate the smart contract
  const contractInstantiateTx = new ContractCreateTransaction()
    .setBytecodeFileId(bytecodeFileId)
    .setGas(100000)
    .setConstructorParameters(
      new ContractFunctionParameters().addString("Ankit").addUint256(1111111111)
    );

  const contractInstantiateSubmit = await contractInstantiateTx.execute(client);
  const contractInstantiateRx = await contractInstantiateSubmit.getReceipt(
    client
  );
  const contractId = contractInstantiateRx.contractId;
  const contractAddress = contractId.toSolidityAddress();
  console.log(` - The smart contract ID is: ${contractId}`);
  console.log(
    ` - The smart contract ID in solidity format is: ${contractAddress}`
  );

  // Query the contract
  const contractQueryTx = new ContractCallQuery()
    .setContractId(contractId)
    .setGas(100000)
    .setFunction(
      "getMobileNumber",
      new ContractFunctionParameters().addString("Ankit")
    )
    .setMaxQueryPayment(new Hbar(0.2));
  const contractQuerySubmit = await contractQueryTx.execute(client);
  const contractQueryResult = contractQuerySubmit.getUint256(0);
  console.log(
    `- Here's the phone number that you asked for: ${contractQueryResult}`
  );

  // Call contract function to update the state variable
  const contractExecuteTx = new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(100000)
    .setFunction(
      "setMobileNumber",
      new ContractFunctionParameters()
        .addString("Bhuvan")
        .addUint256(2222222222)
    )
    .setMaxTransactionFee(new Hbar(0.75));
  const contractExecuteSubmit = await contractExecuteTx.execute(client);
  const contractExecuteRx = await contractExecuteSubmit.getReceipt(client);
  console.log(`- Contract function call status: ${contractExecuteRx.status}`);

  // Checking Bhuvan's phone number by querying again
  const contractQueryTx2 = new ContractCallQuery()
    .setContractId(contractId)
    .setGas(100000)
    .setFunction(
      "getMobileNumber",
      new ContractFunctionParameters().addString("Bhuvan")
    )
    .setMaxQueryPayment(new Hbar(0.2));
  const contractQuerySubmit2 = await contractQueryTx2.execute(client);
  const contractQueryResult2 = contractQuerySubmit2.getUint256(0);
  console.log(
    `- Here's the phone number that you asked for: ${contractQueryResult2}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
