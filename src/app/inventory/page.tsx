"use client";

import { useEffect, useState } from "react";
import Header from "@/app/(components)/Header";
import { db } from "@/firebase/firestoreService"; 
import { collection, onSnapshot } from "firebase/firestore";


interface Sales {
  id: string;
  name: string;
  stockQuantity: number;
  description: string;
}


interface Purchase {
  id: string;
  supplierName: string;
  quantityPurchased: number;
  description: string;
}


interface CombinedInventory {
  productName: string;
  description: string;
  purchases: number;
  sales: number;
  availableStock: number;
}

// Predefined list of products
const predefinedProducts = [
  'CEMENT', 'TIMBER', 'STEEL', 'IRON-SHEETS', 'PAINT', 
  'BRICKS', 'NAILS', 'GLASS', 'MACHINERY', 
  'PLUMBING TOOLS', 'HAND TOOLS'
];

// Mapping of supplier names to product names
const supplierToProductMap: { [key: string]: string } = {
  'CEMENT SUPPLIES': 'CEMENT',
  'TIMBER SUPPLIES': 'TIMBER',
  'STEEL SUPPLIES': 'STEEL',
  'IRON-SHEETS SUPPLIES': 'IRON-SHEETS',
  'PAINT SUPPLIES': 'PAINT',
  'NAILS SUPPLIES': 'NAILS',
  'MACHINERY SUPPLIES': 'MACHINERY',
  'PLUMBING TOOLS SUPPLIES': 'PLUMBING TOOLS',
  'HAND TOOLS SUPPLIES': 'HAND TOOLS',
};

const Inventory = () => {
  const [salesData, setSalesData] = useState<Sales[]>([]);
  const [purchasesData, setPurchasesData] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [combinedInventoryData, setCombinedInventoryData] = useState<CombinedInventory[][]>([]);

  useEffect(() => {
    const unsubscribePurchases = onSnapshot(collection(db, "inventory"), (snapshot) => {
      const purchases = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Purchase[];
      setPurchasesData(purchases);
    });

    const unsubscribeSales = onSnapshot(collection(db, "salesInvent"), (snapshot) => {
      const sales = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Sales[];
      setSalesData(sales);
      setLoading(false);
    });

    return () => {
      unsubscribePurchases();
      unsubscribeSales();
    };
  }, []);

  useEffect(() => {
    const combinedData: CombinedInventory[][] = predefinedProducts.map(() => []);

    
    purchasesData.forEach(purchase => {
      const productName = supplierToProductMap[purchase.supplierName];
      if (productName) {
        const productIndex = predefinedProducts.indexOf(productName);
        const existingItem = combinedData[productIndex].find(item => item.description === purchase.description);

        
        if (existingItem) {
          existingItem.purchases += purchase.quantityPurchased; 
        } else {
          const newItem: CombinedInventory = {
            productName,
            description: purchase.description,
            purchases: purchase.quantityPurchased,
            sales: 0, 
            availableStock: purchase.quantityPurchased, 
          };
          combinedData[productIndex].push(newItem); 
        }
      }
    });

    // Process sales data
    salesData.forEach(sale => {
      const productIndex = predefinedProducts.indexOf(sale.name);
      const existingItem = combinedData[productIndex].find(item => item.description === sale.description);

      
      if (existingItem) {
        existingItem.sales += sale.stockQuantity; 
      } else {
        const newItem: CombinedInventory = {
          productName: sale.name,
          description: sale.description,
          purchases: 0, 
          sales: sale.stockQuantity, 
          availableStock: 0, 
        };
        combinedData[productIndex].push(newItem); 
      }
    });

    // Update available stoc
    combinedData.forEach(product => {
      product.forEach(item => {
        item.availableStock = item.purchases - item.sales; 
      });
    });

    
    setCombinedInventoryData(combinedData);
  }, [purchasesData, salesData]); 

 
  if (loading) {
    return <div className="py-4">Loading...</div>;
  }

  return (
    <div className="flex flex-col">
      <Header name="Inventory" />
      {combinedInventoryData.map((productData, index) => (
        <div key={index} className="mt-5">
          <h2 className="text-lg font-bold">{predefinedProducts[index]}</h2>
          <table className="min-w-full border border-gray-300 mt-2">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Description</th>
                <th className="border border-gray-300 px-4 py-2">Total Purchases</th>
                <th className="border border-gray-300 px-4 py-2">Total Sales</th>
                <th className="border border-gray-300 px-4 py-2">Available Stock</th>
              </tr>
            </thead>
            <tbody>
              {productData.map((item, itemIndex) => (
                <tr key={itemIndex}>
                  <td className="border border-gray-300 px-4 py-2">{item.description}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.purchases}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.sales}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.availableStock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default Inventory;