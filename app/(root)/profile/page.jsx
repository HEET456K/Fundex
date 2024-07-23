'use client';
import React, { useState, useEffect } from 'react';
import { FaUserEdit, FaEnvelope, FaPhone, FaAddressCard, FaChevronRight, FaUserCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { getAuth } from 'firebase/auth';
import EditProfileModal from '@/components/EditProfileModal';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        setUser(currentUser ? {
            email: currentUser.email,
            phone: '',
            address: ''
        } : null);
    }, []);

    if (!user) return <p>Loading...</p>;

    const handleEditProfile = () => {
        setShowEditModal(true);
    };

    const handleCloseModal = () => {
        setShowEditModal(false);
    };

    return (
        <div className="min-h-screen bg-[#000000] text-white flex flex-col items-center">
            <div className="w-full max-w-6xl absolute left-[16%] top-0 p-4 flex justify-between">
                <div className="bg-[#393939] w-[60%] rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold mb-4">Profile</h1>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleEditProfile}
                            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded flex items-center"
                        >
                            <FaUserEdit className="mr-2" /> Edit Profile
                        </motion.button>
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-center">
                            <FaEnvelope className="text-2xl mr-4" />
                            <div>
                                <p className="text-lg font-medium">Email</p>
                                <p className="text-gray-400">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <FaPhone className="text-2xl mr-4" />
                            <div>
                                <p className="text-lg font-medium">Phone</p>
                                <p className="text-gray-400">{user.phone}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <FaAddressCard className="text-2xl mr-4" />
                            <div>
                                <p className="text-lg font-medium">Address</p>
                                <p className="text-gray-400">{user.address}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#393939] w-[35%] rounded-lg shadow-lg p-6 flex flex-col items-center">
                    <FaUserCircle className="text-9xl mb-4" />
                    <h2 className="text-2xl font-bold mb-4">{user.email.split('@')[0]}</h2>
                    <div className="space-y-4 w-full">
                        <div className="bg-[#4a4a4a] p-4 rounded-lg">
                            <p className="text-lg font-medium">Bank Account 1</p>
                            <p className="text-gray-400">**** **** **** 1234</p>
                        </div>
                        <div className="bg-[#4a4a4a] p-4 rounded-lg">
                            <p className="text-lg font-medium">Bank Account 2</p>
                            <p className="text-gray-400">**** **** **** 5678</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-4xl absolute left-[16%] top-[50%] p-4">
                <h2 className="text-2xl font-bold mb-4">Recent Activities</h2>
                <div className="space-y-4">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-[#393939] rounded-lg p-4 flex justify-between items-center hover:bg-gray-700 transition-all"
                    >
                        <div>
                            <p className="text-lg font-medium">Budget Report</p>
                            <p className="text-gray-400">Generated on July 1, 2024</p>
                        </div>
                        <FaChevronRight className="text-2xl text-gray-400" />
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-[#393939] rounded-lg p-4 flex justify-between items-center hover:bg-gray-700 transition-all"
                    >
                        <div>
                            <p className="text-lg font-medium">Expense Analysis</p>
                            <p className="text-gray-400">Completed on June 20, 2024</p>
                        </div>
                        <FaChevronRight className="text-2xl text-gray-400" />
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-[#393939] rounded-lg p-4 flex justify-between items-center hover:bg-gray-700 transition-all"
                    >
                        <div>
                            <p className="text-lg font-medium">Income Overview</p>
                            <p className="text-gray-400">Reviewed on June 15, 2024</p>
                        </div>
                        <FaChevronRight className="text-2xl text-gray-400" />
                    </motion.div>
                </div>
            </div>

            {showEditModal && (
                <EditProfileModal user={user} onClose={handleCloseModal} />
            )}
        </div>
    );
};

export default Profile;
