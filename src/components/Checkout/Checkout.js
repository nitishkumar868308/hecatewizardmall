"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMe } from "@/app/redux/slices/meProfile/meSlice";
import { fetchCart, deleteCartItem, updateCart } from "@/app/redux/slices/addToCart/addToCartSlice";
import toast from 'react-hot-toast';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CreditCard, CreditCardFront, Wallet, DollarSign } from "lucide-react";

const Checkout = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.me);
  const { items } = useSelector((state) => state.cart);
  const router = useRouter();
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
      name: "Credit / Debit Card",
      icon: <CreditCard className="w-8 h-8 text-gray-600 mb-2" />,
      content: "Pay securely using your credit or debit card."
    },
    {
      name: "UPI / Wallet",
      icon: <Wallet className="w-8 h-8 text-gray-600 mb-2" />,
      content: "Pay using Google Pay, PhonePe, Paytm, etc."
    },
    {
      name: "Cash on Delivery",
      icon: <DollarSign className="w-8 h-8 text-gray-600 mb-2" />,
      content: "Pay with cash when your order arrives."
    },
  ];

  useEffect(() => {
    dispatch(fetchCart());
    dispatch(fetchMe());
  }, [dispatch]);

  // Set default shipping address
  useEffect(() => {
    if (user?.address?.length && !selectedShipping) {
      setSelectedShipping(user?.address);
    }
  }, [user?.address]);

  useEffect(() => {
    if (!selectedShipping) {
      if (user?.address) {
        setSelectedShipping("default_address"); // user.address ko ID assign
      } else if (user?.addresses?.length) {
        setSelectedShipping(user.addresses[0].id); // fallback: first address
      }
    }
  }, [user, selectedShipping]);


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

  const selectedAddress = useMemo(() => {
    if (!selectedShipping) return null;

    // First check in saved addresses
    let addr = user?.addresses?.find(a => a.id === selectedShipping);

    // If not found and selectedShipping is default, map user.address
    if (!addr && selectedShipping === "default_address" && user?.address) {
      addr = {
        id: "default_address",
        name: user.name,
        mobile: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
      };
    }

    return addr;
  }, [user, selectedShipping]);


  const shippingOptions = [
    ...(user?.addresses || []),
    ...(user?.address ? [{
      id: "default_address",
      name: user.name,
      mobile: user.phone,
      address: user.address,
      city: user.city,
      state: user.state,
      pincode: user.pincode,
    }] : []),
  ];

  const handleClick = () => {
    const orderData = {
      user: {
        id: user?.id,
        name: user?.name,
        phone: user?.phone,
        email: user?.email,
      },
      shippingAddress: selectedAddress,
      billingAddress: {
        name: user?.name,
        phone: user?.phone,
        address: user?.address,
        city: user?.city,
        state: user?.state,
        pincode: user?.pincode,
      },
      items: userCart
        .filter(item => selectedItems.includes(item.id))
        .map(item => ({
          id: item.id,
          productName: item.productName,
          price: item.pricePerItem || item.price,
          quantity: quantities[item.id] || 1,
          total: (Number(item.pricePerItem || item.price) * (quantities[item.id] || 1)).toFixed(2),
          image: item.image,
        })),
      subtotal: subtotal.toFixed(2),
      shipping: shipping,
      total: total.toFixed(2),
      paymentMethod: selected,
    };

    console.log("Order Data:", orderData);
  };

  return (
    <div className=" bg-gray-50 py-8 px-4">
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
                <span>{user?.addresses?.length ? selectedAddress?.name : user?.name}</span>
                <span>{user?.addresses?.length ? selectedAddress?.mobile : user?.phone}</span>
              </div>
              <div className="mt-1 text-gray-700 text-sm">
                {selectedShipping === "default_address"
                  ? user.address // direct string
                  : [selectedAddress?.address, selectedAddress?.city, selectedAddress?.state, selectedAddress?.pincode]
                    .filter(Boolean) // remove empty values
                    .join(", ")
                }
              </div>

            </div>
          </div>

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
            <div className="flex gap-4 overflow-x-auto pb-2">
              {methods.map((method) => {
                const isSelected = selected === method.name;

                return (
                  <div
                    key={method.name}
                    className={`flex-shrink-0 flex flex-col items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full cursor-pointer transition-all duration-300
            ${isSelected ? "bg-blue-100 border-2 border-blue-500 shadow-lg" : "bg-gray-100 hover:bg-gray-200"}
          `}
                    onClick={() => setSelected(method.name)}
                  >
                    <div className="text-gray-600 mb-1">
                      {method.icon}
                    </div>
                    <span className="text-xs sm:text-sm text-center text-gray-800 font-medium">
                      {method.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div> */}
          {/* Pay Button */}
          {/* <button
            disabled={selectedItems.length === 0}
            onClick={() => {
              // Redirect to /paynow with selected payment method
              router.push(`/paynow?method=${encodeURIComponent(selected)}`);
            }}
            className={`w-full py-3 rounded-xl font-semibold transition ${selectedItems.length === 0
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-gray-600 text-white hover:bg-gray-900 cursor-pointer"
              }`}
          >
            Pay Now
          </button> */}
          <div className="flex justify-center items-center">
            <button onClick={handleClick} className="cursor-pointer bg-gradient-to-r from-gray-800 to-gray-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300">
              Place order
            </button>
          </div>


        </div>

      </div>

      {/* Remove / Change Address Modal */}
      {shippingModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Shipping Address</h3>
            <div className="space-y-3 max-h-72 overflow-y-auto">
              {shippingOptions?.length > 0 ? (
                <div>
                  {shippingOptions.map((addr) => (
                    <label
                      key={addr.id}
                      className={`block p-3 border rounded-lg cursor-pointer transition ${tempShipping === addr.id ? "border-gray-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
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

                  {/* Confirm / Cancel buttons */}
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
              ) : (
                <div className="text-center p-5">
                  <p className="text-gray-600 mb-3">No shipping address found.</p>
                  <Link href="/dashboard?addresses">
                    <button className="px-4 py-2 bg-gray-600 text-white rounded-lg cursor-pointer hover:bg-gray-900">
                      Add Address
                    </button>
                  </Link>


                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Remove Item Modal */}
      {
        modalOpen && (
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
        )
      }
    </div >
  );
};

export default Checkout;
