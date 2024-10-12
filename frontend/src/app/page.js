"use client";
import { useState } from "react";

export default function Home() {
  const [privateKey, setPrivateKey] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState(null);
  const [generatedPrivateKey, setGeneratedPrivateKey] = useState(null);
  const [errorAddress, setErrorAddress] = useState(null);
  const [transactionHash, setTransactionHash] = useState(null);
  const [error, setError] = useState(null);

  const btnGenerateAddress = async () => {
    try {
      const response = await fetch("http://localhost:3001/generate-wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();

      if (result.success) {
        setAddress(result.address);
        setGeneratedPrivateKey(result.privateKey);
        setErrorAddress(null);
      } else {
        setErrorAddress(result.message || "Erro na geração de endereço");
      }
    } catch (err) {
      setErrorAddress("Falha ao conectar com o backend");
    }
  };

  const handleSubmitTransfer = async (e) => {
    setError("Transferência em andamento...");
    e.preventDefault();

    const data = {
      privateKey,
      destinationAddress,
      amount,
    };

    try {
      const response = await fetch("http://localhost:3001/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setTransactionHash(result.transactionHash);
        setError(null);
      } else {
        setError(result.message || "Erro na transação");
      }
    } catch (err) {
      setError("Falha ao conectar com o backend");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Gerar endereço ETH</h1>
        <button
          type="button"
          className="btn btn-primary"
          onClick={btnGenerateAddress}
        >
          Gerar endereço
        </button>
  
        {address && generatedPrivateKey && (
          <p className="success-message">
            Geração bem-sucedida, endereço: {address}. Private key: {generatedPrivateKey}
          </p>
        )}
  
        {errorAddress && <p className="error-message">Erro: {errorAddress}</p>}
      </div>
  
      <div className="card">
        <h1>Transferência entre carteiras</h1>
        <form onSubmit={handleSubmitTransfer}>
          <div className="form-group">
            <label>Private Key:</label>
            <input
              type="text"
              className="form-control"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Endereço de Destino:</label>
            <input
              type="text"
              className="form-control"
              value={destinationAddress}
              onChange={(e) => setDestinationAddress(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Valor:</label>
            <input
              type="number"
              className="form-control"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-success">
            Transferir
          </button>
        </form>
  
        {transactionHash && (
          <p className="success-message">
            Transação bem-sucedida! Hash: {transactionHash}
          </p>
        )}
  
        {error && <p className="error-message">Status: {error}</p>}
      </div>
    </div>
  );
}
