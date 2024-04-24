// src/features/product/productSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import {
  getAllProducts,
  getSingleProduct,
  createProduct,
  editProduct,
  deleteProduct,
} from "./productAPI";

export interface Image {
  _type: "image";
  asset: {
    _type: "reference";
    _ref: string;
  };
}

export interface Product {
  _id?: string;
  name: string;
  description?: string;
  sku: string;
  price: number;
  image?: Image;
  category?: {
    _type: "reference";
    _ref: string;
  };
  supplier?: {
    _type: "reference";
    _ref: string;
  };
  smartContractAddress?: string;
  status?: "available" | "outOfStock" | "discontinued";
  inventoryQuantity?: number;
}

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  currentProduct: null,
  status: "idle",
  error: null,
};

// Async thunks
export const fetchProducts = createAsyncThunk("products/fetchAll", async () => {
  return await getAllProducts();
});

export const fetchProduct = createAsyncThunk(
  "products/fetchSingle",
  async (productId: string) => {
    return await getSingleProduct(productId);
  }
);

export const addProduct = createAsyncThunk(
  "products/create",
  async ({
    productData,
    imageFile,
  }: {
    productData: Product;
    imageFile: any;
  }) => {
    return await createProduct(productData, imageFile);
  }
);

export const updateProduct = createAsyncThunk(
  "products/update",
  async ({
    productId,
    productData,
    imageFile,
  }: {
    productId: any;
    productData: Product;
    imageFile: any;
  }) => {
    return await editProduct(productId, productData, imageFile);
  }
);

export const removeProduct = createAsyncThunk(
  "products/delete",
  async (productId: string) => {
    return await deleteProduct(productId);
  }
);

// Slice
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.products = action.payload;
          state.status = "succeeded";
        }
      )
      .addCase(
        fetchProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.currentProduct = action.payload;
          state.status = "succeeded";
        }
      )
      .addCase(addProduct.fulfilled, (state, action: PayloadAction<any>) => {
        state.products.push(action.payload);
        state.status = "succeeded";
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<any>) => {
        const index = state.products.findIndex(
          (product) => product._id === action.payload._id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        state.status = "succeeded";
      })
      .addCase(removeProduct.fulfilled, (state, action: PayloadAction<any>) => {
        state.products = state.products.filter(
          (product) => product._id !== action.payload
        );
        state.status = "succeeded";
      });
  },
});

export const selectAllProducts = (state: RootState) => state.products.products;
export const selectCurrentProduct = (state: RootState) =>
  state.products.currentProduct;

export default productSlice.reducer;