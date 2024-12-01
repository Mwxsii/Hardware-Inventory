import React, { useEffect, useState } from 'react';
import { db } from '@/firebase/firestoreService'; 
import { collection, onSnapshot } from 'firebase/firestore';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Expense {
    id: string;
    category: string;
    amount: number; 
}

const CardTotalExpenses: React.FC = () => {
    const [expensesData, setExpensesData] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribeExpenses = onSnapshot(collection(db, 'expenses'), (snapshot) => {
            const data: Expense[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...(doc.data() as Omit<Expense, 'id'>) 
            }));

            setExpensesData(data);
            setLoading(false);
        });

        
        return () => {
            unsubscribeExpenses();
        };
    }, []);

   {/*Pie Chart*/}
    const getChartData = () => {
        const categories = ['Salaries', 'Office', 'Rent', 'Insurance', 'Licenses', 'Permits'];
        const amounts = categories.map(category => {
            const total = expensesData
                .filter(expense => expense.category === category)
                .reduce((acc, expense) => acc + expense.amount, 0);
            return total;
        });

        const totalAmount = amounts.reduce((acc, amount) => acc + amount, 0);
        const percentages = amounts.map(amount => (totalAmount > 0 ? (amount / totalAmount) * 100 : 0));

        return {
            labels: categories,
            datasets: [
                {
                    data: percentages,
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF',
                        '#FF9F40',
                    ],
                    hoverBackgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF',
                        '#FF9F40',
                    ],
                },
            ],
        };
    };

    return (
        <div className="row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl pb-16">
            {loading ? (
                <div className="m-5">Loading...</div>
            ) : (
                <>
                    <h3 className="text-lg font-semibold px-7 pt-5 pb-2">Total Expenses</h3>
                    <div className="text-2xl font-bold px-7">
                        {`ksh ${expensesData.reduce((acc, expense) => acc + expense.amount, 0).toFixed(2)}`}
                    </div>
                    <div className="px-7 pt-5">
                        <Pie data={getChartData()} />
                    </div>
                </>
            )}
        </div>
    );
};

export default CardTotalExpenses;