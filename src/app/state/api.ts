import { createApi, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react"; 
import { db } from '@/firebase/firestoreService'; 
import { collection, addDoc, getDocs } from "firebase/firestore";

export interface Product {
  productId: string;
  name: string;
  price: number;
  rating?: number;
  stockQuantity: number;
}

export interface NewProduct {
  name: string;
  price: number;
  rating?: number;
  stockQuantity: number;
}

export interface SalesSummary {
  salesSummaryId: string;
  totalValue: number;
  changePercentage?: number;
  date: string;
}

export interface PurchaseSummary {
  purchaseSummaryId: string;
  totalPurchased: number; 
  changePercentage?: number;
  date?: string;
}

export interface ExpenseSummary {
  expenseSummaryId: string; 
  totalExpenses: number;
  date: string;
}

export interface ExpensesByCategorySummary { 
  expensesByCategorySummaryId: string;
  category: string;
  amount: string; 
  date: string;
}

export interface NewExpense {
  name: string;
  amount: number;
  category: string;
}

export interface Expense {
  expenseId: string; 
  name: string;
  amount: number;
  category: string;
  expensesByCategoryId?: string; 
}

export interface DashboardMetrics {
  popularProducts: Product[];
  salesSummary: SalesSummary[];
  purchaseSummary: PurchaseSummary[];
  expenseSummary: ExpenseSummary[];
  expensesByCategorySummary: ExpensesByCategorySummary[];
}

export interface User {
  id: string; 
  name: string;
  email: string;
}

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: '/' }), 
  tagTypes: ["DashboardMetrics", "Products", "Users", "Expenses", "Purchases"],
  endpoints: (build) => ({
    getDashboardMetrics: build.query<DashboardMetrics, void>({
      queryFn: async () => {
        const metrics: DashboardMetrics = { 
          popularProducts: [], 
          salesSummary: [], 
          purchaseSummary: [], 
          expenseSummary: [], 
          expensesByCategorySummary: [] 
        };
       
        return { data: metrics };
      },
      providesTags: ["DashboardMetrics"],
    }),
    getProducts: build.query<Product[], void>({
      queryFn: async () => {
        const products: Product[] = [];
        const querySnapshot = await getDocs(collection(db, "products"));
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          products.push({ productId: doc.id, ...data } as Product);
        });
        return { data: products };
      },
      providesTags: ["Products"],
    }),
    createProduct: build.mutation<Product, NewProduct>({
      queryFn: async (newProduct) => {
        const docRef = await addDoc(collection(db, "products"), newProduct);
        return { data: { productId: docRef.id, ...newProduct } };
      },
      invalidatesTags: ["Products"],
    }),
    getUsers: build.query<User[], void>({
      queryFn: async () => {
        const users: User[] = [];
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          users.push({ id: doc.id, ...data } as User);
        });
        return { data: users };
      },
      providesTags: ["Users"],
    }),
    getExpenses: build.query<Expense[], void>({
      queryFn: async () => {
        const expenses: Expense[] = [];
        const querySnapshot = await getDocs(collection(db, "expenses"));
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          expenses.push({ expenseId: doc.id, ...data } as Expense);
        });
        return { data: expenses };
      },
      providesTags: ["Expenses"],
    }),
    addExpense: build.mutation<Expense, NewExpense>({
      queryFn: async (newExpense) => {
        try {
          const docRef = await addDoc(collection(db, "expenses"), newExpense);
          return { data: { expenseId: docRef.id, ...newExpense } };
        } catch (error) {
          console.error("Failed to add Expense:", error);
          return {
            error: {
              status: 'CUSTOM_ERROR',
              data: { message: 'Failed to add Expense' },
            } as FetchBaseQueryError,
          };
        }
      },
      invalidatesTags: ["Expenses"],
    }),
    getExpensesByCategory: build.query<ExpensesByCategorySummary[], void>({
      queryFn: async () => {
        const expensesByCategory: ExpensesByCategorySummary[] = [];
        const querySnapshot = await getDocs(collection(db, "expenses"));
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          expensesByCategory.push({ 
            expensesByCategorySummaryId: doc.id, 
            category: data.category || '', 
            amount: data.amount || '0', 
          } as ExpensesByCategorySummary);
        });
        return { data: expensesByCategory };
      },
      providesTags: ["Expenses"],
    }),
    getPurchases: build.query<PurchaseSummary[], void>({
      queryFn: async () => {
        const purchases: PurchaseSummary[] = [];
        const querySnapshot = await getDocs(collection(db, "purchases"));
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          purchases.push({ purchaseSummaryId: doc.id, ...data } as PurchaseSummary);
        });
        return { data: purchases };
      },
      providesTags: ["Purchases"],
    }),
    createPurchase: build.mutation<PurchaseSummary, Partial<PurchaseSummary>>({
      queryFn: async (newPurchase) => {
        try {
          if (newPurchase.totalPurchased === undefined) {
            return {
              error: {
                status: 'CUSTOM_ERROR',
                data: { message: 'totalPurchased is required' },
              } as FetchBaseQueryError,
            };
          }
          
          const docRef = await addDoc(collection(db, "purchases"), newPurchase);
          const createdPurchase: PurchaseSummary = {
            purchaseSummaryId: docRef.id,
            totalPurchased: newPurchase.totalPurchased,
            changePercentage: newPurchase.changePercentage,
          };
          return { data: createdPurchase };
        } catch (error) {
          console.error("Failed to add Purchase:", error); 
          return {
            error: {
              status: 'CUSTOM_ERROR',
              data: { message: 'Failed to add Purchases' },
            } as FetchBaseQueryError,
          };
        }
      },
      invalidatesTags: ["Purchases", "DashboardMetrics"], 
    }),
  }),
});

export const {
  useGetDashboardMetricsQuery,
  useGetProductsQuery,
  useCreateProductMutation,
  useGetUsersQuery,
  useGetExpensesQuery,
  useAddExpenseMutation,
  useGetExpensesByCategoryQuery,
  useGetPurchasesQuery,
  useCreatePurchaseMutation,
} = api;

export default api;