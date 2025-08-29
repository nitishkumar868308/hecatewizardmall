"use client";
import React, { useState } from "react";

const Checkout = () => {
  // Sample products
  const products = [
    { id: 1, name: "Red T-shirt", price: 25, image: "/products/product1.webp" },
    { id: 2, name: "Blue Jeans", price: 40, image: "/products/product2.webp" },
    { id: 3, name: "Black Cap", price: 15, image: "/products/product3.webp" },
    { id: 4, name: "White Hoodie", price: 50, image: "/products/product4.webp" },
    { id: 5, name: "Sneakers", price: 70, image: "/products/product5.webp" },
  ];

  // State for quantities
  const [quantities, setQuantities] = useState(
    products.reduce((acc, p) => ({ ...acc, [p.id]: 1 }), {})
  );

  // Subtotal calculation
  const subtotal = products.reduce(
    (sum, p) => sum + p.price * quantities[p.id],
    0
  );
  const shipping = 10;
  const total = subtotal + shipping;

  // Handle quantity change
  const handleQuantityChange = (id, value) => {
    if (value >= 1 && value <= 5) {
      setQuantities({ ...quantities, [id]: value });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-8 px-4">
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-3">
        
        {/* Left Section - Products */}
        <div className="col-span-2 p-6 space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
          <div className="space-y-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex flex-col md:flex-row items-center justify-between border-b pb-4"
              >
                {/* Image + Details */}
                <div className="flex items-center gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-lg shadow"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-gray-600">${product.price}</p>
                  </div>
                </div>

                {/* Quantity + Total Price */}
                <div className="flex items-center gap-6 mt-3 md:mt-0">
                  {/* - / + Buttons */}
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <button
                      onClick={() =>
                        handleQuantityChange(product.id, quantities[product.id] - 1)
                      }
                      className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="px-4">{quantities[product.id]}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(product.id, quantities[product.id] + 1)
                      }
                      className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>

                  {/* Select Option */}
                  {/* <select
                    value={quantities[product.id]}
                    onChange={(e) =>
                      handleQuantityChange(product.id, Number(e.target.value))
                    }
                    className="border rounded-lg px-3 py-1"
                  >
                    {[1, 2, 3, 4, 5].map((q) => (
                      <option key={q} value={q}>
                        {q}
                      </option>
                    ))}
                  </select> */}

                  {/* Total Price */}
                  <p className="font-semibold">
                    ${product.price * quantities[product.id]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section - Address & Summary */}
        <div className="bg-gray-100 p-6 flex flex-col justify-between">
          {/* Address */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Shipping Address</h3>
            <p className="text-gray-700 mt-1">
              221B Baker Street, London, UK
            </p>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Shipping</span>
              <span>${shipping}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-2">
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>

          {/* Pay Button */}
          <button className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
