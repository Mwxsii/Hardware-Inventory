import React, { ChangeEvent, FormEvent, useState } from "react";
import { v4 } from "uuid";
import Header from "@/app/(components)/Header";
import { db } from "@/firebase/firestoreService"; 
import { collection, addDoc } from "firebase/firestore";

type PurchaseFormData = {
  purchaseId: string;
  supplierName: string;
  purchasePrice: number;
  quantityPurchased: number;
  measurementUnit: string; 
  description: string; 
};

type CreatePurchasesModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const allowedSuppliers = [
  "CEMENT SUPPLIES",
  "TIMBER SUPPLIES",
  "STEEL SUPPLIES",
  "IRON-SHEETS SUPPLIES",
  "PAINT SUPPLIES",
  "BRICKS SUPPLIES",
  "NAILS SUPPLIES",
  "GLASS SUPPLIES",
  "MACHINERY SUPPLIES",
  "PLUMBING TOOLS SUPPLIES",
  "HAND TOOLS SUPPLIES"
];

// Mapping of suppliers to their measurement units
const supplierMeasurementUnits: { [key: string]: string } = {
  "CEMENT SUPPLIES": "bags",
  "TIMBER SUPPLIES": "pieces",
  "STEEL SUPPLIES": "rolls",
  "IRON-SHEETS SUPPLIES": "sheets",
  "PAINT SUPPLIES": "cans(50ltrs)",
  "BRICKS SUPPLIES": "pieces",
  "NAILS SUPPLIES": "kgs",
  "GLASS SUPPLIES": "pieces",
  "MACHINERY SUPPLIES": "number",
  "PLUMBING TOOLS SUPPLIES": "pieces",
  "HAND TOOLS SUPPLIES": "number"
};

const CreatePurchasesModal = ({ isOpen, onClose }: CreatePurchasesModalProps) => {
  const [formData, setFormData] = useState<PurchaseFormData>({
    purchaseId: v4(),
    supplierName: "",
    purchasePrice: 0,
    quantityPurchased: 0,
    measurementUnit: "bags", 
    description: "", 
  });

  const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;

    
    if (name === "supplierName") {
      setFormData({
        ...formData,
        [name]: value,
        measurementUnit: supplierMeasurementUnits[value] || "bags", 
      });
    } else {
      setFormData({
        ...formData,
        [name]:
          name === "purchasePrice" || name === "quantityPurchased"
            ? value ? parseFloat(value) : 0 
            : value,
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    
    if (!allowedSuppliers.includes(formData.supplierName)) {
      alert("Supplier name must be one of the following: " + allowedSuppliers.join(", "));
      return;
    }

    
    if (isNaN(formData.purchasePrice) || formData.purchasePrice < 0) {
      alert("Purchase price must be a valid number and cannot be negative.");
      return;
    }

    
    if (isNaN(formData.quantityPurchased) || formData.quantityPurchased < 0) {
      alert("Quantity purchased must be a valid number and cannot be negative.");
      return;
    }

    try {
      
      await addDoc(collection(db, "purchases"), {
        purchaseId: formData.purchaseId,
        supplierName: formData.supplierName,
        purchasePrice: formData.purchasePrice,
        quantityPurchased: formData.quantityPurchased,
        measurementUnit: formData.measurementUnit,
        totalPurchased: formData.purchasePrice * formData.quantityPurchased,
        date: new Date().toISOString(),
      });

      
      await addDoc(collection(db, "inventory"), {
        supplierName: formData.supplierName,
        description: formData.description.toUpperCase(),
        quantityPurchased: formData.quantityPurchased,
        measurementUnit: formData.measurementUnit,       
        date: new Date().toISOString(), 
      });

      alert("Purchase created successfully!");
      onClose(); 
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Failed to create purchase:', error.message);
      } else {
        console.error('Failed to create purchase:', error);
      }
      alert("Failed to create purchase. Please try again.");
    }
  };

  if (!isOpen) return null;

  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles = "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name="Create New Purchase" />
        <form onSubmit={handleSubmit} className="mt-5">
          {/* SUPPLIER NAME SECTION */}
          <label htmlFor="supplierName" className={labelCssStyles}>
            Supplier Name
          </label>          
          <select
            name="supplierName"
            onChange={handleChange}
            value={formData.supplierName}
            className={inputCssStyles}
            required
          >
            <option value="" disabled>Select a supplier</option>
            {allowedSuppliers.map((supplier) => (
              <option key={supplier} value={supplier}>
                {supplier}
              </option>
            ))}
          </select>

          {/* DESCRIPTION BOX */}
          <label htmlFor="description" className={labelCssStyles}>
            Description
          </label>
          <textarea
            name="description"
            placeholder="Enter a description"
            onChange={handleChange}
            value={formData.description} 
            className={`${inputCssStyles} h-10`} 
          />

          {/* PURCHASE PRICE */}
          <label htmlFor="purchasePrice" className={labelCssStyles}>
            Purchase Price
          </label>
          <input
            type="number"
            name="purchasePrice"
            placeholder="Purchase Price"
            onChange={handleChange}
            value={formData.purchasePrice || ""}
            className={inputCssStyles}
            required
          />

          {/* QUANTITY PURCHASED */}
          <label htmlFor="quantityPurchased" className={labelCssStyles}>
            Quantity Purchased
          </label>
          <input
            type="number"
            name="quantityPurchased"
            placeholder="Quantity Purchased"
            onChange={handleChange}
            value={formData.quantityPurchased || ""}
            className={`${inputCssStyles} mb-2`}
            required
          />

          {/* MEASUREMENT UNIT DROPDOWN */}
          <label htmlFor="measurementUnit" className={labelCssStyles}>
            Measurement Unit
          </label>
          <select
            name="measurementUnit"
            value={formData.measurementUnit}
            className={`${inputCssStyles} w-25`} 
            disabled 
          >
            <option value={formData.measurementUnit} disabled>
              {formData.measurementUnit}
            </option>
          </select>

          {/* CREATE ACTIONS */}
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Create
          </button>
          <button
            onClick={onClose}
            type="button"
            className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePurchasesModal;