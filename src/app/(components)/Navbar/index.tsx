"use client";

import { useAppDispatch, useAppSelector } from '../../redux';
import { setIsDarkMode, setIsSidebarCollapsed } from '@/app/state';
import { Bell, Menu, Settings, Sun, Hammer } from 'lucide-react'; 
import React, { useState } from 'react';

interface NavbarProps {
  notifications?: string[]; 
}

const Navbar: React.FC<NavbarProps> = ({ notifications = [] }) => { 
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  
 
  const [isNotificationsVisible, setNotificationsVisible] = useState(false);

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  const toggleDarkMode = () => {
    dispatch(setIsDarkMode(!isDarkMode));
  };

  const toggleNotifications = () => {
    setNotificationsVisible(!isNotificationsVisible);
  };

  return (
    <div className="flex justify-between items-center w-full mb-7">
      {/* LEFT SIDE */}
      <div className="flex justify-between items-center gap-5">
        <button 
          className="px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-100" 
          onClick={toggleSidebar}
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="relative">
          <input
            type="search"
            placeholder="Type to search for goods available in store"
            className="pl-10 pr-4 py-2 w-50 md:w-80 border-2 border-gray-300 bg-white rounded-lg focus:outline-none focus:border-blue-500"
            style={{ margin: 'auto', display: 'block' }}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Bell className="text-gray-500" size={25} />
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex justify-between items-center gap-5">
        <div className="hidden md:flex justify-between items-center gap-5">
          <button onClick={toggleDarkMode} className="cursor-pointer">
            <Sun className="text-gray-500" size={24} />
          </button>

          <div className="relative">
            <Bell className="cursor-pointer text-gray-500" size={24} onClick={toggleNotifications} />
            <span className="absolute top-2 -right-2 inline-flex items-center justify-center px-[0.4rem] py-1 text-xs font-semibold leading-none text-red-100 bg-red-400">
              {notifications.length}
            </span>
            {isNotificationsVisible && notifications.length > 0 && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-10 max-h-60 overflow-y-auto">
                {notifications.map((notification, index) => (
                  <div key={index} className="px-4 py-2 text-gray-700 border-b last:border-b-0">
                    {notification}
                  </div>
                                ))}
                                </div>
                              )}
                            </div>
                  
                            <hr className="w-0 h-7 border border-solid border-gray-300 mx-3" />
                  
                            <div className="flex items-center gap-4 cursor-pointer">
                              <Hammer className="text-gray-500" size={50} /> 
                              <span className="font-semibold">Hardware Inventory</span>
                            </div>
                          </div>
                  
                          <div onClick={() => window.location.href = '/settings'} className="cursor-pointer">
                            <Settings className="text-gray-500" size={24} />
                          </div>
                        </div>
                      </div>
                    );
                  };
                  
                  export default Navbar;