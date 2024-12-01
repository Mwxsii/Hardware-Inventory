import React, { useEffect, useState } from "react";
import { db } from "@/firebase/firestoreService"; 
import { collection, getDocs } from "firebase/firestore";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface Product {
  name: string;
  price: number;
  date: string;
}

const TotalSalesAmount = () => {
  const [totalPriceSum, setTotalPriceSum] = useState(0);
  const [salesData, setSalesData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [filteredData, setFilteredData] = useState<Product[]>([]);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products")); 
        const data: Product[] = querySnapshot.docs.map(doc => ({
          ...(doc.data() as Product),
        }));

        setSalesData(data);
        setTotalPriceSum(data.reduce((acc, curr) => acc + (curr.price || 0), 0));
      } catch (error) {
        console.error("Error fetching sales data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  const handleFilter = () => {
    const filtered = salesData.filter(item => {
      const itemDate = new Date(item.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return itemDate >= start && itemDate <= end;
    });
    setFilteredData(filtered);
    setTotalPriceSum(filtered.reduce((acc, curr) => acc + (curr.price || 0), 0));
  };

  const productNames = [
    "CEMENT", 
    "TIMBER", 
    "STEEL", 
    "IRON-SHEETS", 
    "PAINT", 
    "BRICKS", 
    "NAILS", 
    "GLASS", 
    "MACHINERY", 
    "PLUMBING TOOLS", 
    "HAND TOOLS"
];

const colors = [
    "#FF6384", 
    "#36A2EB", 
    "#FFCE56", 
    "#4BC0C0", 
    "#9966FF", 
    "#FF9F40", 
    "#FF5733", 
    "#33FF57", 
    "#3357FF", 
    "#FF33A1", 
    "#FFC300"  
];

  const pieChartData = productNames.map((product) => {
    const productSales = (filteredData.length > 0 ? filteredData : salesData).filter(item => item.name === product);
    const totalProductSales = productSales.reduce((acc, curr) => acc + (curr.price || 0), 0);
    
    return {
      name: product,
      value: totalProductSales,
      percentage: totalProductSales / totalPriceSum * 100,
    };
  }).filter(item => item.value > 0); 

  return (
    <div className="row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl flex flex-col justify-between">
      {isLoading ? (
        <div className="m-5">Loading...</div>
      ) : (
        <>
          <h2 className="text-lg font-semibold mb-2 px-7 pt-5">
            Total Sales Amount
          </h2>
          <div className="flex justify-between items-center mb-6 px-7 mt-5">
            <div className="text-lg font-medium">
              <p className="text-xs text-gray-400">Total Price</p>
              <span className="text-2xl font-extrabold">
                Ksh {totalPriceSum.toLocaleString("en", {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                })}
              </span>
            </div>
          </div>

          {/* Date Inputs and Filter Button */}
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

          {/* Pie Chart */}
          <div className="flex justify-center items-center">
            <PieChart width={300} height={300}>
              <Pie
                data={pieChartData}
                cx={150}
                cy={150}
                innerRadius={40}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${value.toFixed(1)} KSH`} /> 
              <Legend />
            </PieChart>
          </div>
        </>
      )}
    </div>
  );
};

export default TotalSalesAmount;