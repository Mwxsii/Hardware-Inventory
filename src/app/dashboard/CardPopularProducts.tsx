import React, { useEffect, useState, useMemo } from 'react';
import { db } from '@/firebase/firestoreService';
import { collection, onSnapshot } from 'firebase/firestore';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from 'chart.js';


ChartJS.register(ArcElement, Title, Tooltip, Legend);

interface Product {
    id: string;
    name: string; 
    stockQuantity: number; 
}

interface Purchase {
    id: string;
    supplierName: string; 
    quantityPurchased: number; 
    purchasePrice: number; 
}

interface CardPopularProductsProps {
    setNotifications: (notifications: string[]) => void;
}

const CardPopularProducts: React.FC<CardPopularProductsProps> = ({ setNotifications }) => {
    const [productsData, setProductsData] = useState<Product[]>([]);
    const [purchasesData, setPurchasesData] = useState<Purchase[]>([]);
    const [loading, setLoading] = useState(true);
    
    const productCategories = useMemo(() => [
        'CEMENT', 'TIMBER', 'STEEL', 'IRON-SHEETS', 'PAINT', 
        'BRICKS', 'NAILS', 'GLASS', 'MACHINERY', 
        'PLUMBING TOOLS', 'HAND TOOLS'
    ], []);

    useEffect(() => {
        const unsubscribeProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
            const products = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as Product[]; 
            setProductsData(products);
        });

        const unsubscribePurchases = onSnapshot(collection(db, 'purchases'), (snapshot) => {
            const purchases = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as Purchase[]; 
            setPurchasesData(purchases);
            setLoading(false);
        });

        return () => {
            unsubscribeProducts();
            unsubscribePurchases();
        };
    }, []);

    const availableStockData = useMemo(() => {
        return productCategories.map(category => {
            const product = productsData.find(p => p.name === category) || { stockQuantity: 0 };
            const totalStock = product.stockQuantity || 0;

            const totalPurchases = purchasesData
                .filter(purchase => purchase.supplierName.includes(category)) 
                .reduce((acc, purchase) => acc + (purchase.quantityPurchased || 0), 0);

            const availableStock = totalStock - totalPurchases;

            return {
                product: category,
                purchases: totalPurchases,
                sales: totalStock, 
                availableStock: Math.abs(availableStock), 
            };
        });
    }, [productsData, purchasesData, productCategories]);

    // Generate notifications based on available stock
    useEffect(() => {
        const notifications: string[] = [];

        availableStockData.forEach(item => {
            if (item.availableStock < 200) {
                notifications.push(`Low stock on ${item.product} (RESTOCK)`);
            } else if (item.availableStock > 2000) {
                notifications.push(`Overstock on ${item.product}`);
            }
        });

        
        setNotifications(notifications);
    }, [availableStockData, setNotifications]);

    
    const purchaseChartData = {
        labels: availableStockData.map(item => item.product),
        datasets: [
            {
                label: 'Total Purchase Price',
                data: availableStockData.map(item => 
                    purchasesData
                        .filter(purchase => purchase.supplierName.includes(item.product))
                        .reduce((acc, purchase) => acc + (purchase.purchasePrice || 0), 0) 
                ),
                backgroundColor: [
                    '#FF6384', 
                    '#36A2EB',
                    '#FFCE56', 
                    '#4BC0C0', 
                    '#9966FF', 
                    '#FF9F40', 
                    '#FF5733', 
                    '#33FF57', 
                    '#3357FF', 
                    '#FF33A1', 
                ],
                borderColor: 'rgba(255, 255, 255, 1)',
                borderWidth: 2,
            },
        ],
    };

    return (
        <div className="row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl pb-16">
            {loading ? (
                                <div className="m-5">Loading...</div>
                            ) : (
                                <>
                                    <div className="flex justify-between items-center px-7 pt-5">
                                        <h3 className="text-lg font-semibold">
                                            Available Stock
                                        </h3>
                                        {/* Bell Icon with Notification Count */}
                                        <div className="relative">
                                            <button className="focus:outline-none">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-6 w-6 text-gray-600"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M15 17h5l-1.405 1.405A2.002 2.002 0 0116 21H8a2.002 2.002 0 01-1.595-.595L5 17h5m0 0V7a6 6 0 00-12 0v10m12 0h6"
                                                    />
                                                </svg>
                                                {/* Notification Badge */}
                                                {availableStockData.filter(item => item.availableStock < 200 || item.availableStock > 2000).length > 0 && (
                                                    <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-1">
                                                        {availableStockData.filter(item => item.availableStock < 200 || item.availableStock > 2000).length}
                                                    </span>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="overflow-auto h-full">
                                        <table className="min-w-full">
                                            <thead>
                                                <tr>
                                                    <th className="px-4 py-2">Product</th>
                                                    <th className="px-4 py-2">Purchases</th>
                                                    <th className="px-4 py-2">Sales</th>
                                                    <th className="px-4 py-2">Available Stock</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {availableStockData.map((item, index) => (
                                                    <tr key={index} className="border-b">
                                                        <td className="px-4 py-2">{item.product}</td>
                                                        <td className="px-4 py-2">{item.purchases}</td>
                                                        <td className="px-4 py-2">{item.sales}</td>
                                                        <td className="px-4 py-2">{item.availableStock}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                
                                    {/* Pie chart for Purchases by Product */}
                                    <div className="mt-5">
                                        <h3 className="text-lg font-semibold px-7 pt-5 pb-2">
                                            Purchases by Product Chart
                                        </h3>
                                        <Doughnut 
                                            data={purchaseChartData} 
                                            options={{
                                                responsive: true,
                                                plugins: {
                                                    legend: {
                                                        position: 'top' as const,
                                                    },
                                                    title: {
                                                        display: true,
                                                        text: 'Total Purchase Price by Product',
                                                    },
                                                },
                                            }} 
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    );
                };
                
                export default CardPopularProducts;