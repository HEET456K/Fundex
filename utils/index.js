// utils/index.js
export const calculateBarPercentage = (target, amountCollected) => {
    return (amountCollected / target) * 100;
};

export const daysLeft = (deadline) => {
    const now = new Date();
    const end = new Date(deadline);
    const timeDiff = end - now;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return daysDiff;
};
