"use client";

import type { Message, Delivery, Notification } from "@/app/types";
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
  Dispatch,
} from "react";

// --- State Type ---
type State = {
  chatHistory: Message[];
  notifications: Notification[]; // ✅ Notifications are objects now
  deliveryDetails: Delivery | null;
  suggestedShipmentPort: string | null;
  isLoading: boolean;
  keepNotifications: boolean;
};

// --- Initial State ---
const initialState: State = {
  keepNotifications: false,
  chatHistory: [],
  notifications: [],
  deliveryDetails: null,
  suggestedShipmentPort: null,
  isLoading: false,
};

// --- Action Types ---
type Action =
  | { type: "ADD_CHAT"; payload: Message }
  | { type: "SET_NOTIFICATIONS"; payload: Notification[] } // ✅ Proper Notification type
  | { type: "SET_DELIVERY_DETAILS"; payload: Delivery }
  | { type: "SET_SUGGESTED_SHIPMENT_PORT"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_FULL_STATE"; payload: State }
  | { type: "CLEAR_STATE" }
  | { type: "CLEAR_CHAT" }
  | { type: "SET_KEEP_NOTIFICATIONS"; payload: boolean };

// --- Reducer ---
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_CHAT":
      return { ...state, chatHistory: [...state.chatHistory, action.payload] };
    case "SET_NOTIFICATIONS":
      return { ...state, notifications: action.payload };
    case "SET_DELIVERY_DETAILS":
      return { ...state, deliveryDetails: action.payload };
    case "SET_SUGGESTED_SHIPMENT_PORT":
      return { ...state, suggestedShipmentPort: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_FULL_STATE":
      return action.payload;
    case "CLEAR_STATE":
      localStorage.removeItem("appState");
      return initialState;
    case "CLEAR_CHAT":
      return { ...state, chatHistory: [] };
    case "SET_KEEP_NOTIFICATIONS":
      return { ...state, keepNotifications: action.payload };
    default:
      return state;
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
  }
};

// --- Context ---
type AppStateContextType = {
  state: State;
  dispatch: Dispatch<Action>;
};

const AppStateContext = createContext<AppStateContextType | undefined>(
  undefined
);

// --- Provider ---
export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const storedState = localStorage.getItem("appState");
    if (storedState) {
      dispatch({ type: "SET_FULL_STATE", payload: JSON.parse(storedState) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("appState", JSON.stringify(state));
  }, [state]);

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
};

// --- Custom Hook ---
export const useAppState = (): AppStateContextType => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
};
