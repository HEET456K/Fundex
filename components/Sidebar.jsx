'use client';
import { useState } from 'react';
import Link from 'next/link';
import { IoPersonSharp } from 'react-icons/io5';
import { FaSignOutAlt } from 'react-icons/fa';
import { IoCloseOutline } from 'react-icons/io5';
import { LuLayoutGrid } from 'react-icons/lu';
import { PiTargetThin } from 'react-icons/pi';
import { GiCash } from 'react-icons/gi';
import { IoDocuments } from 'react-icons/io5';
import { BiTransferAlt } from 'react-icons/bi';
import { MdLogout } from 'react-icons/md';
import { FaChevronRight } from 'react-icons/fa6';
import { FaRegUser } from 'react-icons/fa';
import { TbTargetArrow } from "react-icons/tb";
import { GiSwapBag } from "react-icons/gi";
import { MdPeople } from "react-icons/md";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeLink, setActiveLink] = useState('');



    const handleLinkClick = (link) => {
        setActiveLink(link);
    };

    return (
        <div className="flex font-normal text-[#d1d1d1d0]">
            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 rounded-3xl left-0  bg-[#393939] ml-4 w-60 flex flex-col justify-between h-[97%] mt-3 font-normal text-xl`}
            >
                <div>

                    <Link href="/" passHref>
                        <p className={`flex items-center p-2 h-[2.5rem] px-4 pl-8 mt-16 mb-2 tracking-wider  rounded hover:border-l-4 border-white transition-all ${activeLink === 'profile' ? 'text-white' : ''}`}
                            onClick={() => handleLinkClick('profile')}>
                            <FaRegUser size={20} style={{ color: activeLink === 'profile' ? '#ffffff' : '#D1D1D1' }} />
                            &nbsp;&nbsp;Profile
                        </p>
                    </Link>
                    {/* Navigation links */}
                    <nav className="space-y-2 mt-20 font-normal">
                        <Link href="/manage">
                            <p className={`flex items-center h-[2.5rem] px-4 pl-8  mb-2 tracking-wider  rounded  transition-all ${activeLink === 'dashboard' ? 'text-white border-l-8 border-r-8' : ''}`}
                                onClick={() => handleLinkClick('dashboard')}>
                                <LuLayoutGrid size={20} style={{ color: activeLink === 'dashboard' ? '#ffffff' : '' }} />
                                &nbsp;&nbsp;Dashboard
                            </p>
                        </Link>

                        <Link href="/allcampaigns" passHref>
                            <p className={`flex items-center p-2 h-[2.5rem] px-4 pl-8  mb-2 tracking-wider  rounded hover:bg-[#384152] transition-all ${activeLink === 'funding' ? 'text-white border-l-8 border-r-8' : ''}`}
                                onClick={() => handleLinkClick('funding')}>
                                <GiSwapBag size={20} style={{ color: activeLink === 'funding' ? '#ffffff' : '' }} />
                                &nbsp;&nbsp;Funding
                            </p>
                        </Link>
                        <Link href="/transfer" passHref>
                            <p className={`flex items-center p-2 h-[2.5rem] px-4 pl-8  mb-2 tracking-wider  rounded hover:bg-[#384152] transition-all ${activeLink === 'transfer' ? 'text-white border-l-8 border-r-8' : ''}`}
                                onClick={() => handleLinkClick('transfer')}>
                                <BiTransferAlt size={20} style={{ color: activeLink === 'transfer' ? '#ffffff' : '' }} />
                                &nbsp;&nbsp;Transfer
                            </p>
                        </Link>
                        <Link href="/articles" passHref>
                            <p className={`flex items-center p-2 h-[2.5rem] px-4 pl-8  mb-2 tracking-wider  rounded hover:bg-[#384152] transition-all ${activeLink === 'articles' ? 'text-white border-l-8 border-r-8' : ''}`}
                                onClick={() => handleLinkClick('articles')}>
                                <IoDocuments size={20} style={{ color: activeLink === 'articles' ? '#ffffff' : '' }} />
                                &nbsp;&nbsp;Articles
                            </p>
                        </Link>
                        <Link href="/" passHref>
                            <p className={`flex items-center p-2 h-[2.5rem] px-4 pl-8  mb-2 tracking-wider  rounded hover:bg-[#384152] transition-all ${activeLink === 'logout' ? 'text-white border-l-8 border-r-8' : ''}`}
                                onClick={() => handleLinkClick('logout')}>
                                <MdLogout size={20} style={{ color: activeLink === 'logout' ? '#ffffff' : '' }} />
                                &nbsp;&nbsp;Logout
                            </p>
                        </Link>
                    </nav>
                </div>
                <div>
                    <button className="flex items-center p-2 text-lg h-[2.5rem] px-4 pl-8  mb-4 rounded hover:bg-[#384152] transition-all">
                        <MdPeople size={20} />
                        &nbsp;&nbsp;Privacy&nbsp;&&nbsp;Policy
                    </button>
                </div>
            </div>



        </div>
    );
};

export default Sidebar;
