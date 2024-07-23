'use client';
import React, { useState } from 'react';
import { FaUserEdit, FaEnvelope, FaPhone, FaAddressCard } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebaseService/firebase.config';  // Adjust the import path as needed

const EditProfileModal = ({ user, onClose }) => {
    const [email, setEmail] = useState(user ? user.email : '');
    const [phone, setPhone] = useState(user ? (user.phone || '') : '');
    const [address, setAddress] = useState(user ? (user.address || '') : '');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            const userDocRef = doc(db, 'users', user.uid);  // Assuming user.uid is available and represents the document ID
            await updateDoc(userDocRef, {
                email,
                phone,
                address,
                updatedAt: serverTimestamp()
            });
            onClose();
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Error saving profile.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-20">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg relative">
                <button onClick={onClose} className="absolute top-2 right-2 text-white">
                    <FaUserEdit />
                </button>
                <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
                <div className="space-y-4">
                    <div className="flex items-center">
                        <FaEnvelope className="text-2xl mr-4" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 bg-gray-700 rounded"
                            placeholder="Email"
                        />
                    </div>
                    <div className="flex items-center">
                        <FaPhone className="text-2xl mr-4" />
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full p-2 bg-gray-700 rounded"
                            placeholder="Phone"
                        />
                    </div>
                    <div className="flex items-center">
                        <FaAddressCard className="text-2xl mr-4" />
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full p-2 bg-gray-700 rounded"
                            placeholder="Address"
                        />
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
                    disabled={loading}
                >
                    {loading ? 'Saving...' : 'Save'}
                </button>
            </div>
        </div>
    );
};

export default EditProfileModal;
