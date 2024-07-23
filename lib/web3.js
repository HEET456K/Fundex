import { ethers } from 'ethers';

try {
    if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log('Provider created:', provider);
    } else {
        console.log('Ethereum object not found');
    }
} catch (error) {
    console.error('Error:', error);
}
