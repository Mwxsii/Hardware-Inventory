"use client";

import React, { useEffect } from 'react';
import Navbar from "@/app/(components)/Navbar"; 
import Sidebar from "@/app/(components)/Navbar/sidebar";
import StoreProvider, { useAppSelector } from './redux';
import { usePathname } from 'next/navigation';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname(); 
  const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode); 

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]); 

  // Check if the current path is the dashboard page
  const isDashboardPage = pathname === '/dashboard';

  return (
    <div className={`flex bg-gray-50 text-gray-900 w-full min-h-screen ${isDarkMode ? "dark" : "light"}`}>
      <Sidebar />
      <main className={`flex flex-col w-full h-full py-7 px-9 bg-gray-50 ${isSidebarCollapsed ? "md:pl-25" : "md:pl-74"}`}>
        {/* Conditionally render the Navbar only if not on the dashboard page */}
        {!isDashboardPage && <Navbar />}
        {children} 
      </main>
    </div>
  );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </StoreProvider>
  );
};

export default DashboardWrapper;