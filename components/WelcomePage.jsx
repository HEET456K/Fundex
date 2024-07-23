'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const WelcomePage = ({ onStart }) => {
    const [hover, setHover] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [transitioning, setTransitioning] = useState(false);

    const handleJoinClick = () => {
        setShowForm(true);
    };

    const handleFormSubmit = () => {
        if (name.trim()) {
            setTransitioning(true);
            setTimeout(() => {
                onStart(name);
            }, 1000);
        }
    };

    const handlePrevClick = () => {
        setShowForm(false);
    };

    useEffect(() => {
        if (transitioning) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [transitioning]);

    return (
        <motion.div
            className="relative h-screen w-full overflow-hidden bg-gray-900 text-white"
            animate={transitioning ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
        >
            <video
                autoPlay
                loop
                muted
                className="absolute inset-0 w-full h-full object-cover"
            >
                <source src='/bg_video.mp4' type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black opacity-50"></div>
            {!showForm ? (
                <>
                    <div className="absolute top-2 left-2 z-10">
                        <Image
                            src="/fundexlogo.svg"
                            alt="Fundex Logo"
                            width={200}
                            height={200}
                            className="object-contain"
                        />
                    </div>
                    <div className="relative z-10 flex flex-col items-center justify-center h-full space-t-6">
                        <h1 className="text-6xl font-bold">
                            WELCOME
                        </h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="text-xl"
                        >
                            to Fundex
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 2, ease: "easeOut" }}
                            className="text-center max-w-md mx-auto font-normal mt-3"
                        >
                            a community of people who are passionate about finance and crowd funding with modern design
                        </motion.p>
                        <motion.button
                            onClick={handleJoinClick}
                            onHoverStart={() => setHover(true)}
                            onHoverEnd={() => setHover(false)}
                            animate={{ scale: hover ? 1.1 : 1 }}
                            transition={{ duration: 0.1, ease: "easeInOut" }}
                            whileHover={{ scale: 1.2, transition: { duration: 0.1 } }}
                            whileTap={{ scale: 0.9 }}
                            className="mt-6 px-4 py-2 bg-gray-700 rounded-lg text-white font-bold hover:bg-gray-800 transition duration-200 text-base"
                        >
                            LET'S GO
                        </motion.button>
                    </div>
                </>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10 flex flex-col items-center justify-center h-full"
                >
                    <h2 className="text-2xl font-normal mb-8 text-gray-300">What is your name?</h2>
                    <input
                        type="text"
                        placeholder="Your first name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full max-w-md p-4 font-normal rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                    <div className="flex space-x-4">
                        <motion.button
                            onClick={handlePrevClick}
                            className="mt-6 px-6 py-3 bg-gray-700 rounded-lg text-white font-bold hover:bg-gray-600 transition duration-200"
                        >
                            Previous
                        </motion.button>
                        <button class="ui-btn rounded-lg"
                            onClick={handleFormSubmit}>
                            <span className='py-3 px-6'>

                                NEXT
                            </span>
                        </button>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default WelcomePage;
