import React from 'react';
import AllCampaigns from '@/components/AllCampaigns';

const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const AllCampaignsPage = () => {
    return (
        <div>
            <AllCampaigns contractAddress={contractAddress} />
        </div>
    );
};

export default AllCampaignsPage;
