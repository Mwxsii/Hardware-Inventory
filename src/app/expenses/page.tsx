"use client";

import { useState } from "react";
import { PlusCircleIcon } from "lucide-react"; 
import Header from "@/app/(components)/Header";
import CreatePurchasesModal from "@/app/expenses/CreateExpenseModal"; 
import { useGetExpensesQuery, useAddExpenseMutation } from "@/app/state/api"; 

type ExpenseFormData = {
  name: string; 
  amount: number;
  category: string;
};

const Expenses = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<ExpenseFormData>({
    name: '',
    amount: 0,
    category: ''
  });
  const { data: expenses, isLoading, isError, refetch } = useGetExpensesQuery(); 
  const [addExpense] = useAddExpenseMutation();

  const handleCreateExpense = async (expenseData: ExpenseFormData) => {
    try {
      await addExpense(expenseData).unwrap(); 
      console.log("Expense added:", expenseData); 
      refetch(); 
    } catch (error) {
      console.error("Failed to add expense:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCreateExpense(formData);
    setFormData({ name: '', amount: 0, category: '' }); 
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) : value, 
    }));
  };

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !Array.isArray(expenses)) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch expenses
      </div>
    );
  }

  return (
    <div className="mx-auto pb-5 w-full flex">
      {/* HEADER BAR */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <Header name="Expenses" />
          <button
            className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
            onClick={() => setIsModalOpen(true)}
          >
            <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Add Purchases 
          </button>
        </div>

        {/* BODY EXPENSES LIST */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-between">
          {expenses.length === 0 ? (
            <div className="text-center py-4">No expenses available</div>
          ) : (
            expenses.map((expense) => (
              <div
                key={expense.expensesByCategoryId || expense.name} 
                className="border shadow rounded-md p-4 max-w-full w-full mx-auto"
              >
                <div className="flex flex-col items-center">
                  <h3 className="text-lg text-gray-900 font-semibold">
                    {expense.name}
                  </h3>
                  <p className="text-gray-800">
                    Ksh {typeof expense.amount === 'number' ? expense.amount.toFixed(2) : 'N/A'}
                  </p>
                  <div className="text-sm text-gray-600 mt-1">
                    Category: {expense.category}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

            {/* FORM SECTION */}
            <div className="w-full sm:w-1/3 p-4">
        <h2 className="text-xl mb-4">Add Expense</h2>
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Person
            </label>
            <select
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select a person</option>
              <option value="Inventory clerk">Inventory clerk</option>
              <option value="Owner">Owner</option>
              <option value="Sales officer">Sales Officer</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
              Amount
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter amount"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select a category</option>
              <option value="Salaries">Salaries</option>
              <option value="Office">Office</option>
              <option value="Rent">Rent</option>
              <option value="Insurance">Insurance</option>
              <option value="Licenses and Permits">Licenses and Permits</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add Expense
            </button>
          </div>
        </form>
      </div>

      {/* MODAL */}
      <CreatePurchasesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        
      />
    </div>
  );
};

export default Expenses;