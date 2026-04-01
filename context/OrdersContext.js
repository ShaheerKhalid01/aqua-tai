"use client";
import { createContext, useContext, useReducer } from "react";
import { placeOrder, fetchAllOrders, updateOrderStatus } from "@/lib/api";
import { orders as seedOrders } from "@/data/orders";

const OrdersContext = createContext(null);

function ordersReducer(state, action) {
  switch (action.type) {
    case "LOAD":
      return { ...state, orders: action.payload, loading: false };
    case "ADD":
      return { ...state, orders: [action.payload, ...state.orders] };
    case "UPDATE_STATUS":
      return { ...state, orders: state.orders.map((o) => o.orderId === action.payload.orderId || o.id === action.payload.orderId ? { ...o, status: action.payload.status } : o) };
    case "DELETE":
      return { ...state, orders: state.orders.filter((o) => o.orderId !== action.payload && o.id !== action.payload) };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

export function OrdersProvider({ children }) {
  const [state, dispatch] = useReducer(ordersReducer, { orders: [], loading: false });

  // localStorage helpers
  const _saveLocal = (orders) => {
    try { localStorage.setItem("aquatai_orders", JSON.stringify(orders)); } catch {}
  };

  const _loadLocal = () => {
    try {
      const saved = localStorage.getItem("aquatai_orders");
      return saved ? JSON.parse(saved) : seedOrders;
    } catch { return seedOrders; }
  };

  // Load orders — tries API first (admin), falls back to localStorage
  const loadOrders = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const data = await fetchAllOrders();
      const normalized = data.orders.map((o) => ({ ...o, id: o.orderId }));
      dispatch({ type: "LOAD", payload: normalized });
    } catch {
      dispatch({ type: "LOAD", payload: _loadLocal() });
    }
  };

  // Place a new order — tries API first, falls back to localStorage
  const addOrder = async (orderData) => {
    const orderId = "ORD-" + String(Date.now()).slice(-6);
    const today = new Date().toISOString().slice(0, 10);

    try {
      const data = await placeOrder(orderData);
      const order = { ...data.order, id: data.order.orderId };
      dispatch({ type: "ADD", payload: order });
      _saveLocal([order, ...state.orders]);
      return order;
    } catch (err) {
      console.warn("API unavailable, saving order locally:", err.message);
      const localOrder = { orderId, id: orderId, ...orderData, date: today, status: "Pending" };
      const updated = [localOrder, ...state.orders];
      dispatch({ type: "ADD", payload: localOrder });
      _saveLocal(updated);
      return localOrder;
    }
  };

  // Update order status — tries API, always updates locally too
  const changeStatus = async (orderId, status) => {
    try { await updateOrderStatus(orderId, status); } catch {}
    dispatch({ type: "UPDATE_STATUS", payload: { orderId, status } });
    _saveLocal(state.orders.map((o) =>
      o.orderId === orderId || o.id === orderId ? { ...o, status } : o
    ));
  };

  // Delete order — tries API, always updates locally too
  const deleteOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(`/api/orders?id=${orderId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (err) {
      console.warn("API unavailable, deleting order locally:", err.message);
    }
    dispatch({ type: "DELETE", payload: orderId });
    _saveLocal(state.orders.filter((o) => o.orderId !== orderId && o.id !== orderId));
  };

  return (
    <OrdersContext.Provider value={{ orders: state.orders, loading: state.loading, loadOrders, addOrder, changeStatus, deleteOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}

export const useOrders = () => useContext(OrdersContext);