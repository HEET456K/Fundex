import React from 'react';

const CustomButton = ({ btnType, title, styles, handleClick }) => {
    return (
        <button
            type={btnType}
            className={`py-2 px-4 rounded ${styles}`}
            onClick={handleClick}
        >
            {title}
        </button>
    );
};

export default CustomButton;
