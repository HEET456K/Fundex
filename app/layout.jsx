'use client';
import React from 'react';
import Sidebar from '@/components/Sidebar';
import { store } from '../redux/store';
import { Providers } from '@/redux/provider';
import { usePathname } from 'next/navigation';
import './globals.css';

const RootLayout = ({ children }) => {
    const pathname = usePathname();
    const noSidebarRoutes = ['/sign-in', '/sign-up', '/stepform', '/allcampaigns', '/campaign'];
    const shouldShowSidebar = !noSidebarRoutes.includes(pathname);

    return (
        <html lang="en">
            <head></head>
            <body className="min-h-screen flex bg-[#000000]">
                <Providers store={store}>
                    {shouldShowSidebar && <Sidebar />}
                    <main className="flex-1">{children}</main>
                </Providers>
            </body>
        </html>
    );
};

export default RootLayout;
