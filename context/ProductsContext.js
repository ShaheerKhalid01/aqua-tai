"use client";
import { createContext, useContext, useReducer } from "react";
import { fetchProducts, createProduct, updateProduct, deleteProduct } from "@/lib/api";

const ProductsContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case "LOAD":    return { ...state, products: action.payload, loading: false };
    case "ADD":     return { ...state, products: [action.payload, ...state.products] };
    case "UPDATE":  return { ...state, products: state.products.map(p => p._id === action.payload._id ? action.payload : p) };
    case "DELETE":  return { ...state, products: state.products.filter(p => p._id !== action.payload) };
    case "LOADING": return { ...state, loading: true };
    default: return state;
  }
}

export function ProductsProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { products: [], loading: false });

  const loadProducts = async () => {
    dispatch({ type: "LOADING" });
    try {
      const data = await fetchProducts();
      dispatch({ type: "LOAD", payload: data.products });
    } catch {
      dispatch({ type: "LOAD", payload: [] });
    }
  };

  const addProduct = async (productData) => {
    const data = await createProduct(productData);
    dispatch({ type: "ADD", payload: data.product });
    return data.product;
  };

  const editProduct = async (id, productData) => {
    const data = await updateProduct(id, productData);
    console.log("ProductsContext editProduct - API response:", data);
    console.log("ProductsContext editProduct - product:", data.product);
    dispatch({ type: "UPDATE", payload: data.product });
    return data.product;
  };

  const removeProduct = async (id) => {
    await deleteProduct(id);
    dispatch({ type: "DELETE", payload: id });
  };

  return (
    <ProductsContext.Provider value={{ products: state.products, loading: state.loading, loadProducts, addProduct, editProduct, removeProduct }}>
      {children}
    </ProductsContext.Provider>
  );
}

export const useProducts = () => useContext(ProductsContext);