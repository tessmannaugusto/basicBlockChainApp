import express from 'express'
import bodyParser from 'body-parser';
import { generateAddress, sendTransaction } from './services/blockchain.js';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use(bodyParser.json());

const PORT = 3001;

app.post('/generate-wallet', (req, res) => {
  try {
    const privateKeyAndAddress = generateAddress();
    res.status(201).json({success: true, address: privateKeyAndAddress.account.address, privateKey: privateKeyAndAddress.privateKey });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao gerar carteira', error });
  }
});

app.post('/transfer', async (req, res) => {
  const { privateKey, destinationAddress, amount } = req.body;

  if (!privateKey || !destinationAddress || !amount) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
  }
  try {
    const response = await sendTransaction(privateKey, destinationAddress, amount)
    res.status(200).json({ success: true, transactionHash: response});
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao realizar a transferência', error });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
