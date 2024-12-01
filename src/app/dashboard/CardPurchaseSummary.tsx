import React, { useEffect, useState } from 'react';
import { db } from '@/firebase/firestoreService';
import { collection, onSnapshot } from 'firebase/firestore';
import numeral from 'numeral';

interface Purchase {
    id: string;
    purchasePrice: number; 
    date: string; 
}

const CardPurchaseSummary: React.FC = () => {
    const [purchaseData, setPurchaseData] = useState<Purchase[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [filteredData, setFilteredData] = useState<Purchase[]>([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'purchases'), (snapshot) => {
            const data: Purchase[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data() as Omit<Purchase, 'id'> 
            }));
            setPurchaseData(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleFilter = () => {
        const filtered = purchaseData.filter(item => {
            const itemDate = new Date(item.date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return itemDate >= start && itemDate <= end;
        });
        setFilteredData(filtered);
    };

    const totalAmount = (filteredData.length > 0 ? filteredData : purchaseData).reduce((acc, item) => acc + item.purchasePrice, 0); 

    return (
        <div className="flex flex-col justify-between row-span-2 xl:row-span-3 col-span-1 md:col-span-2 xl:col-span-1 bg-white shadow-md rounded-2xl">
            {loading ? (
                <div className="m-5">loading...</div>
            ) : (
                <>
                    <div>
                        <h2 className="text-lg font-semibold mb-2 px-7 pt-5">
                            Purchase Summary
                        </h2>
                    </div>
                    <div className="mb-4 mt-7 px-7">
                        <p className="text-xs text-gray-400">Total Amount</p>
                        <div className="flex items-center">
                            <p className="text-2xl font-bold">
                                ksh {numeral(totalAmount).format("0,0.00")} 
                            </p>
                        </div>
                    </div>
                    <div className="px-7">
                        <input 
                            type="date" 
                            value={startDate} 
                            onChange={(e) => setStartDate(e.target.value)} 
                        />
                        <input 
                            type="date" 
                            value={endDate} 
                            onChange={(e) => setEndDate(e.target.value)} 
                        />
                        <button onClick={handleFilter} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">
                            Filter
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CardPurchaseSummary;