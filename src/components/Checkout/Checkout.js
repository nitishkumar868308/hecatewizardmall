"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMe } from "@/app/redux/slices/meProfile/meSlice";
import { fetchCart, deleteCartItem } from "@/app/redux/slices/addToCart/addToCartSlice";
import toast from 'react-hot-toast';

const Checkout = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.me);
  const { items } = useSelector((state) => state.cart);

  const [quantities, setQuantities] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    dispatch(fetchCart());
    dispatch(fetchMe());
  }, [dispatch]);

  // Filter user cart
  const userCart = useMemo(() => {
    return items?.filter(item => String(item.userId) === String(user?.id)) || [];
  }, [items, user?.id]);

  // Initialize quantities (no preselection)
  useEffect(() => {
    if (userCart.length > 0 && Object.keys(quantities).length === 0) {
      const initialQuantities = userCart.reduce((acc, item) => {
        acc[item.id] = item.quantity || 1;
        return acc;
      }, {});
      setQuantities(initialQuantities);
    }
  }, [userCart, quantities]);



  // Subtotal
  const subtotal = userCart
    .filter(item => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + (Number(item.pricePerItem || item.price) * (quantities[item.id] || 1)), 0);

  const shipping = selectedItems.length > 0 ? 10 : 0;
  const total = subtotal + shipping;

  // Quantity change
  const handleQuantityChange = (id, value) => {
    if (value >= 1) {
      setQuantities({ ...quantities, [id]: value });
    }
  };

  // Select/Deselect item
  const toggleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  // Select All toggle
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
      setSelectAll(false);
    } else {
      setSelectedItems(userCart.map(item => item.id));
      setSelectAll(true);
    }
  };

  // Open remove modal
  const openRemoveModal = (item) => {
    console.log("item", item)
    setItemToRemove(item);
    setModalOpen(true);
  };

  const confirmRemove = async () => {
    if (!itemToRemove) return;
    setModalOpen(false);

    try {
      const res = await dispatch(deleteCartItem(itemToRemove.id)).unwrap();
      console.log("res", res)
      toast.success(res?.message || `${itemToRemove.productName} removed from cart`);
      dispatch(fetchCart())
    } catch (err) {
      toast.error(err?.message || "Failed to remove item");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left - Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-between">
            Shopping Cart
            {userCart.length > 0 && (
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
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
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={selectedItems.includes(product.id)}
                  onChange={() => toggleSelectItem(product.id)}
                  className="mr-4 w-5 h-5"
                />

                {/* Product Info */}
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

                {/* Quantity + Price + Remove */}
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto mt-4 sm:mt-0 gap-4">
                  {/* Quantity Control */}
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

                  {/* Total */}
                  <p className="font-semibold text-gray-800">
                    {product.currencySymbol || "₹"}{' '}
                    {(Number(product.pricePerItem || product.price) * (quantities[product.id] || 1)).toFixed(2)}
                  </p>

                  {/* Remove Button */}
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
        <div className="bg-white shadow-lg rounded-xl p-6 h-fit sticky top-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h3>

          <div className="space-y-3">
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

          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h4 className="text-md font-semibold text-gray-700">Shipping Address</h4>
            <p className="text-gray-600 mt-1">{user?.address || "No address available"}</p>
          </div>

          <button
            disabled={selectedItems.length === 0}
            className={`w-full mt-6 py-3 rounded-xl  font-semibold transition ${selectedItems.length === 0
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-gray-600 text-white hover:bg-gray-900 cursor-pointer"
              }`}
          >
            Pay Now
          </button>
        </div>
      </div>

      {/* Remove Modal */}
      {modalOpen && (
        <div className="fixed inset-0  bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-96">
            <h3 className="text-lg font-semibold text-white mb-4 text-center">Confirm Remove</h3>
            <p className="text-gray-100 mb-6">
              Are you sure you want to remove <strong>{itemToRemove?.name}</strong> from your cart?
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
