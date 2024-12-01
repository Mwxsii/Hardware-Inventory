"use client";

import React, { useState } from 'react';
import Navbar from '@/app/(components)/Navbar';
import CardPopularProducts from './CardPopularProducts';
import CardPurchaseSummary from "./CardPurchaseSummary";
import CardSalesSummary from "./CardSalesSummary";
import CardExpenseSummary from './CardExpenseSummary';

const Dashboard = () => {
    const [notifications, setNotifications] = useState<string[]>([]);

    return (
        <div>
            <Navbar notifications={notifications} />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:overflow-auto gap-10 pb-4 custom-grid-rows">
                <CardPopularProducts setNotifications={setNotifications} />
                <CardSalesSummary />
                <CardPurchaseSummary />
                <CardExpenseSummary />
            </div>
        </div>
    );
};

export default Dashboard;