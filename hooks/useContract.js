import { useEffect, useState } from "react";
import { ethers } from "ethers";
import ContractAbi from "../artifacts/contracts/CrowdFunding.sol/Contract.json";

const useContract = (address) => {
    const [contract, setContract] = useState(null);
    const [error, setError] = useState(null);  // Add state for error handling

    useEffect(() => {
        if (window.ethereum) {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const contractInstance = new ethers.Contract(address, ContractAbi.abi, provider.getSigner());
                setContract(contractInstance);
            } catch (err) {
                setError(err.message);
                console.error("Error creating contract instance: ", err);
            }
        } else {
            setError("Ethereum provider is not available. Please install MetaMask.");
            console.error("Ethereum provider is not available. Please install MetaMask.");
        }
    }, [address]);

    return { contract, error };  // Return error state as well
};

export default useContract;
