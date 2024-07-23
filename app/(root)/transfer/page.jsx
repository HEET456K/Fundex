'use client'

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Wallet from '../../../artifacts/contracts/Transfer.sol/Wallet.json';

const contractAddress = ""; // add later

export default function Home() {
    const [amount, setAmount] = useState('');
    const [toAddress, setToAddress] = useState('');
    const [balance, setBalance] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const [transactions, setTransactions] = useState([]); // Mock transactions

    useEffect(() => {
        if (typeof window.ethereum !== 'undefined') {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', handleChainChanged);
        }
    }, []);

    const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
            setWalletAddress('');
        } else {
            setWalletAddress(accounts[0]);
        }
    };

    const handleChainChanged = (chainId) => {
        if (chainId !== '0x89') {
            alert('Please switch to the Polygon network');
        }
    };

    async function connectWallet() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: '0x89',
                        chainName: 'Polygon Mainnet',
                        nativeCurrency: {
                            name: 'MATIC',
                            symbol: 'MATIC',
                            decimals: 18
                        },
                        rpcUrls: ['https://polygon-rpc.com'],
                        blockExplorerUrls: ['https://polygonscan.com']
                    }]
                });

                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setWalletAddress(accounts[0]);
            } catch (error) {
                console.error("Error connecting to MetaMask", error);
            }
        } else {
            alert('MetaMask is not installed. Please install it to use this dApp.');
        }
    }

    async function fetchBalance() {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(contractAddress, Wallet.abi, provider);
            try {
                const data = await contract.getBalance();
                setBalance(ethers.utils.formatEther(data));
            } catch (err) {
                console.log("Error: ", err);
            }
        }
    }

    async function transferFunds() {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, Wallet.abi, signer);
            const transaction = await contract.transfer(toAddress, ethers.utils.parseEther(amount));
            await transaction.wait();
            fetchBalance();
            setTransactions([...transactions, { to: toAddress, amount, date: new Date().toLocaleString() }]); // Add transaction
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
            <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
                <h1 className="text-6xl font-bold mb-8">
                    Wallet to Wallet Transfer
                </h1>

                <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                    {walletAddress ? (
                        <div className="flex flex-col items-center">
                            <input
                                className="border p-2 m-2 rounded-lg w-full"
                                type="text"
                                placeholder="Recipient Address"
                                value={toAddress}
                                onChange={(e) => setToAddress(e.target.value)}
                            />
                            <input
                                className="border p-2 m-2 rounded-lg w-full"
                                type="text"
                                placeholder="Amount in MATIC"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                            <button
                                onClick={transferFunds}
                                className="bg-blue-500 text-white p-2 rounded-lg w-full"
                            >
                                Transfer
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={connectWallet}
                            className="bg-purple-500 text-white p-2 rounded-lg w-full"
                        >
                            Connect MetaMask
                        </button>
                    )}
                </div>

                <div className="mt-8 bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                    <button
                        onClick={fetchBalance}
                        className="bg-green-500 text-white p-2 rounded-lg w-full"
                    >
                        Fetch Balance
                    </button>
                    {balance && (
                        <div className="mt-4">
                            <h2 className="text-2xl">Balance: {balance} MATIC</h2>
                        </div>
                    )}
                </div>

                <div className="mt-8 bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-4">Previous Transactions</h2>
                    <ul>
                        {transactions.map((tx, index) => (
                            <li key={index} className="mb-2">
                                <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                                    <p><strong>To:</strong> {tx.to}</p>
                                    <p><strong>Amount:</strong> {tx.amount} MATIC</p>
                                    <p><strong>Date:</strong> {tx.date}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </main>
        </div>
    );
}
