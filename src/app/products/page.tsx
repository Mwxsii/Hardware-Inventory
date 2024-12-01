"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/firestoreService"; 
import { collection, getDocs} from "firebase/firestore";
import { PlusCircleIcon, SearchIcon, HammerIcon } from "lucide-react"; 
import Header from "@/app/(components)/Header";
import CreateProductModal from "./CreateProductModal";
import { v4 } from "uuid"; 

type ProductFormData = {
  productId?: string; 
  name: string;
  price: number;
  stockQuantity: number;
};

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState<ProductFormData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Fetch products from Firestore
  const fetchProducts = async () => {
    try {
      const productsCollection = collection(db, "products");
      const productSnapshot = await getDocs(productsCollection);
      const productList = productSnapshot.docs.map(doc => ({
        productId: doc.id,
        ...doc.data(),
      })) as ProductFormData[];
      setProducts(productList);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  
  const handleCreateProduct = (productData: ProductFormData) => {
    
    setProducts((prevProducts) => [
      ...prevProducts,
      { productId: v4(), ...productData }, 
    ]);
  };

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !Array.isArray(products)) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch products
      </div>
    );
  }

  return (
    <div className="mx-auto pb-5 w-full">
      {/* SEARCH  */}
      <div className="mb-6">
        <div className="flex items-center border-2 border-gray-200 rounded">
          <SearchIcon className="w-5 h-5 text-gray-500 m-2" />
          <input
            className="w-full py-2 px-4 rounded bg-white"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Products" />
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Add
          Product
        </button>
      </div>

      {/* BODY PRODUCTS LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-between">
        {products.length === 0 ? (
          <div className="text-center py-4">No products available</div>
        ) : (
          products.map((product) => (
            <div
              key={product.productId}
              className="border shadow rounded-md p-4 max-w-full w-full mx-auto"
            >
              <div className="flex flex-col items-center">
                {/* Icon representing the product */}
                <HammerIcon className="mb-3 w-36 h-36 text-gray-500" /> 
                <h3 className="text-lg text-gray-900 font-semibold">
                  {product.name}
                </h3>
                {/* Body */}
                <p className="text-gray-800">
                Ksh {typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A'}
                </p>
                <div className="text-sm text-gray-600 mt-1">
                  Stock: {product.stockQuantity}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL */}
      <CreateProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateProduct} 
      />
    </div>
  );
};

export default Products;