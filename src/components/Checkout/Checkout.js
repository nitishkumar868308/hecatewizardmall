"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMe } from "@/app/redux/slices/meProfile/meSlice";
import { fetchCart, deleteCartItem, updateCart } from "@/app/redux/slices/addToCart/addToCartSlice";
import toast from 'react-hot-toast';

const Checkout = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.me);
  const { items } = useSelector((state) => state.cart);

  const [quantities, setQuantities] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [shippingModalOpen, setShippingModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [selected, setSelected] = useState("UPI / Wallet");
  const [expanded, setExpanded] = useState("UPI / Wallet");
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [tempShipping, setTempShipping] = useState(null);

  const methods = [
    {
      name: "Credit / Debit Card", icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 6h18M3 14h18M3 18h18" />
        </svg>
      ), content: "Pay securely using your credit or debit card."
    },
    {
      name: "UPI / Wallet", icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3" />
        </svg>
      ), content: "Pay using Google Pay, PhonePe, Paytm, etc."
    },
    {
      name: "Cash on Delivery", icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3z" />
        </svg>
      ), content: "Pay with cash when your order arrives."
    },
  ];

  useEffect(() => {
    dispatch(fetchCart());
    dispatch(fetchMe());
  }, [dispatch]);

  // Set default shipping address
  useEffect(() => {
    if (user?.addresses?.length && !selectedShipping) {
      setSelectedShipping(user.addresses[0].id);
    }
  }, [user?.addresses]);

  const userCart = useMemo(() => {
    return items?.filter(item => String(item.userId) === String(user?.id)) || [];
  }, [items, user?.id]);

  useEffect(() => {
    if (userCart.length > 0 && selectedItems.length === 0) {
      setSelectedItems(userCart.map(item => item.id));
      setSelectAll(true);
    }
  }, [userCart]);

  useEffect(() => {
    if (userCart.length > 0 && Object.keys(quantities).length === 0) {
      const initialQuantities = userCart.reduce((acc, item) => {
        acc[item.id] = item.quantity || 1;
        return acc;
      }, {});
      setQuantities(initialQuantities);
    }
  }, [userCart, quantities]);

  const subtotal = userCart
    .filter(item => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + (Number(item.pricePerItem || item.price) * (quantities[item.id] || 1)), 0);

  const shipping = selectedItems.length > 0 ? 10 : 0;
  const total = subtotal + shipping;

  const handleQuantityChange = async (id, value) => {
    if (value < 1) return;

    // Update local quantity for instant UI
    setQuantities(prev => ({ ...prev, [id]: value }));

    // Persist change to backend
    try {
      await dispatch(updateCart({ id, quantity: value })).unwrap();
      toast.success("Cart updated");
      dispatch(fetchCart()); // optional: refresh cart from server
    } catch (err) {
      toast.error("Failed to update cart");
    }
  };

  const toggleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
      setSelectAll(false);
    } else {
      setSelectedItems(userCart.map(item => item.id));
      setSelectAll(true);
    }
  };

  const openRemoveModal = (item) => {
    setItemToRemove(item);
    setModalOpen(true);
  };

  const confirmRemove = async () => {
    if (!itemToRemove) return;
    setModalOpen(false);

    try {
      const res = await dispatch(deleteCartItem(itemToRemove.id)).unwrap();
      toast.success(res?.message || `${itemToRemove.productName} removed from cart`);
      dispatch(fetchCart());
      setModalOpen(false);
    } catch (err) {
      toast.error(err?.message || "Failed to remove item");
    }
  };

  const selectedAddress = user?.addresses?.find(addr => addr.id === selectedShipping);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left - Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-between">
            Shopping Cart
            {userCart.length > 0 && (
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input type="checkbox" className="accent-gray-700 w-5 h-5" checked={selectAll} onChange={handleSelectAll} />
                Select All
              </label>
            )}
          </h2>

          {userCart.length === 0 ? (
            <p className="text-gray-600">Your cart is empty.</p>
          ) : (
            userCart.map((product) => (
              <div
                key={product.id}
                className="flex flex-col sm:flex-row items-center sm:items-start justify-between bg-white shadow-md rounded-xl p-4"
              >
                <input
                  type="checkbox"
                  checked={selectedItems.includes(product.id)}
                  onChange={() => toggleSelectItem(product.id)}
                  className="accent-gray-700 w-5 h-5"
                />
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={product.image}
                    alt={product.productName}
                    className="w-24 h-24 object-cover rounded-lg border"
                  />
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">{product.productName}</h3>
                    <p className="text-gray-500">{product.currencySymbol}{product.pricePerItem || product.price}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto mt-4 sm:mt-0 gap-4">
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <button
                      onClick={() =>
                        handleQuantityChange(product.id, (quantities[product.id] || 1) - 1)
                      }
                      className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="px-4 font-medium">{quantities[product.id] || 1}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(product.id, (quantities[product.id] || 1) + 1)
                      }
                      className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                  <p className="font-semibold text-gray-800">
                    {product.currencySymbol || "₹"}{' '}
                    {(Number(product.pricePerItem || product.price) * (quantities[product.id] || 1)).toFixed(2)}
                  </p>
                  <button
                    onClick={() => openRemoveModal(product)}
                    className="text-red-600 hover:text-red-800 font-semibold cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right - Order Summary */}
        <div className="bg-white shadow-lg rounded-xl p-6 sticky top-6 max-h-[90vh] overflow-y-auto space-y-6">
          {/* Order Summary */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Order Summary</h3>
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{shipping}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-3">
              <span>Total</span>
              <span>{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Shipping Address */}
          {selectedAddress && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-md font-semibold text-gray-700">Shipping Address</h4>
                <button
                  className="px-3 py-1 bg-gray-700 text-white rounded-lg hover:bg-gray-900 text-sm cursor-pointer"
                  onClick={() => {
                    setTempShipping(selectedShipping);
                    setShippingModalOpen(true);
                  }}
                >
                  Change
                </button>
              </div>
              <div className="text-gray-600">
                <div className="flex justify-between items-center font-semibold text-gray-800">
                  <span>{selectedAddress.name}</span>
                  <span>{selectedAddress.mobile}</span>
                </div>
                <div className="mt-1 text-gray-700 text-sm">
                  {[selectedAddress.address, selectedAddress.city, selectedAddress.state, selectedAddress.pincode].join(", ")}
                </div>
              </div>
            </div>
          )}

          {/* Billing Address (optional collapse for compactness) */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-md font-semibold text-gray-700 mb-1">Billing Address</h4>
            <div className="text-gray-600 text-sm">
              <div className="font-semibold">{user?.name}</div>
              <div>{user?.phone}</div>
              <div className="truncate">{user?.address || "No billing address"}</div>
            </div>
          </div>

          {/* Payment Method */}
          {/* <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-md font-semibold text-gray-700 mb-4">Payment Method</h4>
            <div className="flex gap-4 flex-wrap">
              {methods.map((method) => {
                const isSelected = selected === method.name;
                const isExpanded = expanded === method.name;
                return (
                  <div
                    key={method.name}
                    className={`flex-1 min-w-[150px] border rounded-lg cursor-pointer transition p-4 relative
                ${isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-400"}
              `}
                    onClick={() => {
                      setSelected(method.name);
                      setExpanded(isExpanded ? null : method.name);
                    }}
                  >
                    <div className="flex flex-col items-center">
                      {method.icon}
                      <span className="text-gray-800 font-medium text-center">{method.name}</span>
                    </div>

                    <div className="absolute top-2 right-2 text-gray-600 font-bold">
                      {isExpanded ? "−" : "+"}
                    </div>

                    {isExpanded && (
                      <div className="mt-4 text-gray-700 text-sm text-center">
                        {method.content}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div> */}


          {/* Pay Button */}
          <button
            disabled={selectedItems.length === 0}
            className={`w-full py-3 rounded-xl font-semibold transition ${selectedItems.length === 0
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-gray-600 text-white hover:bg-gray-900 cursor-pointer"
              }`}
          >
            Pay Now
          </button>
        </div>

      </div>

      {/* Remove / Change Address Modal */}
      {shippingModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Shipping Address</h3>
            <div className="space-y-3 max-h-72 overflow-y-auto">
              {user?.addresses?.map((addr) => (
                <label
                  key={addr.id}
                  className={`block p-3 border rounded-lg cursor-pointer transition ${tempShipping === addr.id
                    ? "border-gray-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  <input
                    type="radio"
                    name="shippingAddress"
                    value={addr.id}
                    checked={tempShipping === addr.id}
                    onChange={() => setTempShipping(addr.id)}
                    className="mr-2"
                  />
                  <div className="text-gray-800 font-semibold">{addr.name}</div>
                  <div className="text-gray-600 text-sm">{addr.mobile}</div>
                  <div className="text-gray-600 text-sm whitespace-pre-line">{addr.address}</div>
                  <div className="text-gray-600 text-sm">{addr.pincode}</div>
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShippingModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setSelectedShipping(tempShipping);
                  setShippingModalOpen(false);
                }}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-900 cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Item Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-96">
            <h3 className="text-lg font-semibold text-white mb-4 text-center">Confirm Remove</h3>
            <p className="mb-6 text-center text-gray-200 text-base sm:text-lg leading-relaxed break-words">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-white bg-red-400 px-2 py-1 rounded whitespace-normal inline-block">
                {itemToRemove?.productName}
              </span>{" "}
              from your cart?
            </p>


            <div className="flex justify-end gap-4">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemove}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
