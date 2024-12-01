import React, { ChangeEvent, FormEvent, useState } from "react";
import Header from "@/app/(components)/Header";
import { db } from "@/firebase/firestoreService"; 
import { collection, addDoc } from "firebase/firestore";

type ProductFormData = {
  name: string;
  description: string; 
  price: number;
  stockQuantity: number;
  measurementUnit: string; 
};

type CreateProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (productData: ProductFormData) => void;
};

const allowedProducts = [
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

// Mapping of products to their measurement units
const productMeasurementUnits: { [key: string]: string } = {
  "CEMENT": "bags",
  "TIMBER": "pieces",
  "STEEL": "rolls",
  "IRON-SHEETS": "sheets",
  "PAINT": "cans(50ltrs)",
  "BRICKS": "pieces",
  "NAILS": "kgs",
  "GLASS": "pieces",
  "MACHINERY": "number",
  "PLUMBING TOOLS": "pieces",
  "HAND TOOLS": "number"
};

const CreateProductModal = ({
  isOpen,
  onClose,
  onCreate, 
}: CreateProductModalProps) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "", 
    price: 0,
    stockQuantity: 0,
    measurementUnit: "bags", 
  });

  const [isLoading, setIsLoading] = useState(false); 

  const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "name") {
      setFormData(prevData => ({
        ...prevData,
        [name]: value,
        measurementUnit: productMeasurementUnits[value] || "bags", 
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]:
          name === "price" || name === "stockQuantity"
            ? value ? parseFloat(value) : 0 
            : value,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate product name
    if (!allowedProducts.includes(formData.name.toUpperCase())) {
      alert("Product name must be one of the following: CEMENT, TIMBER, STEEL, IRON SHEETS, PAINT, BRICKS, NAILS.");
      return;
    }

    if (isNaN(formData.price) || formData.price < 0) {
      alert("Price must be a valid number and cannot be negative.");
      return;
    }

    if (isNaN(formData.stockQuantity) || formData.stockQuantity < 0) {
      alert("Stock quantity must be a valid number and cannot be negative.");
      return;
    }

    try {
      setIsLoading(true); 
      
      
      await addDoc(collection(db, "products"), {
        name: formData.name,
        description: formData.description, 
        price: formData.price,
        stockQuantity: formData.stockQuantity,
        measurementUnit: formData.measurementUnit, 
        createdAt: new Date().toISOString(), 
      });

      
      await addDoc(collection(db, "salesInvent"), {
        name: formData.name,
        description: formData.description.toUpperCase(), 
        stockQuantity: formData.stockQuantity, 
        measurementUnit: formData.measurementUnit, 
        createdAt: new Date().toISOString(), 
      });
      alert("Product created successfully!");
      
      
      onCreate(formData); 
      onClose();
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product. Please try again.");
    } finally {
      setIsLoading(false); 
    }
  };

  if (!isOpen) return null;

  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles = "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name="Create New Product" />
        <form onSubmit={handleSubmit} className="mt-5">
          {/* PRODUCT NAME SECTION */}
          <label htmlFor="productName" className={labelCssStyles}>
            Product Name
          </label>
          <select
            name="name"
            onChange={handleChange}
            value={formData.name}
            className={inputCssStyles}
            required
          >
            <option value="" disabled>Select a product</option>
            {allowedProducts.map((product) => (
              <option key={product} value={product}>
                {product}
              </option>
            ))}
          </select>
           
          {/* DESCRIPTION */}
          <label htmlFor="productDescription" className={labelCssStyles}>
            Product Description/Brand
          </label>
          <textarea
            name="description"
            placeholder="Enter product description"
            onChange={handleChange}
            value={formData.description}
            className={`${inputCssStyles} h-10`} 
            required
          />
           
          {/* PRICE */}
          <label htmlFor="productPrice" className={labelCssStyles}>
            Price
          </label>
          <input
            type="number"
            name="price"
            placeholder="Price"
            onChange={handleChange}
            value={formData.price || ""} 
            className={inputCssStyles}
            required
          />
           
          {/* STOCK QUANTITY */}
          <label htmlFor="stockQuantity" className={labelCssStyles}>
            Stock Quantity
          </label>
          <div className="flex items-center">
            <input
              type="number"
              name="stockQuantity"
              placeholder="Stock Quantity"
              onChange={handleChange}
              value={formData.stockQuantity || ""} 
              className={`${inputCssStyles} flex-2`} 
              required
            />
             
            {/* MEASUREMENT UNIT DROPDOWN */}
            <select
              name="measurementUnit"
              onChange={handleChange}
              value={formData.measurementUnit}
              className={`${inputCssStyles} ml-2 w-24`} 
              required
              disabled 
            >
              <option value={formData.measurementUnit} disabled>
                {formData.measurementUnit}
              </option>
            </select>
          </div>
           
          {/* CREATE ACTIONS */}
          <button
            type="submit"
            className={`mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={isLoading} 
          >
            {isLoading ? "Creating..." : "Create"} 
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

export default CreateProductModal;