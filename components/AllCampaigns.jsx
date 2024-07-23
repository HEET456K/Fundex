'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AiOutlineClose } from 'react-icons/ai';
import Loader from './Loader';
// import { collection, getDocs } from 'firebase/firestore';
// import { db } from '@/firebaseService/firebase.config';

const AllCampaigns = () => {
    const router = useRouter();
    const [campaigns, setCampaigns] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('current');
    const [showDonatePopup, setShowDonatePopup] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [donationAmount, setDonationAmount] = useState('');
    const [metaMaskConnected, setMetaMaskConnected] = useState(false);

    // Dummy campaigns ;'
    const dummyCampaigns = [
        {
            id: 1,
            title: 'Build a Car from Scratch',
            description: 'Sounds impossible...',
            image: 'https://via.placeholder.com/600x400',
            deadline: { seconds: Date.now() / 1000 + 86400 },
        },
        {
            id: 2,
            title: 'Save Nature Save Life',
            description: 'Saving the environment is not an issue...',
            image: 'https://via.placeholder.com/600x400',
            deadline: { seconds: Date.now() / 1000 + 172800 },
        },
        {
            id: 3,
            title: 'Hunger Strike',
            description: 'Just another random campaign that aims...',
            image: 'https://via.placeholder.com/600x400',
            deadline: { seconds: Date.now() / 1000 + 432000 },
        },
        {
            id: 4,
            title: 'Powered Kits Learning Boxes',
            description: 'Fun, durable and reusable boxes with...',
            image: 'https://via.placeholder.com/600x400',
            deadline: { seconds: Date.now() / 1000 + 518400 },
        },
        {
            id: 5,
            title: 'Building Hope Village',
            description: 'Together we can create access for everyone...',
            image: 'https://via.placeholder.com/600x400',
            deadline: { seconds: Date.now() / 1000 + 2937600 },
        },
    ];

    useEffect(() => {
        setIsLoading(true);
        // Commenting out Firebase fetching logic
        /*
        db.collection('campaign')
            .get()
            .then((querySnapshot) => {
                const fetchedCampaigns = [];
                querySnapshot.forEach((doc) => {
                    fetchedCampaigns.push({ id: doc.id, ...doc.data() });
                });
                setCampaigns(fetchedCampaigns);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching campaigns:", error);
                setIsLoading(false);
            });
        */
        setCampaigns(dummyCampaigns);
        setIsLoading(false);
    }, []);

    const now = Date.now() / 1000;
    const currentCampaigns = campaigns.filter(campaign => campaign.deadline.seconds > now);
    const endedCampaigns = campaigns.filter(campaign => campaign.deadline.seconds <= now);

    const openDonatePopup = (campaign) => {
        setSelectedCampaign(campaign);
        setShowDonatePopup(true);
    };

    const closeDonatePopup = () => {
        setShowDonatePopup(false);
        setSelectedCampaign(null);
        setDonationAmount('');
    };

    const handleDonate = () => {
        if (metaMaskConnected) {
            // Handle donation logic here, e.g., process donation
            console.log(`Donating ${donationAmount} ETH to ${selectedCampaign.title}`);
            closeDonatePopup();
        } else {
            alert('Please connect MetaMask first.');
        }
    };

    const connectMetaMask = async () => {
        if (window.ethereum) {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                setMetaMaskConnected(true);
                alert('MetaMask connected successfully!');
            } catch (error) {
                console.error('MetaMask connection error:', error);
                alert('Failed to connect MetaMask.');
            }
        } else {
            alert('MetaMask is not installed.');
        }
    };

    return (
        <div className="relative min-h-screen bg-dark-gray text-white">
            <header className="p-4 bg-black flex justify-between items-center">
                <h1 className="text-2xl">All Campaigns</h1>
                <button
                    onClick={() => router.push('/createcampaign')}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                    Create a Campaign
                </button>
            </header>
            <main className="relative z-10 p-6 flex flex-col lg:flex-row justify-around gap-10">
                {isLoading && <Loader />}

                {activeTab === 'current' && (
                    <section className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {currentCampaigns.map(campaign => (
                                <div
                                    key={campaign.id}
                                    data-aos="fade-up"
                                    className="flip-card"
                                >
                                    <div className="flip-card-inner">
                                        <div className="flip-card-front">
                                            <img src={campaign.image} alt="Campaign" className="w-full h-32 object-cover rounded" />
                                            <h3 className="text-lg font-bold mt-2">{campaign.title}</h3>
                                            <p className="text-sm mt-1">by {campaign.name}</p>
                                        </div>
                                        <div className="flip-card-back">
                                            <h3 className="text-lg font-bold mt-2">{campaign.title}</h3>
                                            <p className="text-sm mt-1">{campaign.description}</p>
                                            <p className="text-sm mt-1">Target: {campaign.target} ETH</p>
                                            <p className="text-sm mt-1">Ends on: {new Date(campaign.deadline.seconds * 1000).toLocaleDateString()}</p>
                                            <button
                                                onClick={() => openDonatePopup(campaign)}
                                                className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
                                            >
                                                Donate
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {showDonatePopup && selectedCampaign && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-20">
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg relative">
                            <button
                                onClick={closeDonatePopup}
                                className="absolute top-2 right-2 text-white"
                            >
                                <AiOutlineClose />
                            </button>
                            <h2 className="text-xl font-bold">Donate to {selectedCampaign.title}</h2>
                            <p>{selectedCampaign.description}</p>
                            <p>Reason: {selectedCampaign.reason}</p>
                            <input
                                type="text"
                                value={donationAmount}
                                onChange={(e) => setDonationAmount(e.target.value)}
                                placeholder="Enter donation amount (ETH)"
                                className="w-full mt-4 p-2 bg-gray-700 rounded"
                            />
                            <button
                                onClick={handleDonate}
                                className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
                            >
                                Donate
                            </button>
                            {!metaMaskConnected && (
                                <button
                                    onClick={connectMetaMask}
                                    className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
                                >
                                    Connect MetaMask
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AllCampaigns;
