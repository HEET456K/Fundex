import React from 'react';

const CountBox = ({ title, value }) => {
    return (
        <div className="text-center p-4 border rounded bg-gray-800 text-white">
            <h4 className="text-xl font-bold">{value}</h4>
            <p className="text-sm">{title}</p>
        </div>
    );
};

export default CountBox;
