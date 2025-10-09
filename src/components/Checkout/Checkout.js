"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMe } from "@/app/redux/slices/meProfile/meSlice";
import { fetchCart, deleteCartItem, updateCart } from "@/app/redux/slices/addToCart/addToCartSlice";
import toast from 'react-hot-toast';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CreditCard, CreditCardFront, Wallet, DollarSign } from "lucide-react";
import { fetchProducts } from "@/app/redux/slices/products/productSlice";
import { fetchOffers } from '@/app/redux/slices/offer/offerSlice'
import {
  fetchCountryTaxes,
} from "@/app/redux/slices/countryTaxes/countryTaxesSlice";

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
  const { products } = useSelector((state) => state.products);
  const { offers } = useSelector((state) => state.offers);
  const { countryTax } = useSelector((state) => state.countryTax);
  const [shippingOption, setShippingOption] = useState([]);
  const [selectedShippingOption, setSelectedShippingOption] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  console.log("countryTax", countryTax)

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
    const storedCountry = localStorage.getItem("selectedCountry");
    if (storedCountry) {
      setSelectedCountry(storedCountry);

      if (storedCountry === "IND") {
        const options = [
          { name: "By Road", price: 100 },
          { name: "By Air", price: null }
        ];
        setShippingOption(options);
        setSelectedShippingOption(options[0]); // default By Road
      } else {
        const options = [
          { name: "By Air", price: null }
        ];
        setShippingOption(options);
        setSelectedShippingOption(options[0]);
      }
    }
  }, []);



  useEffect(() => {
    dispatch(fetchCart());
    dispatch(fetchMe());
    dispatch(fetchProducts());
    dispatch(fetchOffers());
    dispatch(fetchCountryTaxes())
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
        setSelectedShipping("default_address");
      } else if (user?.addresses?.length) {
        setSelectedShipping(user.addresses[0].id);
      }
    }
  }, [user, selectedShipping]);


  const userCart = useMemo(() => {
    return items?.filter(item => String(item.userId) === String(user?.id)) || [];
  }, [items, user?.id]);
  console.log("userCart", userCart)

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
        .map(item => {
          const { buyXGetYOffer } = getCartItemOffer(item);
          const qty = quantities[item.id] || 1;

          let effectiveQty = qty;
          let paidQty = qty;

          if (buyXGetYOffer) {
            if (qty === buyXGetYOffer.buy) {
              effectiveQty = qty + buyXGetYOffer.free;
            } else {
              effectiveQty = qty;
            }
            paidQty = qty;
          }

          const unitPrice = Number(item.pricePerItem || item.price);

          return {
            id: item.id,
            productName: item.productName,
            price: unitPrice,
            quantity: effectiveQty,
            paidQty,
            total: `${item.currencySymbol}${(unitPrice * paidQty).toFixed(2)}`,
            image: item.image,
            currencySymbol: item.currencySymbol,
          };
        }),


      subtotal: `${userCart[0]?.currencySymbol || '₹'}${subtotal.toFixed(2)}`,
      shipping: `${userCart[0]?.currencySymbol || '₹'}${shipping}`,
      total: `${userCart[0]?.currencySymbol || '₹'}${grandTotal.toFixed(2)}`,
      paymentMethod: selected,

    };


    console.log("Order Data:", orderData);
  };


  const getCartItemOffer = (cartItem) => {
    const product = products.find(p => p.id === cartItem.productId);
    if (!product) return {};

    // get all offers linked to this product
    const productOffers = offers.filter(o => product.offerId && o.id === product.offerId);

    const buyXGetYOfferRaw = productOffers.find(o => o.discountType === "buyXGetY");
    console.log("buyXGetYOfferRaw ", buyXGetYOfferRaw)
    const discountOfferRaw = productOffers.find(o => o.discountType === "percentage");
    console.log("discountOfferRaw ", discountOfferRaw)

    // map to consistent format for cart display
    const buyXGetYOffer = buyXGetYOfferRaw
      ? { buy: buyXGetYOfferRaw.discountValue.buy, free: buyXGetYOfferRaw.discountValue.free }
      : null;
    console.log("buyXGetYOffer ", buyXGetYOffer)
    const discountOffer = discountOfferRaw
      ? { discountPercentage: discountOfferRaw.discountValue || 0 }
      : null;
    console.log("discountOffer", discountOffer)

    return { buyXGetYOffer, discountOffer };
  };

  // Subtotal including tax
  const subtotal = userCart
    .filter(item => selectedItems.includes(item.id))
    .reduce((sum, item) => {
      const qty = quantities[item.id] || 1;
      const price = Number(item.pricePerItem || item.price);
      const product = products.find(p => p.id === item.productId);

      // --- Apply Discount ---
      let discountedTotal = price * qty;
      const { discountOffer } = getCartItemOffer(item);
      let discountPercent = 0;
      if (discountOffer?.discountPercentage?.percent) {
        discountPercent = Number(discountOffer.discountPercentage.percent);
        discountedTotal -= (discountedTotal * discountPercent) / 100;
      }

      // --- Apply Tax on discounted amount ---
      let taxAmount = 0;
      if (product) {
        const matchedTax = countryTax.find(
          (ct) =>
            ct.countryCode === selectedCountry &&
            ct.categoryId === product.categoryId &&
            ct.type === "General"
        );
        if (matchedTax) {
          taxAmount = (discountedTotal * (matchedTax.generalTax || 0)) / 100;
        }
      }

      return sum + discountedTotal + taxAmount;
    }, 0);


  const shipping = selectedShippingOption?.price || 0;
  const grandTotal = subtotal + shipping;

  const currencySymbol = selectedItems.length > 0
    ? userCart.find(item => selectedItems.includes(item.id))?.currencySymbol || "$"
    : "$";

  return (
    <div className=" bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-between">
            Shopping Cart
            {userCart.length > 0 && (
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  className="accent-gray-700 w-5 h-5"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
                Select All
              </label>
            )}
          </h2>

          {userCart.length === 0 ? (
            <p className="text-gray-600">Your cart is empty.</p>
          ) : (
            userCart.map((cartItem) => {
              const { buyXGetYOffer, discountOffer } = getCartItemOffer(cartItem);
              const product = products.find((p) => p.id === cartItem.productId);

              const qty = quantities[cartItem.id] || 1;
              const pricePerItem = Number(cartItem.pricePerItem || cartItem.price);
              let originalTotal = pricePerItem * qty;

              // --- STEP 1: Apply Discount (Before Tax) ---
              let discountedTotal = originalTotal;
              let discountPercent = 0;

              if (discountOffer && discountOffer.discountPercentage?.percent) {
                discountPercent = Number(discountOffer.discountPercentage.percent) || 0;
                const discountAmount = (originalTotal * discountPercent) / 100;
                discountedTotal = originalTotal - discountAmount;
              }

              // --- STEP 2: Apply Tax on Discounted Amount ---
              let taxAmount = 0;
              let taxPercent = 0;

              if (product) {
                const matchedTax = countryTax.find(
                  (ct) =>
                    ct.countryCode === selectedCountry &&
                    ct.categoryId === product.categoryId &&
                    ct.type === "General"
                );

                if (matchedTax) {
                  taxPercent = matchedTax.generalTax || 0;
                  taxAmount = (discountedTotal * taxPercent) / 100;
                }
              }

              // --- STEP 3: Final Total after Discount + Tax ---
              const totalWithTax = discountedTotal + taxAmount;

              return (
                <div
                  key={cartItem.id}
                  className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-lg rounded-xl p-4 gap-4 hover:shadow-xl transition-shadow"
                >
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(cartItem.id)}
                    onChange={() => toggleSelectItem(cartItem.id)}
                    className="accent-gray-700 w-5 h-5 mt-1 md:mt-0"
                  />

                  {/* Image + Product info */}
                  <div className="flex items-start md:items-center gap-4 flex-1">
                    <img
                      src={cartItem.image}
                      alt={cartItem.productName}
                      className="w-24 h-24 object-cover rounded-lg border"
                    />
                    <div className="flex flex-col justify-between flex-1">
                      <h3 className="font-semibold text-lg text-gray-800">{cartItem.productName}</h3>
                      <p className="text-gray-500 text-sm">Variation: {cartItem.attributes.color}</p>

                      {/* Pricing */}
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {/* Original Price */}
                        {discountPercent > 0 ? (
                          <>
                            <span className="text-gray-400 line-through">
                              {cartItem.currencySymbol}
                              {originalTotal.toFixed(2)}
                            </span>
                            <span className="text-green-700 font-semibold">
                              {discountPercent}% OFF
                            </span>
                          </>
                        ) : (
                          <span className="text-gray-400">
                            {cartItem.currencySymbol}
                            {originalTotal.toFixed(2)}
                          </span>
                        )}

                        {/* Tax Info */}
                        {taxAmount > 0 && (
                          <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                            + {taxPercent}% Tax
                          </span>
                        )}

                        {/* Buy X Get Y Offer */}
                        {buyXGetYOffer && (() => {
                          if (qty === buyXGetYOffer.buy) {
                            return (
                              <p className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
                                Offer applied! (Total {qty + buyXGetYOffer.free} items)
                              </p>
                            );
                          }

                          if (qty < buyXGetYOffer.buy) {
                            return (
                              <p className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
                                Buy {buyXGetYOffer.buy - qty} more, Get {buyXGetYOffer.free} free
                              </p>
                            );
                          }

                          return null;
                        })()}
                      </div>

                      {/* Total After Discount + Tax */}
                      <p className="text-gray-900 font-bold mt-2 text-lg">
                        Total: {cartItem.currencySymbol}
                        {totalWithTax.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Quantity + Remove */}
                  <div className="flex flex-col items-start md:items-end gap-2 mt-2 md:mt-0">
                    <div className="flex items-center border rounded-lg overflow-hidden">
                      <button
                        onClick={() => handleQuantityChange(cartItem.id, qty - 1)}
                        className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="px-4 font-medium">{qty}</span>
                      <button
                        onClick={() => handleQuantityChange(cartItem.id, qty + 1)}
                        className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => openRemoveModal(cartItem)}
                      className="text-red-600 cursor-pointer hover:text-red-800 font-semibold mt-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
        {/* Right - Order Summary */}
        <div className="bg-white shadow-lg rounded-xl p-6 sticky top-6 max-h-[90vh] overflow-y-auto space-y-6">
          {/* Order Summary */}
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{currencySymbol}{subtotal.toFixed(2)}</span>
          </div>
          <div className="space-y-4">
            <span className="text-gray-700 font-semibold text-lg">Shipping</span>
            <div className="flex flex-col gap-3">
              {shippingOption.map((option) => {
                const isSelected = selectedShippingOption?.name === option.name;
                return (
                  <button
                    key={option.name}
                    onClick={() => setSelectedShippingOption(option)}
                    className={`flex items-start gap-3 p-4 rounded-lg border transition-all duration-200 text-left
            ${isSelected
                        ? "bg-gray-600 text-white border-gray-800 shadow-md"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                  >
                    {/* Radio-style Indicator */}
                    <span className={`w-4 h-4 mt-1 rounded-full border-2 flex-shrink-0
            ${isSelected ? "bg-white border-white" : "border-gray-400"}`} />

                    {/* Text Content */}
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{option.name}</span>
                        {option.price && (
                          <span className="font-medium">{currencySymbol}{option.price.toFixed(2)}</span>
                        )}
                      </div>
                      {!option.price && (
                        <p className="mt-1 text-xs text-gray-100">
                          Rs.200/- per kg will be charged. Actual Shipping Charges will be informed once your order is packed and actual Weight and Volume is measured. Shipping will be done once Shipping charges are paid.
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between font-bold text-lg border-t pt-3">
            <span>Total</span>
            <span>{currencySymbol}{grandTotal.toFixed(2)}</span>
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
      {
        shippingModalOpen && (
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

                    <div className="flex justify-center gap-3"> {/* 👈 Added this wrapper */}
                      <button
                        onClick={() => setShippingModalOpen(false)}
                        className="px-4 py-2 cursor-pointer bg-gray-200 rounded-lg hover:bg-gray-300"
                      >
                        Cancel
                      </button>

                      <Link href="/dashboard?addresses">
                        <button className="px-4 py-2 bg-gray-600 text-white rounded-lg cursor-pointer hover:bg-gray-900">
                          Add Address
                        </button>
                      </Link>
                    </div>
                  </div>

                )}
              </div>
            </div>
          </div>
        )
      }
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
