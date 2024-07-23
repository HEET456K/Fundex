'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '@/firebaseService/firebase.config';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import WelcomePage from './WelcomePage';

const steps = [
    {
        question: 'How do you feel about your finances today?',
        type: 'options',
        name: 'finance_feeling',
        options: ['😊 Great', '🙂 Okay', '😕 Bad', '😢 Terrible'],
    },
    {
        question: 'Who do you spend money on?',
        type: 'multiple',
        name: 'Spending',
        options: ['👪 Family', '👫 Friends', '🙋‍♂️ Myself', '💝 Charity'],
    },
    {
        question: 'Tell about your home',
        type: 'options',
        name: 'Home',
        options: ['🏠 Rent', '🏡 Own', '🏘 Other'],
    },
    {
        question: 'Do you have a mortgage?',
        type: 'yesno',
        name: 'mortgage',
    },
    {
        question: 'Do you have any debt?',
        type: 'multiple',
        name: 'debt',
        options: [
            '🎓 Student loans',
            '💳 Credit card debt',
            '🚗 Car loan',
            '💸 Personal loan',
            '🚫 None',
        ],
    },
    {
        question: 'How do you get around?',
        type: 'multiple',
        name: 'transport',
        options: ['🚗 Car', '🚲 Bike', '🚇 Public transport', '🚶‍♂️ Walking'],
    },
    {
        question: 'Which do you regularly spend money on?',
        type: 'multiple',
        name: 'regular spending',
        options: ['🍔 Food', '🏠 Rent', '🎉 Entertainment', '💡 Utilities'],
    },
    {
        question: 'Which of these subscriptions do you have?',
        type: 'multiple',
        name: 'subscriptions',
        options: ['📺 Netflix', '🎧 Spotify', '📦 Amazon Prime', '📱 Other'],
    },
    {
        question: 'What are some expenses that always sneak up on you?',
        type: 'multiple',
        name: 'sneaky expenses',
        options: ['🔧 Car repairs', '🩺 Medical bills', '🎁 Gifts', '🤷‍♂️ Others'],
    },
    {
        question: 'Are you saving, or planning to, for any of these?',
        type: 'multiple',
        name: 'savings goals',
        options: [
            '🚨 Emergency fund',
            '🏖 Retirement',
            '📈 Investment',
            '👶 Baby expenses',
        ],
    },
    {
        question: 'Do you have an emergency fund?',
        type: 'yesno',
        name: 'emergency_fund',
    },
    {
        question: 'What is your biggest financial goal right now?',
        type: 'text',
        name: 'financial_goal',
    },
    {
        question: 'Do you use any budgeting tools?',
        type: 'options',
        name: 'budgeting_tools',
        options: ['✔️ Yes', '❌ No'],
    },
    {
        question: 'If yes, which budgeting tool do you use?',
        type: 'text',
        name: 'budgeting_tool_name',
    },
    {
        question: 'What is your monthly income?',
        type: 'text',
        name: 'monthly_income',
    },
    {
        question: 'What is your monthly expense?',
        type: 'text',
        name: 'monthly_expense',
    },
    {
        question: 'What else do you want to include - without stress or guilt?',
        type: 'text',
        name: 'additional_notes',
    },
];

const StepForm = () => {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({});
    const [showWelcome, setShowWelcome] = useState(true);
    const router = useRouter();
    const { email, id: userId } = useSelector((state) => state.user);

    useEffect(() => {
        if (!userId) {
            router.push('/stepform');
        }
    }, [userId, router]);

    const handleButtonClick = (name, value) => {
        setFormData((prev) => {
            if (steps[step].type === 'multiple') {
                const currentSelection = prev[name] || [];
                if (currentSelection.includes(value)) {
                    return { ...prev, [name]: currentSelection.filter((item) => item !== value) };
                }
                return { ...prev, [name]: [...currentSelection, value] };
            }
            return { ...prev, [name]: value };
        });
    };

    const handlePrev = () => {
        if (step === 0) {
            setShowWelcome(true);
        } else {
            setStep((prev) => (prev > 0 ? prev - 1 : prev));
        }
    };

    const handleNext = async () => {
        if (step === steps.length - 1) {
            // Handle form submission
            const userDocRef = doc(db, 'users', userId);
            await updateDoc(userDocRef, { formData });
            router.push('/some-next-route'); // Replace with your next route
        } else {
            setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
        }
    };

    const isCurrentStepValid = () => {
        const currentStep = steps[step];
        if (currentStep.type === 'text') {
            return !!formData[currentStep.name]?.trim();
        }
        if (currentStep.type === 'multiple') {
            return formData[currentStep.name]?.length > 0;
        }
        return !!formData[currentStep.name];
    };

    return (
        <>
            <AnimatePresence>
                {showWelcome ? (
                    <WelcomePage
                        key="welcome"
                        onStart={(name) => {
                            setShowWelcome(false);
                            setFormData({ name });
                        }}
                    />
                ) : (
                    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white overflow-hidden">
                        <div className="absolute top-2 left-2 z-10">
                            <Image
                                src="/fundexlogo.svg"
                                alt="Fundex Logo"
                                width={200}
                                height={200}
                                className="object-contain"
                            />
                        </div>
                        <video autoPlay loop muted className="absolute w-auto min-w-full min-h-full max-w-none opacity-10">
                            <source src="/bgzoom.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-black opacity-50"></div>

                        <div className="relative w-full max-w-md p-8 z-10 mt-16">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, y: '100%' }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: '100%' }}
                                transition={{ duration: 0.5 }}
                                className="p-6 rounded-lg shadow-md"
                            >
                                <div className="mb-4">
                                    {steps[step].type === 'text' && (
                                        <div>
                                            <motion.h2
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.2 }}
                                                className="text-2xl font-normal mb-4 text-gray-300"
                                            >
                                                {steps[step].question}
                                            </motion.h2>
                                            <motion.input
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.4 }}
                                                type="text"
                                                value={formData[steps[step].name] || ''}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        [steps[step].name]: e.target.value,
                                                    }))
                                                }
                                                className="w-full p-4 font-normal rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                                            />
                                        </div>
                                    )}
                                    {steps[step].type === 'options' && (
                                        <div>
                                            <motion.h2
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.2 }}
                                                className="text-2xl font-semibold mb-4 text-gray-300"
                                            >
                                                {steps[step].question}
                                            </motion.h2>
                                            {steps[step].options.map((option) => (
                                                <motion.button
                                                    key={option}
                                                    onClick={() => handleButtonClick(steps[step].name, option)}
                                                    className={`p-2 hover:bg-[#313131] hover:border-l-[20px] focus:border-[#6646d8] focus:border-l-[20px] rounded-l-full font-normal w-full text-left mb-4 ${formData[steps[step].name] === option
                                                        ? ' text-white'
                                                        : 'bg-[#2f2f2f20] text-white'
                                                        }`}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.5 }}
                                                >
                                                    {option}
                                                </motion.button>
                                            ))}
                                        </div>
                                    )}
                                    {steps[step].type === 'multiple' && (
                                        <div>
                                            <motion.h2
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.2 }}
                                                className="text-2xl font-semibold mb-4 text-gray-300"
                                            >
                                                {steps[step].question}
                                            </motion.h2>
                                            {steps[step].options.map((option) => (
                                                <motion.button
                                                    key={option}
                                                    onClick={() => handleButtonClick(steps[step].name, option)}
                                                    className={`p-4 border rounded-lg font-normal w-full text-left mb-2 ${formData[steps[step].name]?.includes(option)
                                                        ? 'bg-[#8d6dfe] text-white'
                                                        : 'bg-[#384152] text-white'
                                                        }`}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.4 }}
                                                >
                                                    {option}
                                                </motion.button>
                                            ))}
                                        </div>
                                    )}
                                    {steps[step].type === 'yesno' && (
                                        <div>
                                            <motion.h2
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.2 }}
                                                className="text-2xl font-semibold mb-4 text-gray-300"
                                            >
                                                {steps[step].question}
                                            </motion.h2>
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.4 }}
                                            >
                                                <button
                                                    onClick={() => handleButtonClick(steps[step].name, 'yes')}
                                                    className={`p-4 border rounded-lg font-normal w-full text-left mb-2 ${formData[steps[step].name] === 'yes'
                                                        ? 'bg-[#8d6dfe] text-white'
                                                        : 'bg-[#384152] text-white'
                                                        }`}
                                                >
                                                    Yes
                                                </button>
                                                <button
                                                    onClick={() => handleButtonClick(steps[step].name, 'no')}
                                                    className={`p-4 border rounded-lg font-normal w-full text-left mb-2 ${formData[steps[step].name] === 'no'
                                                        ? 'bg-[#8d6dfe] text-white'
                                                        : 'bg-[#384152] text-white'
                                                        }`}
                                                >
                                                    No
                                                </button>
                                            </motion.div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-between">
                                    <motion.button
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.6 }}
                                        onClick={handlePrev}
                                        className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                                    >
                                        Previous
                                    </motion.button>
                                    <motion.button
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.6 }}
                                        onClick={handleNext}
                                        className={`px-4 py-2 rounded-lg ${isCurrentStepValid() ? 'bg-blue-500 text-white' : 'bg-gray-500 text-gray-300 cursor-not-allowed'}`}
                                        disabled={!isCurrentStepValid()}
                                    >
                                        {step === steps.length - 1 ? 'Submit' : 'Next'}
                                    </motion.button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default StepForm;
