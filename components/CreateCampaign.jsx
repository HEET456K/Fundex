'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db, storage } from '@/firebaseService/firebase.config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Loader from './Loader';
import Image from 'next/image';
import { motion } from 'framer-motion';

const CreateCampaign = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({
        name: '',
        title: '',
        description: '',
        target: '',
        deadline: '',
        image: '',
        wallet: '',
        reason: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [step, setStep] = useState(0);
    const [errors, setErrors] = useState({});

    const steps = [
        {
            label: 'What should we call you as the campaign runner?',
            type: 'text',
            name: 'name',
            placeholder: 'John Smith',
            required: true,
        },
        {
            label: "What's the title of your campaign?",
            type: 'text',
            name: 'title',
            placeholder: 'Write a title',
            required: true,
        },
        {
            label: 'Tell us the story of your campaign',
            type: 'textarea',
            name: 'description',
            placeholder: 'Write your story',
            required: true,
        },
        {
            label: "What's your funding goal?",
            type: 'text',
            name: 'target',
            placeholder: 'ETH 0.50',
            required: true,
        },
        {
            label: 'When does your campaign end?',
            type: 'text',
            name: 'deadline',
            placeholder: '04/05/2006',
            required: true,
        },
        {
            label: 'Upload a campaign image',
            type: 'file',
            name: 'image',
            required: false,
        },
        {
            label: 'What is your wallet address?',
            type: 'text',
            name: 'wallet',
            placeholder: 'Your wallet address',
            required: true,
        },
        {
            label: 'Why should everyone fund your campaign?',
            type: 'textarea',
            name: 'reason',
            placeholder: 'Explain why your campaign is important',
            required: true,
        },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let imageUrl = '';
            if (imageFile) {
                const storageRef = ref(
                    storage,
                    `campaign-images/${imageFile.name}`
                );
                await uploadBytes(storageRef, imageFile);
                console.log('1st done');

                imageUrl = await getDownloadURL(storageRef);
            }
            console.log('2nd done');
            await db.collection('campaigns').add({
                ...form,
                image: imageUrl,
                deadline: new Date(form.deadline).getTime() / 1000, // Convert to timestamp
            });
            console.log('3rd done');

            router.push('/allcampaigns');
        } catch (error) {
            console.error('Error creating campaign:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '',
        }));
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const validateStep = () => {
        const currentStep = steps[step];
        if (currentStep.required && !form[currentStep.name]) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [currentStep.name]: 'Please fill-up the field',
            }));
            return false;
        }
        return true;
    };

    const handleNext = () => {
        if (validateStep()) {
            setStep(step + 1);
        }
    };

    const handlePrevious = () => {
        setStep(step - 1);
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center font-sans">
            {isLoading && (
                <div className="absolute inset-0 bg-opacity-50 flex items-center justify-center">
                    <Loader />
                </div>
            )}
            <video
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                loop
                muted
            >
                <source src="/bg.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="absolute top-2 left-2 ">
                <Image
                    src="/fundexlogo.svg"
                    alt="Logo"
                    width={200}
                    height={200}
                    className="object-contain"
                />
            </div>
            <motion.div
                className="relative z-10 flex flex-col items-center rounded-[8px] sm:p-6 p-4 w-full sm:w-[50%] mx-auto bg-opacity-90 mt-[5%]"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="flex justify-center items-center p-4 mb-4 rounded-[8px] mt-[18%]">
                    <h1 className="font-bold text-4xl text-white">
                        Your Campaign
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="w-[70%] font-normal ">
                    <div className="flex flex-col gap-4 mb-4">
                        {steps.map(
                            (stepItem, index) =>
                                index === step && (
                                    <motion.div
                                        key={index}
                                        className="w-full mb-2"
                                        whileFocus={{ scale: 1.05 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <label className="text-white text-[18px] block mb-4">
                                            {stepItem.label}
                                        </label>
                                        {stepItem.type === 'textarea' ? (
                                            <textarea
                                                name={stepItem.name}
                                                value={form[stepItem.name]}
                                                onChange={handleInputChange}
                                                placeholder={
                                                    stepItem.placeholder
                                                }
                                                className="bg-gray-800 rounded-2xl px-3 py-3 pl-5 text-white w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 font-medium"
                                                required={stepItem.required}
                                            />
                                        ) : (
                                            <input
                                                type={stepItem.type}
                                                name={stepItem.name}
                                                value={
                                                    stepItem.type !== 'file'
                                                        ? form[stepItem.name]
                                                        : undefined
                                                }
                                                onChange={
                                                    stepItem.type !== 'file'
                                                        ? handleInputChange
                                                        : handleFileChange
                                                }
                                                placeholder={
                                                    stepItem.placeholder
                                                }
                                                className="bg-gray-800 rounded-2xl px-3 text-normal py-3 pl-5 text-white w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 font-medium"
                                                required={stepItem.required}
                                            />
                                        )}
                                        {errors[stepItem.name] && (
                                            <p className="text-red-500 font-medium text-md mt-1">
                                                {errors[stepItem.name]}
                                            </p>
                                        )}
                                    </motion.div>
                                )
                        )}
                    </div>
                    <div className="flex justify-between items-center">
                        {step > 0 && (
                            <motion.button
                                type="button"
                                className="bg-gray-700 font-medium text-[18px] hover:bg-gray-600 text-white py-2 px-4 rounded-full focus:outline-none transition-all duration-300"
                                onClick={handlePrevious}
                                whileHover={{ scale: 1.05 }}
                            >
                                Previous
                            </motion.button>
                        )}
                        {step < steps.length - 1 ? (
                            <motion.button
                                type="button"
                                className="bg-blue-800 text-white py-2 px-4 rounded-full focus:outline-none transition-all duration-300 hover:bg-blue-700 font-medium text-[18px] border-black"
                                onClick={handleNext}
                                whileHover={{ scale: 1.05 }}
                            >
                                Next
                            </motion.button>
                        ) : (
                            <motion.button
                                type="submit"
                                className="bg-[#1f33eb] hover:bg-[#311689] text-white py-2 px-4 rounded-full focus:outline-none transition-all duration-300 font-medium text-[18px]"
                                whileHover={{ scale: 1.05 }}
                            >
                                {isLoading
                                    ? 'Submitting...'
                                    : 'Add Your Campaign'}
                            </motion.button>
                        )}
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default CreateCampaign;
