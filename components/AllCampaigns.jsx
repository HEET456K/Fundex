'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AiOutlineClose } from 'react-icons/ai';
import Loader from './Loader';
import { BiSolidDonateHeart } from 'react-icons/bi';
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
            image: 'https://images.cnbctv18.com/uploads/2024/06/trading-2024-06-c58ea0c0cb0ece32c09b43e18f9e57e4.jpg?impolicy=website&width=640&height=360',
            deadline: { seconds: Date.now() / 1000 + 86400 },
        },
        {
            id: 2,
            title: 'Save Nature Save Life',
            description: 'Saving the environment is not an issue...',
            image: 'https://c4.wallpaperflare.com/wallpaper/246/739/689/digital-digital-art-artwork-illustration-abstract-hd-wallpaper-preview.jpg',
            deadline: { seconds: Date.now() / 1000 + 172800 },
        },
        {
            id: 3,
            title: 'Hunger Strike',
            description: 'Just another random campaign that aims...',
            image: 'https://c4.wallpaperflare.com/wallpaper/246/739/689/digital-digital-art-artwork-illustration-abstract-hd-wallpaper-preview.jpg',
            deadline: { seconds: Date.now() / 1000 + 432000 },
        },
        {
            id: 4,
            title: 'Powered Kits Learning Boxes',
            description: 'Fun, durable and reusable boxes with...',
            image: 'https://c4.wallpaperflare.com/wallpaper/246/739/689/digital-digital-art-artwork-illustration-abstract-hd-wallpaper-preview.jpg',
            deadline: { seconds: Date.now() / 1000 + 518400 },
        },
        {
            id: 5,
            title: 'Building Hope Village',
            description: 'Together we can create access for everyone...',
            image: 'https://c4.wallpaperflare.com/wallpaper/246/739/689/digital-digital-art-artwork-illustration-abstract-hd-wallpaper-preview.jpg',
            deadline: { seconds: Date.now() / 1000 + 2937600 },
        },
        {
            id: 6,
            title: 'Building Hope Village',
            description: 'Together we can create access for everyone...',
            image: 'https://c4.wallpaperflare.com/wallpaper/246/739/689/digital-digital-art-artwork-illustration-abstract-hd-wallpaper-preview.jpg',
            deadline: { seconds: Date.now() / 1000 + 2937600 },
        },
        {
            id: 7,
            title: 'Building Hope Village',
            description: 'Together we can create access for everyone...',
            image: 'https://c4.wallpaperflare.com/wallpaper/246/739/689/digital-digital-art-artwork-illustration-abstract-hd-wallpaper-preview.jpg',
            deadline: { seconds: Date.now() / 1000 + 2937600 },
        },
        {
            id: 8,
            title: 'Building Hope Village',
            description: 'Together we can create access for everyone...',
            image: 'https://c4.wallpaperflare.com/wallpaper/246/739/689/digital-digital-art-artwork-illustration-abstract-hd-wallpaper-preview.jpg',
            deadline: { seconds: Date.now() / 1000 + 2937600 },
        },
        {
            id: 9,
            title: 'Building Hope Village',
            description: 'Together we can create access for everyone...',
            image: 'https://c4.wallpaperflare.com/wallpaper/246/739/689/digital-digital-art-artwork-illustration-abstract-hd-wallpaper-preview.jpg',
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
    const currentCampaigns = campaigns.filter(
        (campaign) => campaign.deadline.seconds > now
    );
    const endedCampaigns = campaigns.filter(
        (campaign) => campaign.deadline.seconds <= now
    );

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
            console.log(
                `Donating ${donationAmount} ETH to ${selectedCampaign.title}`
            );
            closeDonatePopup();
        } else {
            alert('Please connect MetaMask first.');
        }
    };

    const connectMetaMask = async () => {
        if (window.ethereum) {
            try {
                await window.ethereum.request({
                    method: 'eth_requestAccounts',
                });
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
                        <div
                            // className="flex  flex-wrap gap-6"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 gap-y-14"
                        >
                            {currentCampaigns.map((campaign) => (
                                <div
                                    key={campaign._id}
                                    className="relative group overflow-hidden rounded-lg shadow-lg w-[350px] h-96"
                                >
                                    <img
                                        src={campaign.image}
                                        alt="image"
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:blur-sm group-hover:scale-110"
                                    />

                                    <div className="absolute bottom-0 left-0 w-full p-4 pb-8 bg-gradient-to-t from-black to-transparent transition-transform duration-500 transform group-hover:opacity-0 group-hover:translate-y-16">
                                        <h1 className="text-2xl font-extrabold text-white">
                                            {campaign.title}
                                        </h1>
                                    </div>

                                    <div className="absolute inset-0 p-6 flex flex-col justify-between transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-[rgba(0,0,0,0.60)]">
                                        <div className="text-white pt-4">
                                            <h1 className="text-4xl font-extrabold mb-2">
                                                {campaign.title}
                                            </h1>
                                            <p className="text-lg font-medium mb-2">
                                                by {campaign.name || 'User'}
                                            </p>
                                            <p className="text-md mb-4">
                                                {campaign.description}
                                            </p>
                                            <p className="text-lg font-semibold">
                                                {/* Ends on: */}
                                                Deadline :
                                                <span className="text-green-300">
                                                    {new Date(
                                                        campaign.deadline
                                                            .seconds * 1000
                                                    ).toLocaleDateString(
                                                        'en-GB',
                                                        {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        }
                                                    )}
                                                </span>
                                            </p>
                                        </div>

                                        <button
                                            onClick={() =>
                                                openDonatePopup(campaign)
                                            }
                                            className=" px-6 py-4 text-xl bg-gradient-to-r from-green-500 to-green-700 text-white hover:from-green-600 hover:to-green-800 flex items-center gap-2 rounded-md transition-colors duration-300"
                                        >
                                            <BiSolidDonateHeart />
                                            Donate
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {showDonatePopup && selectedCampaign && (
                    <div className="fixed inset-0 bg-black transition-all bg-opacity-75 flex justify-center items-center z-20">
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg relative">
                            <button
                                onClick={closeDonatePopup}
                                className="absolute top-2 right-2 text-white"
                            >
                                <AiOutlineClose />
                            </button>
                            <h2 className="text-xl font-bold">
                                Donate to {selectedCampaign.title}
                            </h2>
                            <p>{selectedCampaign.description}</p>
                            <p>Reason: {selectedCampaign.reason}</p>
                            <input
                                type="text"
                                value={donationAmount}
                                onChange={(e) =>
                                    setDonationAmount(e.target.value)
                                }
                                placeholder="Enter donation amount (ETH)"
                                className="w-full mt-4 p-4 bg-gray-700 rounded"
                            />
                            <div className="flex mt-[10px] justify-evenly items-center  rounded-lg shadow-lg">
                                <button
                                    onClick={handleDonate}
                                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                                >
                                    Donate
                                </button>
                                {!metaMaskConnected && (
                                    <button
                                        onClick={connectMetaMask}
                                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                                    >
                                        Connect MetaMask
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AllCampaigns;
