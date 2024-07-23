// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import CustomButton from '@/components/CustomButton';
// import CountBox from '@/components/CountBox';
// import Loader from '@/components/Loader';
// import { calculateBarPercentage, daysLeft } from '@/utils';

// const CampaignDetails = () => {
//     const router = useRouter();
//     const { id } = router.query;

//     const [isLoading, setIsLoading] = useState(false);
//     const [amount, setAmount] = useState('');
//     const [donators, setDonators] = useState([]);
//     const [campaign, setCampaign] = useState(null);

//     useEffect(() => {
//         if (id) {
//             setIsLoading(true);

//             fetch(`/api/campaign/${id}`)
//                 .then(response => response.json())
//                 .then(data => {
//                     setCampaign(data.campaign);
//                     setDonators(data.donators);
//                     setIsLoading(false);
//                 })
//                 .catch(error => {
//                     console.error("Error fetching campaign details:", error);
//                     setIsLoading(false);
//                 });
//         }
//     }, [id]);

//     const handleDonate = async () => {
//         setIsLoading(true);
//         // Mock donation process
//         setTimeout(() => {
//             // Update campaign amount collected and donators list
//             setCampaign((prevCampaign) => ({
//                 ...prevCampaign,
//                 amountCollected: prevCampaign.amountCollected + parseFloat(amount),
//             }));
//             setDonators((prevDonators) => [
//                 ...prevDonators,
//                 { donator: 'You', donation: amount },
//             ]);
//             setIsLoading(false);
//             setAmount('');
//         }, 2000);
//     };

//     if (isLoading || !campaign) return <Loader />;

//     const remainingDays = daysLeft(campaign.deadline);

//     return (
//         <div className="container mx-auto p-4">
//             {isLoading && <Loader />}

//             <div className="flex flex-col md:flex-row gap-4 mt-10">
//                 <div className="flex-1">
//                     <img
//                         src={campaign.image}
//                         alt="campaign"
//                         className="w-full h-[410px] object-cover rounded-xl"
//                     />
//                     <div className="relative w-full h-2 bg-gray-700 mt-2 rounded">
//                         <div
//                             className="absolute h-full bg-green-500 rounded"
//                             style={{
//                                 width: `${calculateBarPercentage(
//                                     campaign.target,
//                                     campaign.amountCollected
//                                 )}%`,
//                                 maxWidth: '100%',
//                             }}
//                         ></div>
//                     </div>
//                 </div>

//                 <div className="md:w-1/3 flex flex-wrap justify-between gap-4">
//                     <CountBox title="Days Left" value={remainingDays} />
//                     <CountBox title={`Raised of ${campaign.target}`} value={campaign.amountCollected} />
//                     <CountBox title="Total Backers" value={donators.length} />
//                 </div>
//             </div>

//             <div className="mt-10 flex flex-col lg:flex-row gap-5">
//                 <div className="flex-2 flex flex-col gap-8">
//                     <div>
//                         <h4 className="text-lg font-semibold text-gray-300 uppercase">Creator</h4>
//                         <div className="mt-5 flex items-center gap-4">
//                             <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-800 cursor-pointer">
//                                 <img
//                                     src="/path/to/creator/avatar.jpg"
//                                     alt="creator"
//                                     className="w-8 h-8 object-contain"
//                                 />
//                             </div>
//                             <div>
//                                 <h4 className="text-md font-semibold text-white break-all">{campaign.owner}</h4>
//                                 <p className="mt-1 text-sm text-gray-400">10 Campaigns</p>
//                             </div>
//                         </div>
//                     </div>

//                     <div>
//                         <h4 className="text-lg font-semibold text-gray-300 uppercase">Story</h4>
//                         <div className="mt-5">
//                             <p className="text-md text-gray-400 leading-6">{campaign.description}</p>
//                         </div>
//                     </div>

//                     <div>
//                         <h4 className="text-lg font-semibold text-gray-300 uppercase">Donators</h4>
//                         <div className="mt-5 flex flex-col gap-4">
//                             {donators.length > 0 ? (
//                                 donators.map((item, index) => (
//                                     <div
//                                         key={`${item.donator}-${index}`}
//                                         className="flex justify-between items-center gap-4"
//                                     >
//                                         <p className="text-md text-gray-400">{index + 1}. {item.donator}</p>
//                                         <p className="text-md text-gray-400">{item.donation} ETH</p>
//                                     </div>
//                                 ))
//                             ) : (
//                                 <p className="text-md text-gray-400">No donators yet. Be the first one!</p>
//                             )}
//                         </div>
//                     </div>
//                 </div>

//                 <div className="flex-1">
//                     <h4 className="text-lg font-semibold text-gray-300 uppercase">Fund</h4>
//                     <div className="mt-5 flex flex-col p-4 bg-gray-800 rounded-lg">
//                         <p className="text-md font-medium text-center text-gray-400">
//                             Fund the campaign
//                         </p>
//                         <div className="mt-5">
//                             <input
//                                 type="number"
//                                 placeholder="ETH 0.1"
//                                 step="0.01"
//                                 className="w-full py-2 px-4 outline-none border border-gray-700 bg-transparent text-white text-lg rounded-lg"
//                                 value={amount}
//                                 onChange={(e) => setAmount(e.target.value)}
//                             />
//                             <div className="my-5 p-4 bg-gray-700 rounded-lg">
//                                 <h4 className="font-semibold text-sm text-white">Back it because you believe in it.</h4>
//                                 <p className="mt-2 text-sm text-gray-400">Support the project for no reward, just because it speaks to you.</p>
//                             </div>
//                             <CustomButton
//                                 btnType="button"
//                                 title="Fund Campaign"
//                                 styles="w-full bg-purple-600 text-white py-2 rounded-lg"
//                                 handleClick={handleDonate}
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CampaignDetails;
// pages/campaign.js
'use client'
import React from 'react';
import CreateCampaign from '@/components/CreateCampaign';
import Campaigns from '@/components/Campaign';

const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const HomePage = () => {
    return (
        <div>
            <CreateCampaign contractAddress={contractAddress} />
        </div>
    );
};

export default HomePage;
