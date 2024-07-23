'use client'
import React, { useState, useEffect } from "react";
import useContract from "../hooks/useContract";
import provider from "../lib/web3";
import Loader from '../components/Loader';
import { useRouter } from "next/navigation";

const Campaigns = ({ contractAddress }) => {
    const contract = useContract(contractAddress);
    const [campaigns, setCampaigns] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useRouter(); // Initialize useNavigate

    useEffect(() => {
        const fetchCampaigns = async () => {
            setIsLoading(true);
            const campaignsCount = await contract.numberOfcampaigns();
            const campaignsArray = [];
            for (let i = 0; i < campaignsCount; i++) {
                const campaign = await contract.campaigns(i);
                campaignsArray.push(campaign);
            }
            setCampaigns(campaignsArray);
            setIsLoading(false);
        };
        if (contract) {
            fetchCampaigns();
        }
    }, [contract]);

    const handleSaveCampaign = async (campaignId) => {
        try {
            setIsLoading(true);
            // Assuming there's a method to save or interact with the campaign
            await contract.saveCampaign(campaignId);
            navigate('/allcampaigns'); // Redirect after saving
        } catch (error) {
            console.error("Error saving campaign:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const currentCampaigns = campaigns.filter(campaign => campaign.deadline >= Math.floor(Date.now() / 1000));
    const endedCampaigns = campaigns.filter(campaign => campaign.deadline < Math.floor(Date.now() / 1000));

    if (isLoading) return <Loader />;

    return (
        <div>
            <h1>Current Campaigns</h1>
            {currentCampaigns.map((campaign, index) => (
                <div key={index}>
                    <h2>{campaign.title}</h2>
                    <button onClick={() => handleSaveCampaign(index)}>Save Campaign</button>
                </div>
            ))}
            <h1>Ended Campaigns</h1>
            {endedCampaigns.map((campaign, index) => (
                <div key={index}>
                    <h2>{campaign.title}</h2>
                </div>
            ))}
        </div>
    );
};

export default Campaigns;
