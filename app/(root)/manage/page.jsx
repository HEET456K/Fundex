'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { userCollection } from '@/firebaseService/collections/userCollection/userCollection';
import { RiArrowDownSLine } from "react-icons/ri";
import { FaSun, FaUndo, FaRedo } from 'react-icons/fa';

const Manage = () => {
    const { email } = useSelector((state) => state.user);
    const findUser = query(userCollection, where('email', '==', email));
    const [formData, setFormData] = useState({});
    const [amounts, setAmounts] = useState({});
    const [userDocId, setUserDocId] = useState(null);
    const [selectedField, setSelectedField] = useState(null);
    const [editingField, setEditingField] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState('June 2024');
    const [showCategoryInput, setShowCategoryInput] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [undoStack, setUndoStack] = useState([]);
    const [redoStack, setRedoStack] = useState([]);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const data = {};
        for (let [key, value] of searchParams.entries()) {
            data[key] = value;
        }
        setFormData(data);
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const querySnapshot = await getDocs(findUser);
                querySnapshot.forEach((doc) => {
                    setUserDocId(doc.id);
                });
            } catch (error) {
                console.error('Error finding user:', error);
            }
        };
        fetchUser();
    }, [email]);

    const handleAmountChange = async (option, type, value) => {
        const updatedAmounts = {
            ...amounts,
            [option]: {
                ...amounts[option],
                [type]: value,
            },
        };
        setUndoStack([...undoStack, amounts]);
        setRedoStack([]);
        setAmounts(updatedAmounts);
        if (userDocId) {
            try {
                await updateDoc(doc(userCollection, userDocId), { amounts: updatedAmounts });
                console.log('Amounts saved:', updatedAmounts);
            } catch (error) {
                console.error('Error updating user data:', error);
            }
        }
    };

    const handleSetTarget = (field) => {
        setSelectedField(field);
        setEditingField(true);
    };

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    const handleUndo = () => {
        if (undoStack.length > 0) {
            const previousState = undoStack.pop();
            setRedoStack([...redoStack, amounts]);
            setAmounts(previousState);
        }
    };

    const handleRedo = () => {
        if (redoStack.length > 0) {
            const nextState = redoStack.pop();
            setUndoStack([...undoStack, amounts]);
            setAmounts(nextState);
        }
    };

    const handleCreateCategory = () => {
        if (categoryName.trim() !== '') {
            setFormData({ ...formData, [categoryName]: {} });
            setShowCategoryInput(false);
            setCategoryName('');
        }
    };

    const calculatePercentage = (total, amount) => (100 - (total && amount ? (amount / total) * 100 : 0));

    const renderRightBoxContent = () => {
        if (!selectedField || !editingField) {
            return (
                <div className="bg-[#393939] p-6 rounded-lg">
                    <h3 className="text-2xl font-semibold text-white mb-4">Create a New Target</h3>
                    <button className="bg-[#8d6dfe] text-white py-2 px-4 rounded-lg" onClick={() => setEditingField(true)}>
                        Create Target
                    </button>
                </div>
            );
        }

        const fieldData = amounts[selectedField];
        return (
            <div className="bg-[#393939] p-6 rounded-[20px] absolute w-[20%] right-5 h-[80%]">
                <h3 className="text-2xl font-semibold w-[20%] text-white mb-4">{selectedField}</h3>
                <div className="mb-4">
                    <label className="block text-gray-300 mb-2">Total Amount</label>
                    <input
                        type="number"
                        value={amounts[selectedField]?.totalAmount || ''}
                        onChange={(e) => handleAmountChange(selectedField, 'totalAmount', e.target.value)}
                        className="w-full p-2 bg-[#384152] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#8d6dfe]"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-300 mb-2">Payment</label>
                    <input
                        type="number"
                        value={amounts[selectedField]?.payment || ''}
                        onChange={(e) => handleAmountChange(selectedField, 'payment', e.target.value)}
                        className="w-full p-2 bg-[#384152] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#8d6dfe]"
                    />
                </div>
            </div>
        );
    };

    const getProgressBarColor = (percentage) => {
        if (percentage >= 90) return 'bg-green-500';
        if (percentage >= 50) return 'bg-yellow-500';
        if (percentage > 0) return 'bg-red-500';
        return 'bg-white';
    };

    let totalAssigned = 0;
    let totalActivity = 0;
    let totalAvailable = 0;

    return (
        <div className="bg-[#000000] shadow-md max-w-[82%] ml-[17%] mx-auto mt-3 text-white textMine">
            <div className="bg-[#393939] rounded-[25px] flex justify-between items-center mb-2 py-5">
                <select
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    className="bg-[#393939] text-3xl pl-7 text-white rounded-lg border-none"
                >
                    <option value="June 2024">June 2024</option>
                    <option value="July 2024">July 2024</option>
                    <option value="August 2024">August 2024</option>
                </select>
            </div>
            <div className="flex gap-2 mb-2">
                <button
                    className="bg-[#393939] text-white py-2 px-4 rounded-full flex items-center"
                    onClick={() => setShowCategoryInput(!showCategoryInput)}
                >
                    <FaSun className="mr-2" /> Category Group
                </button>
                <button
                    className="bg-[#393939] text-white py-2 px-4 rounded-full flex items-center"
                    onClick={handleUndo}
                >
                    <FaUndo className="mr-2" /> Undo
                </button>
                <button
                    className="bg-[#393939] text-white py-2 px-4 rounded-full flex items-center"
                    onClick={handleRedo}
                >
                    <FaRedo className="mr-2" /> Redo
                </button>
            </div>
            {showCategoryInput && (
                <div className="bg-[#393939] p-4 rounded-lg mb-4">
                    <input
                        type="text"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        placeholder="Enter category name"
                        className="w-full p-2 bg-[#384152] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#8d6dfe]"
                    />
                    <button
                        className="bg-[#8d6dfe] text-white py-2 px-4 rounded-lg mt-2"
                        onClick={handleCreateCategory}
                    >
                        Create Category
                    </button>
                </div>
            )}
            <div className="flex gap-4 rounded-[20px]">
                <div className='w-[74.5%] bg-[#393939] rounded-[20px]'>
                    <div className="flex justify-content text-[16px] font-normal text-white mb-4 pl-4 pt-3 border-b-[1px] border-[#656565] pb-2">
                        <div className="col-span-1 flex pr-[45%]"><RiArrowDownSLine size={25} />&nbsp;&nbsp;CATEGORY</div>
                        <div className="col-span-1 pr-[10%]">ASSIGNED</div>
                        <div className="col-span-1 pr-[10%]">ACTIVITY</div>
                        <div className="col-span-1">AVAILABLE</div>
                    </div>
                    {Object.keys(formData).map((key) => {
                        if (key !== 'name') {
                            const assigned = amounts[key]?.totalAmount || 0;
                            const payment = amounts[key]?.payment || 0;
                            const available = assigned - payment;
                            const percentage = calculatePercentage(assigned, available);

                            totalAssigned += assigned;
                            totalActivity += 0;
                            totalAvailable += available;

                            return (
                                <div
                                    key={key}
                                    className="grid grid-cols-4 items-center pl-10 bg-[#393939] rounded-lg cursor-pointer border-b-[1px] border-[#656565]"
                                    onClick={() => handleSetTarget(key)}
                                >
                                    <div className="col-span-1 flex flex-col w-[200%] pl-2">
                                        <div className='flex py-1'>
                                            <div className="flex items-center">
                                                <span className="text-[18px] font-medium text-white">{key}</span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
                                            <div
                                                className={`h-2 rounded-full ${getProgressBarColor(percentage)}`}
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="col-span-1">
                                        ₹{(Number(assigned) || 0).toFixed(2)}
                                    </div>
                                    <div className="col-span-1">
                                        ₹{(Number(payment) || 0).toFixed(2)}
                                    </div>
                                    <div className="col-span-1">
                                        ₹{(Number(available) || 0).toFixed(2)}
                                    </div>

                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
                <div className="w-[25%] bg-[#393939] rounded-lg">
                    {renderRightBoxContent()}
                </div>
            </div>
        </div>
    );
};

export default Manage;
