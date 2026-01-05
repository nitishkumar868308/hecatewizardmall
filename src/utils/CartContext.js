"use client";
import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <CartContext.Provider value={{ isOpen, setIsOpen }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
