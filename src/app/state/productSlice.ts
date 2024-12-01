
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface Product {
    id: string;
    name: string;
    amount: number;
    
}


interface ProductsState {
    items: Product[];
}


const initialState: ProductsState = {
    items: [],
};


const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setProducts(state, action: PayloadAction<Product[]>) {
           
            state.items = action.payload; 
        },
        addProduct(state, action: PayloadAction<Product>) {
            const product: Product = action.payload; 
            state.items.push(product);
        },
       
    },
});


export const { setProducts, addProduct } = productsSlice.actions;
export default productsSlice.reducer;