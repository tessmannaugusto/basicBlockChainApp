import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { createWalletClient, http, parseEther, publicActions  } from "viem";
import { sepolia } from "viem/chains";

const sendTransaction = async (privateKey, recipientAddress, amount) => {
  const account = privateKeyToAccount(privateKey);
  const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http()
  }).extend(publicActions);

  try {
    const nonce = await walletClient.getTransactionCount({
      address: account.address,
    });

    const request = await walletClient.prepareTransactionRequest({
      nonce,
      to: recipientAddress,
      value: parseEther(amount.toString()),
    });

    const serializedTransaction = await walletClient.signTransaction(request);

    const hash = await walletClient.sendRawTransaction({ serializedTransaction });
    
    return hash;
  } catch (error) {
    console.log(error)
    return 'Could not perform transaction'
  }
};

const generateAddress = () => {
  const privateKey = generatePrivateKey();
  const account = privateKeyToAccount(privateKey);
  return {
    privateKey,
    account,
  };
};

export { generateAddress, sendTransaction };
