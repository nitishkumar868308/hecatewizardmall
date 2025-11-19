"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMe } from "@/app/redux/slices/meProfile/meSlice";
import { fetchCart, deleteCartItem, updateCart } from "@/app/redux/slices/addToCart/addToCartSlice";
import toast from 'react-hot-toast';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CreditCard, CreditCardFront, Wallet, DollarSign, Edit } from "lucide-react";
import { fetchProducts } from "@/app/redux/slices/products/productSlice";
import { fetchOffers } from '@/app/redux/slices/offer/offerSlice'
import {
  fetchCountryTaxes,
} from "@/app/redux/slices/countryTaxes/countryTaxesSlice";
import { HomeIcon, BuildingOffice2Icon, CubeIcon } from "@heroicons/react/24/outline";
import { createOrder } from "@/app/redux/slices/order/orderSlice";
import { load } from "@cashfreepayments/cashfree-js";
import { updateUser } from "@/app/redux/slices/updateUser/updateUserSlice";
import ReactSelect from "react-select";
import { useCountries, getStates, getCities, fetchPincodeData } from "@/lib/CustomHook/useCountries";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import {
  fetchShippingPricing,
} from "@/app/redux/slices/shippingPricing/shippingPricingSlice";

const getPhoneYup = (countryCode) =>
  Yup.string()
    .required("Phone is required")
    .test("is-valid-phone", "Enter a valid phone number", (value) => {
      if (!value) return false;
      try {
        const phoneNumber = parsePhoneNumberFromString(value, countryCode);
        return phoneNumber ? phoneNumber.isValid() : false;
      } catch {
        return false;
      }
    });

const Checkout = () => {


  const [showConfirm, setShowConfirm] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.me);
  // const [selected, setSelected] = useState(
  //   user?.country?.toLowerCase() === "india" ? "PayU" : ""
  // );
  const [selected, setSelected] = useState("");
  const country = useSelector((state) => state.country);
  const { items } = useSelector((state) => state.cart);
  const router = useRouter();
  const [quantities, setQuantities] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [shippingModalOpen, setShippingModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [expanded, setExpanded] = useState("UPI / Wallet");
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [tempShipping, setTempShipping] = useState(null);
  const { products } = useSelector((state) => state.products);
  const { offers } = useSelector((state) => state.offers);
  const { countryTax } = useSelector((state) => state.countryTax);
  const [shippingOption, setShippingOption] = useState([]);
  const [selectedShippingOption, setSelectedShippingOption] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [expandedAccordion, setExpandedAccordion] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedItemIdForRemove, setSelectedItemIdForRemove] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [userCartState, setUserCartState] = useState([]);
  const [open, setOpen] = useState(false);
  const { countries } = useCountries();
  const initialValues = {
    id: user?.id || "",
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    gender: user?.gender || "",
    address: user?.address || "",
    country: user?.country || "",
    state: user?.state || "",
    city: user?.city || "",
    pincode: user?.pincode || "",
    profileImage: null,
  };


  useEffect(() => {
    if (!selected) {  // only if user hasn't chosen anything
      if (user?.country?.toLowerCase() === "india") {
        setSelected("PayU");
      } else {
        setSelected("Cashfree");
      }
    }
  }, [user?.country]);

  const validationSchema = Yup.object().shape({
    gender: Yup.string().required("Gender is required"),
    country: Yup.string().required("Country is required"),
    state: Yup.string().required("State is required"),
    city: Yup.string().required("City is required"),
    address: Yup.string().required("Address is required"),
    phone: getPhoneYup(
      countries.find((c) => c.name === selectedCountry)?.code
    ),
  });

  const requiredFields = [
    "address",
    "city",
    "state",
    "country",
    "gender",
    "phone",
  ];
  const { shippingPricings } = useSelector((state) => state.shippingPricing);
  console.log("shippingPricings", shippingPricings)

  const isIncomplete = requiredFields.some(
    (field) => !user?.[field] || user[field].toString().trim() === ""
  );

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  useEffect(() => {
    if (!user) dispatch(fetchMe());
    if (user) {
      setSelectedCountry(user.country || "");
      setSelectedState(user.state || "");
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (selectedCountry) {
      setLoadingStates(true);
      getStates(selectedCountry)
        .then((res) => setStates(res))
        .finally(() => setLoadingStates(false));
      setCities([]);
      setSelectedState("");
    }
  }, [selectedCountry]);


  const userCart = useMemo(() => {
    return items?.filter(item => String(item.userId) === String(user?.id)) || [];
  }, [items, user?.id]);
  console.log("userCart", userCart)
  useEffect(() => {
    setUserCartState(prev => {
      // Only update if different length or different ids
      const prevIds = prev.map(i => i.id).join(',');
      const newIds = userCart.map(i => i.id).join(',');
      if (prevIds !== newIds) {
        return userCart;
      }
      return prev;
    });
  }, [userCart]);
  // const [isModalOpen, setIsModalOpen] = useState(false);

  // const handleClick = () => {
  //   setIsModalOpen(true);
  // };

  // const closeModal = () => {
  //   setIsModalOpen(false);
  // };

  useEffect(() => {
    dispatch(fetchShippingPricing());
  }, [dispatch]);

  console.log("countryTax", countryTax)
  const [lastCountry, setLastCountry] = useState(null);

  useEffect(() => {
    if (country) {
      setSelectedCountry(country); // sync with Redux
      dispatch(fetchCountryTaxes(country));
    }
  }, [country, dispatch]);


  const methods = [
    { name: "PayU", href: "/image/new-payu-logo.svg" },
    { name: "CashFree", href: "/image/cashfree_logo.svg" },
  ];


  const getTypeIcon = (addr) => {
    const type = addr?.type?.toLowerCase() || "other"; // default "other"

    switch (type) {
      case "home":
        return <HomeIcon className="w-5 h-5 text-gray-800 inline-block mr-1" />;
      case "office":
        return <BuildingOffice2Icon className="w-5 h-5 text-gray-600 inline-block mr-1" />;
      default:
        // Other -> Initial based circle
        const initials = addr?.customType
          ? addr.customType.substring(0, 2).toUpperCase()
          : "O";
        const shade = addr?.customType ? 200 + (addr.customType.charCodeAt(0) % 3) * 100 : 200;
        return (
          <div className={`w-5 h-5 rounded-full bg-gray-${shade} flex items-center justify-center text-gray-800 text-xs font-bold mr-1`}>
            {initials}
          </div>
        );
    }
  };

  useEffect(() => {
    dispatch(fetchCart());
    dispatch(fetchMe());
    dispatch(fetchProducts());
    dispatch(fetchOffers());
    // dispatch(fetchCountryTaxes())
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



  useEffect(() => {
    if (userCart.length > 0 && selectedItems.length === 0 && !selectAll) {
      setSelectedItems(userCart.map((_, i) => i));
      setSelectAll(true);
    }
  }, [userCart]);



  useEffect(() => {
    if (userCart.length > 0) {
      const updatedQuantities = userCart.reduce((acc, item) => {
        acc[item.id] = item.quantity || 1;
        return acc;
      }, {});
      setQuantities(updatedQuantities);
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

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
      setSelectAll(false);
    } else {
      const allIndexes = userCart.map((_, i) => i);   // index list
      setSelectedItems(allIndexes);
      setSelectAll(true);
    }
  };

  const toggleSelectItem = (index) => {
    let updated;

    if (selectedItems.includes(index)) {
      updated = selectedItems.filter(i => i !== index);
    } else {
      updated = [...selectedItems, index];
    }

    setSelectedItems(updated);

    // Auto update select all
    const allIndexes = userCart.map((_, i) => i);
    setSelectAll(updated.length === allIndexes.length);
  };

  const groupedCart = useMemo(() => {
    const acc = {};

    userCart.forEach(item => {
      // build key based on non-color attributes
      const key = item.productId + '-' + Object.entries(item.attributes || {})
        .filter(([k]) => k !== 'color')
        .map(([k, v]) => `${k}:${v}`).join('|');

      if (!acc[key]) {
        acc[key] = {
          productId: item.productId,
          productName: item.productName,
          variationId: item.variationId || null,
          // attributes: { ...item.attributes, color: null },
          attributes: { ...item.attributes },
          currency: item.currency,
          currencySymbol: item.currencySymbol,
          itemIds: [item.id],
          colors: [],
          productOfferApplied: Boolean(item.productOfferApplied),
          productOffer: item.productOffer ?? null,
        };
      } else {
        acc[key] = { ...acc[key], itemIds: [...acc[key].itemIds, item.id] };
      }

      const matchColor = (item.attributes?.color || "").toString();
      const existing = acc[key].colors.find(
        c => (c.color || "").toLowerCase().trim() === matchColor.toLowerCase().trim()
      );

      // normalize numeric fields to Number (avoid string math)
      const normalized = {
        color: item.attributes?.color,
        quantity: Number(item.quantity || 0),
        pricePerItem: Number(item.pricePerItem || 0),
        image: item.image,
        itemId: item.id,
        variationId: item.variationId || null,
        // these may be null/undefined — keep as null or Number
        bulkPrice: item.bulkPrice == null ? null : Number(item.bulkPrice),
        bulkMinQty: item.bulkMinQty == null ? null : Number(item.bulkMinQty),
        offerApplied: Boolean(item.offerApplied),
        totalPrice: item.totalPrice == null ? Number(item.pricePerItem || 0) * Number(item.quantity || 0) : Number(item.totalPrice),

        productOfferApplied: Boolean(item.productOfferApplied),
        productOfferDiscount: item.productOfferDiscount ?? null,
        productOfferId: item.productOfferId ?? null,
        productOffer: item.productOffer ?? null,
      };
      console.log("range offer", item.productOfferApplied, item.productOffer);

      if (existing) {
        acc[key].colors = acc[key].colors.map(c =>
          (c.color || "").toLowerCase().trim() === matchColor.toLowerCase().trim()
            ? { ...c, ...normalized }
            : c
        );
      } else {
        acc[key].colors = [...acc[key].colors, normalized];
      }
    });

    // return deep cloned plain object (safe for render)
    return JSON.parse(JSON.stringify(acc));
  }, [JSON.stringify(userCart)]);

  const findColorVariation = (fullProduct, c, item) => {
    if (!fullProduct?.variations?.length) return null;

    // ✅ Extract size properly — prioritize color-level first, then fallback
    const currentSize =
      (c.size && c.size.toLowerCase().trim()) ||
      (item.attributes?.size && item.attributes.size.toLowerCase().trim()) ||
      null;

    const currentColor =
      (c.color && c.color.toLowerCase().trim()) ||
      (item.attributes?.color && item.attributes.color.toLowerCase().trim()) ||
      null;

    if (!currentColor) return null; // must have color

    // ✅ exact color+size match from variation name
    const matched = fullProduct.variations.find((v) => {
      const name = v.variationName?.toLowerCase().trim() || "";
      const normalized = name.replace(/[\s/,-]+/g, " ").trim();

      const colorMatch = new RegExp(`\\b${currentColor}\\b`).test(normalized);
      const sizeMatch = currentSize
        ? new RegExp(`\\b${currentSize}\\b`).test(normalized)
        : true;

      return colorMatch && sizeMatch;
    });

    // ✅ Debug log to confirm
    console.log(
      `🧩 Matched for ${currentColor}/${currentSize || "no-size"} →`,
      matched?.variationName,
      matched?.bulkPrice
    );

    return matched;
  };

  const updateVariationQuantity = async (itemId, delta) => {
    const targetItem = userCartState.find((i) => i.id === itemId);
    if (!targetItem) return;

    const newQuantity = Math.max(1, targetItem.quantity + delta);

    // ✅ Find the full product data (for price, variation, bulk info)
    const fullProduct = products.find((p) => p.id === targetItem.productId);
    if (!fullProduct) return;

    // ✅ Find correct variation (color/size-based)
    const selectedVariation =
      fullProduct.variations?.find((v) => v.id === targetItem.variationId) ||
      findColorVariation(
        fullProduct,
        {
          color: targetItem.attributes?.color,
          size: targetItem.attributes?.size,
        },
        targetItem
      );

    // ✅ Compute fresh bulk status
    const newBulkStatus = computeBulkStatus({
      product: fullProduct,
      selectedVariation,
      selectedAttributes: targetItem.attributes,
      userCart: userCartState,
      quantity: newQuantity,
      cartItem: targetItem,
    });

    const isBulkEligible = newBulkStatus.eligible;

    // ✅ Update all same-group items with their own bulk rules
    await updateGroupBulkStatus(newBulkStatus, isBulkEligible, newQuantity, targetItem, fullProduct);

    // ✅ Optional UI update
    setUserCartState((prev) =>
      prev.map((i) =>
        i.id === itemId ? { ...i, quantity: newQuantity } : i
      )
    );

    console.log("🧮 Cart bulk offer sync:", {
      itemId,
      newQuantity,
      isBulkEligible,
      groupQty: newBulkStatus.totalGroupQty,
    });
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


  const shippingOptions = useMemo(() => {
    return [
      ...(user?.addresses || []),
      ...(user?.address ? [{
        id: "default_address",
        name: user.name,
        mobile: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
        isDefault: user.isDefault
      }] : []),
    ];
  }, [user?.addresses, user?.address, user?.isDefault, user?.name, user?.phone, user?.city, user?.state, user?.pincode]);


  useEffect(() => {
    if (shippingOptions.length > 0) {
      const defaultAddr = shippingOptions.find(addr => addr.isDefault);
      const fallbackAddr = shippingOptions.find(addr => addr.id === 'default_address');
      const toSelect = defaultAddr
        ? defaultAddr.id
        : fallbackAddr
          ? fallbackAddr.id
          : shippingOptions[0].id;

      setSelectedShipping(toSelect);
      setTempShipping(toSelect);
    }
  }, [shippingOptions]);

  useEffect(() => {
    let sum = 0;

    selectedItems.forEach(index => {
      const item = Object.values(groupedCart)[index];
      console.log("itemCheckout", item)
      if (!item) return;

      const fullProduct = products.find(p => p.id === item.productId);

      const baseVariation =
        fullProduct?.variations?.find(v => v.id === item.variationId) ||
        fullProduct?.selectedVariation ||
        null;

      const totalVariationQty = item.colors.reduce(
        (s, c) => s + Number(c.quantity || 0),
        0
      );

      let totalAfterOffer = 0;

      // ==== RANGE OFFER ====
      if (item.productOfferApplied && item.productOffer?.paidItems) {
        totalAfterOffer = item.productOffer.paidItems.reduce((sum, p) => {
          const color = item.colors.find(
            c =>
              c.itemId === p.id ||
              c.id === p.id ||
              c.variationId === p.variationId
          );
          if (!color) return sum;
          return sum + Number(color.pricePerItem) * Number(p.paidQty);
        }, 0);
      }

      // ==== BULK / NORMAL ====
      else {
        totalAfterOffer = item.colors.reduce((sum, c) => {
          const rawPrice = Number(c.pricePerItem);

          const matchVar = fullProduct?.variations?.find(v => v.color === c.color);

          const bulkPrice = Number(
            c.bulkPrice ??
            matchVar?.bulkPrice ??
            baseVariation?.bulkPrice ??
            fullProduct?.bulkPrice ??
            0
          );

          const minQty = Number(
            c.bulkMinQty ??
            matchVar?.minQuantity ??
            baseVariation?.minQuantity ??
            fullProduct?.minQuantity ??
            0
          );

          const isBulk = bulkPrice > 0 && totalVariationQty >= minQty;

          return sum + (isBulk ? bulkPrice : rawPrice) * Number(c.quantity);
        }, 0);
      }

      sum += totalAfterOffer;
    });

    setSubtotal(sum);
  }, [selectedItems, groupedCart]);


  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const handleClick = async () => {

    if (isIncomplete) {
      toast.error("Please Update Billing Address");
      return;
    }
    if (!selectedShippingOption) {
      toast.error("Please select a shipping option");
      return;
    }
    if (!selected) {
      toast.error("Please Generate the Ticket");
      return;
    }


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
      items: Object.values(groupedCart).map((product) => ({
        productId: product.productId,
        productName: product.productName,
        currency: product.currency,
        currencySymbol: product.currencySymbol,
        attributes: product.attributes,
        itemIds: product.itemIds,
        productOfferApplied: product.productOfferApplied,
        productOffer: product.productOffer,
        colors: product.colors.map((c) => ({
          color: c.color,
          quantity: c.quantity,
          pricePerItem: c.pricePerItem,
          totalPrice: c.totalPrice,
          variationId: c.variationId,
          image: c.image,
          offerApplied: c.offerApplied,
          productOfferApplied: c.productOfferApplied,
          productOfferDiscount: c.productOfferDiscount,
          productOfferId: c.productOfferId,
          productOffer: c.productOffer,
        })),
      })),

      subtotal: `${userCart[0]?.currencySymbol || '₹'}${subtotal.toFixed(2)}`,
      shipping: `${userCart[0]?.currencySymbol || '₹'}${shipping}`,
      total: `${userCart[0]?.currencySymbol || '₹'}${grandTotal.toFixed(2)}`,
      paymentMethod: selected,
    };
    console.log("orderData", orderData)
    try {
      const data = await dispatch(createOrder(orderData)).unwrap();

      // ⭐ PAYU PAYMENT REDIRECT
      if (data.gateway === "payu") {
        const form = document.createElement("form");
        form.action = data.payuURL;
        form.method = "POST";

        Object.keys(data.params).forEach((key) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = data.params[key];
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
        return;
      }

      // ⭐ CASHFREE PAYMENT
      if (data.gateway === "cashfree") {
        const cashfree = await load({ mode: "sandbox" });

        cashfree.checkout({
          paymentSessionId: data.sessionId,
          redirectTarget: "_modal",
          onComplete: async () => {
            const res = await fetch(
              `/api/orders/verify-status?order_id=${data.orderNumber}`
            );
            const result = await res.json();

            if (result.success) {
              window.location.href = `/payment-success?order_id=${data.orderNumber}`;
            } else {
              window.location.href = `/payment-failed?order_id=${data.orderNumber}`;
            }
          },
        });
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Payment failed");
    }
    console.log("Order Data:", orderData);
  };

  const shipping = selectedShippingOption?.price || 0;
  const grandTotal = subtotal + shipping;

  const firstSelectedItem =
    selectedItems.length > 0
      ? Object.values(groupedCart)[selectedItems[0]]
      : null;

  const currencySymbol = firstSelectedItem?.currencySymbol || "₹";
  const currency = firstSelectedItem?.currency || "INR";

  const handleDelete = async () => {
    try {
      console.log("selectedItemId:", selectedItemId);

      // 🟢 CASE 1 → Multiple delete (array of IDs)
      if (Array.isArray(selectedItemId) && selectedItemId.length > 0) {
        for (const id of selectedItemId) {
          await dispatch(deleteCartItem({ id })).unwrap();
        }
      }

      // 🟢 CASE 2 → Single delete (string)
      else if (typeof selectedItemId === "string") {
        await dispatch(deleteCartItem({ id: selectedItemId })).unwrap();
      }

      // ❌ No valid ID found
      else {
        toast.error("No items selected to delete");
        return;
      }

      // Refresh cart
      const freshCart = await dispatch(fetchCart()).unwrap();

      toast.success("Item(s) deleted successfully");

      // 🔄 Recalculate offers, bulk, range, free qty
      for (const item of freshCart) {
        const fullProduct = products.find((p) => p.id === item.productId);
        if (!fullProduct) continue;

        const selectedVariation =
          fullProduct.variations?.find((v) => v.id === item.variationId);

        const newBulkStatus = computeBulkStatus({
          product: fullProduct,
          selectedVariation,
          selectedAttributes: item.attributes,
          userCart: freshCart,
          quantity: item.quantity,
          cartItem: item,
        });

        await updateGroupBulkStatus(
          newBulkStatus,
          newBulkStatus.eligible,
          item.quantity,
          item,
          fullProduct
        );
      }

      setShowConfirm(false);
    } catch (err) {
      toast.error(err.message || "Failed to delete item(s)");
    }
  };

  const updateGroupBulkStatus = async (bulkStatus, isBulkEligible, newQty, cartItem, fullProduct) => {
    const { sameGroupItems } = bulkStatus;

    // 🧮 Total group quantity (ignoring color)
    const totalGroupQty = sameGroupItems.reduce((sum, item) => {
      const qty = item.id === cartItem.id ? newQty : item.quantity;
      return sum + qty;
    }, 0);

    console.log("🧮 Group Total:", totalGroupQty);

    // 🧠 1️⃣ Apply product offer once for the whole group
    const sampleVariation =
      fullProduct?.variations?.find((v) => v.id === cartItem.variationId) ||
      fullProduct?.variations?.find(
        (v) =>
          v.color?.toLowerCase() === cartItem.attributes?.color?.toLowerCase() &&
          v.size?.toLowerCase() === cartItem.attributes?.size?.toLowerCase()
      );

    const { offerApplied, offerMeta, offerId } = applyProductOffers(
      fullProduct,
      sampleVariation,
      newQty,
      sameGroupItems,
      cartItem.id
    );

    // 🧩 Share the same offerMeta with all sameGroupItems
    const groupOffer = offerApplied ? offerMeta : null;
    const groupOfferId = offerApplied ? offerId : null;

    await Promise.all(
      sameGroupItems.map(async (item) => {
        const itemVariation =
          fullProduct?.variations?.find((v) => v.id === item.variationId) ||
          fullProduct?.variations?.find(
            (v) =>
              v.color?.toLowerCase() === item.attributes?.color?.toLowerCase() &&
              v.size?.toLowerCase() === item.attributes?.size?.toLowerCase()
          );

        const basePrice = Number(item.pricePerItem);
        const itemBulkPrice = Number(itemVariation?.bulkPrice || 0);
        const itemBulkMinQty = Number(itemVariation?.bulkMinQty || fullProduct?.minQuantity || 0);
        const currentQty = item.id === cartItem.id ? newQty : item.quantity;

        const isItemBulkEligible =
          itemBulkPrice > 0 &&
          itemBulkMinQty > 0 &&
          bulkStatus.totalGroupQty >= itemBulkMinQty;

        let finalTotal = basePrice * currentQty;
        let offerAppliedFlag = false;
        let productOfferApplied = false;
        let productOffer = null;

        // ✅ Use the same shared group offer
        if (groupOffer && groupOffer.discountType === "rangeBuyXGetY") {
          const { start, end, free } = groupOffer.discountValue;

          if (totalGroupQty >= start && totalGroupQty <= end) {
            productOfferApplied = true;
            productOffer = offerMeta;

            // Sort group items by price (ascending)
            const sortedByPrice = [...sameGroupItems].sort((a, b) => a.pricePerItem - b.pricePerItem);
            const freeItems = sortedByPrice.slice(0, free);

            const isFree = freeItems.some((f) => f.id === item.id);
            finalTotal = isFree ? 0 : basePrice * currentQty;

            console.log("🎁 Range Offer Applied (shared):", {
              itemId: item.id,
              isFree,
              freeItems: freeItems.map((f) => f.attributes?.color),
              totalGroupQty,
            });
          }
        } else if (isItemBulkEligible) {
          offerAppliedFlag = true;
          finalTotal = itemBulkPrice * currentQty;
        }

        const payload = {
          id: item.id,
          quantity: currentQty,
          offerApplied: offerAppliedFlag,
          bulkPrice: isItemBulkEligible ? itemBulkPrice : null,
          bulkMinQty: isItemBulkEligible ? itemBulkMinQty : null,
          totalPrice: finalTotal,
          productOfferApplied,
          productOffer,
          productOfferId: productOfferApplied ? groupOfferId : null,
        };

        await dispatch(updateCart(payload));
      })
    );

    console.log("✅ Cart updated with unified shared offer logic");
    await dispatch(fetchCart());
  };

  const buildFreePaidItems = (product, freeQty, sameCoreVariation, cart) => {
    let items = cart
      .filter(it => {
        if (it.productId !== product.id) return false;
        return sameCoreVariation(it); // color ignore + core attribute match
      })
      .map(it => ({
        id: it.id,
        variationId: it.variationId,
        attributes: it.attributes,
        quantity: it.quantity,
        price: Number(it.pricePerItem || it.price),
        addedAt: it.addedAt || 0
      }));


    const freeItems = [];
    const paidItems = [];

    while (freeQty > 0 && items.length > 0) {
      let minPrice = Math.min(...items.map(i => i.price));
      let lowestItems = items.filter(i => i.price === minPrice);
      let selected = lowestItems.reduce((a, b) =>
        a.addedAt > b.addedAt ? a : b
      );

      let freeTake = Math.min(selected.quantity, freeQty);

      freeItems.push({
        ...selected,
        freeQty: freeTake
      });

      selected.quantity -= freeTake;
      freeQty -= freeTake;

      if (selected.quantity === 0) {
        items = items.filter(i => i.id !== selected.id);
      }
    }

    for (const item of items) {
      paidItems.push({
        ...item,
        paidQty: item.quantity
      });
    }

    return { freeItems, paidItems };
  };

  const applyProductOffers = (product, selectedVariation, quantity, userCart = [], cartItemId = null) => {
    let offerApplied = false;
    let offerDiscount = 0;
    let offerMeta = null;
    let offerId = null;

    const productOffers = (product.offers || []).filter(o => o.active);
    if (!productOffers.length) return { offerApplied, offerDiscount, offerId, offerMeta };

    // 🔹 Normalize attributes ignoring color/colour
    const getCoreAttrs = (attrs = {}) => {
      const core = {};
      for (const [k, v] of Object.entries(attrs)) {
        if (!["color", "colour"].includes(k.toLowerCase())) {
          core[k.toLowerCase().trim()] = String(v).toLowerCase().trim();
        }
      }
      return core;
    };

    const selectedCore = getCoreAttrs(selectedVariation?.attributes);

    const sameCoreVariation = (item) => {
      const itemCore = getCoreAttrs(item.attributes);
      return Object.entries(selectedCore).every(([k, v]) => itemCore[k] && itemCore[k] === v);
    };

    // 🔹 Compute total group quantity including updated item if cartItemId provided
    const totalGroupQty = userCart.reduce((sum, item) => {
      if (item.productId !== product.id) return sum;
      if (!sameCoreVariation(item)) return sum;

      // ✅ Replace qty for the item being updated
      if (cartItemId && item.id === cartItemId) return sum + quantity;
      return sum + item.quantity;
    }, 0);

    // 🔹 For new add-to-cart item, include quantity
    const finalGroupQty = cartItemId ? totalGroupQty : totalGroupQty + quantity;
    const price = Number(selectedVariation.pricePerItem || selectedVariation.price || 0);

    const updatedCartForFreeCalc = userCart.map(it => ({
      ...it,
      attributes: { ...(it.attributes || {}) }
    }));

    // 👉 If this is a new add-to-cart operation (not update)
    if (!cartItemId) {
      updatedCartForFreeCalc.push({
        id: "__temp__",
        productId: product.id,
        variationId: selectedVariation.id,
        attributes: selectedVariation.attributes,
        quantity,
        pricePerItem: selectedVariation.pricePerItem || selectedVariation.price,
        addedAt: Date.now()
      });
    }

    // 👉 If update case:
    if (cartItemId) {
      updatedCartForFreeCalc.forEach((it) => {
        if (it.id === cartItemId) {
          it.quantity = quantity;   // now SAFE
        }
      });
    }

    for (const offer of productOffers) {

      // 🔥 Offer Check Starts

      // 1️⃣ Percentage
      if (offer.discountType === "percentage") {
        offerApplied = true;
        offerDiscount = Number(offer.discountValue.percent);
        offerId = offer.id;

        const totalBefore = finalGroupQty * price;
        const savings = (totalBefore * offerDiscount) / 100;
        const totalAfter = totalBefore - savings;

        offerMeta = {
          id: offer.id,
          name: "Percentage",
          discountType: offer.discountType,
          discountValue: offer.discountValue,
          appliedQty: finalGroupQty,
          totalPriceBeforeOffer: totalBefore,
          totalPriceAfterOffer: totalAfter,
          totalSavings: savings,
          freeQuantityValue: 0,
          freeItems: [],
          paidItems: []
        };
        break;
      }

      // 2️⃣ Range Buy X Get Y
      if (offer.discountType === "rangeBuyXGetY") {
        const { start, end, free } = offer.discountValue;
        if (finalGroupQty >= start && finalGroupQty <= end) {
          offerApplied = true;
          offerDiscount = 0;
          offerId = offer.id;

          const { freeItems, paidItems } =
            buildFreePaidItems(product, free, sameCoreVariation, updatedCartForFreeCalc);



          const freeValue = freeItems.reduce((sum, fi) => sum + fi.freeQty * fi.price, 0);

          const totalBefore = updatedCartForFreeCalc
            .filter(it => sameCoreVariation(it))
            .reduce(
              (sum, it) => sum + it.quantity * Number(it.pricePerItem || it.price),
              0
            );

          const totalAfter = totalBefore - freeValue;

          offerMeta = {
            id: offer.id,
            name: "Range",
            discountType: offer.discountType,
            discountValue: { start, end, free },
            appliedQty: finalGroupQty,
            freeQty: free,
            freeItems,
            paidItems,
            // totalPriceBeforeOffer: finalGroupQty * price,
            // totalPriceAfterOffer: finalGroupQty * price - freeValue,
            // totalSavings: freeValue,
            // freeQuantityValue: freeValue
            totalPriceBeforeOffer: totalBefore,
            totalPriceAfterOffer: totalAfter,
            totalSavings: freeValue,
            freeQuantityValue: freeValue,
          };
          break;
        }
      }

      // 3️⃣ Buy X Get Y
      if (offer.discountType === "buyXGetY") {
        const { buy, get } = offer.discountValue;
        if (finalGroupQty >= buy) {
          offerApplied = true;
          offerDiscount = 0;
          offerId = offer.id;

          const { freeItems, paidItems } =
            buildFreePaidItems(product, free, sameCoreVariation, updatedCartForFreeCalc);


          const freeValue = freeItems.reduce((sum, fi) => sum + fi.freeQty * fi.price, 0);

          offerMeta = {
            id: offer.id,
            name: "BuyXGetY",
            discountType: offer.discountType,
            discountValue: { buy, get },
            appliedQty: finalGroupQty,
            freeQty: get,
            freeItems,
            paidItems,
            totalPriceBeforeOffer: finalGroupQty * price,
            totalPriceAfterOffer: finalGroupQty * price - freeValue,
            totalSavings: freeValue,
            freeQuantityValue: freeValue
          };
          break;
        }
      }
    }

    return { offerApplied, offerDiscount, offerId, offerMeta };
  };

  // 🧠 Compute bulk offer eligibility (shared across variations)
  const computeBulkStatus = ({
    product,
    selectedVariation,
    selectedAttributes,
    userCart,
    quantity,
    cartItem,
  }) => {
    const productMinQty = Number(product?.minQuantity || 0);
    const variationBulkPrice = Number(selectedVariation?.bulkPrice ?? 0);
    const variationBulkMinQty =
      Number(selectedVariation?.bulkMinQty ?? productMinQty) || 0;

    // 🎯 Flatten attributes except color
    const flatAttributes = {};
    Object.entries(selectedAttributes || {}).forEach(([k, v]) => {
      if (v && v !== "N/A") flatAttributes[k.toLowerCase()] = v;
    });

    const coreAttributes = Object.entries(flatAttributes).filter(
      ([key]) => !["color", "colour"].includes(key.toLowerCase())
    );
    const coreKey = coreAttributes.map(([k, v]) => `${k}:${v}`).join("|");

    // 🧩 Find same group items
    const sameGroupItems = (Array.isArray(userCart) ? userCart : []).filter((item) => {
      if (!item) return false;
      if (item.productId !== product.id) return false;
      const itemCoreKey = Object.entries(item.attributes || {})
        .filter(([k]) => !["color", "colour"].includes(k.toLowerCase()))
        .map(([k, v]) => `${k}:${v}`)
        .join("|");
      return itemCoreKey === coreKey;
    });

    // 🧮 Replace current item's qty with new one
    const totalGroupQty = sameGroupItems.reduce((sum, item) => {
      if (item.id === cartItem?.id) {
        return sum + Number(quantity || 0);
      }
      return sum + (Number(item.quantity) || 0);
    }, 0);

    // ✅ Eligibility only depends on total group qty meeting the *lowest* bulk min qty
    const allMinQtys = sameGroupItems.map((it) => {
      const varData = product.variations?.find((v) => v.id === it.variationId);
      return Number(varData?.bulkMinQty || 0);
    });
    const minRequiredQty = Math.min(...allMinQtys.filter((x) => x > 0), variationBulkMinQty);

    const eligible = totalGroupQty >= minRequiredQty;

    console.log("💡 Bulk Check:", {
      totalGroupQty,
      minRequiredQty,
      eligible,
    });

    return {
      eligible,
      totalGroupQty,
      sameGroupItems,
    };
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Upload failed");

    return Array.isArray(data.urls) ? data.urls[0] : data.urls;
  };

  // Submit
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // include all fields and defaults
      let payload = {
        id: user?.id || "",
        name: values.name || "",
        email: values.email || "",
        phone: values.phone || "",
        gender: values.gender || "",
        address: values.address || "",
        country: values.country || "",
        state: values.state || "",
        city: values.city || "",
        pincode: values.pincode || "",
        profileImage: values.profileImage || null,
      };

      // upload image if new file is selected
      if (values.profileImage instanceof File) {
        const uploadedUrl = await handleImageUpload(values.profileImage);
        payload.profileImage = uploadedUrl;
      }

      // dispatch update
      const response = await dispatch(updateUser(payload)).unwrap();
      console.log("response", response);
      toast.success(response.message || "Profile updated!");
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update");
    } finally {
      setSubmitting(false);
    }
  };

  const countryCode = selectedCountry || "IND";
  console.log("countryCode", countryCode)
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

          {Object.values(groupedCart).length === 0 ? (
            <p className="text-gray-600">Your cart is empty.</p>
          ) : (
            Object.values(groupedCart).map((item, index) => {
              console.log("checkoutitem", item)
              const fullProduct = products.find(p => p.id === item.productId);
              if (!fullProduct) return null;

              const baseVariation =
                fullProduct?.variations?.find(v => v.id === item.variationId) ||
                fullProduct?.selectedVariation ||
                null;

              const totalVariationQty = item.colors.reduce((s, c) => s + Number(c.quantity || 0), 0);
              const minCandidates = item.colors
                .map(c => Number(c.bulkMinQty ?? baseVariation?.minQuantity ?? fullProduct?.minQuantity ?? 0))
                .filter(v => v > 0);
              const minRequired = minCandidates.length ? Math.min(...minCandidates) : 0;
              const isVariationOfferActive = minRequired > 0 && totalVariationQty >= minRequired;

              const fmt = n => Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 });

              return (
                <div key={index} className="relative flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-5 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                  {/* LEFT FIXED CHECKBOX */}
                  <div className="flex items-start pt-1 sm:pt-2">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(index)}
                      onChange={() => toggleSelectItem(index)}
                      className="accent-gray-700 w-5 h-5"
                    />
                  </div>

                  {/* MAIN CONTENT */}
                  <div className="flex-1 flex flex-col">
                    {/* HEADER */}
                    <div className="flex justify-between items-start">
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => setExpandedAccordion(expandedAccordion === index ? null : index)}
                      >
                        <h3 className="font-semibold text-gray-900 text-base sm:text-lg">
                          {item.productName}
                        </h3>

                        {/* Attributes */}
                        <div className="mt-1 space-y-0.5 text-xs text-gray-500">
                          {Object.entries(item.attributes || {})
                            .filter(([k, v]) => k !== "color" && v)
                            .map(([k, v], i) => (
                              <div key={i} className="capitalize">{k}: {v}</div>
                            ))}
                        </div>

                        {/* Offer Label */}
                        {(isVariationOfferActive || item.productOfferApplied) && (
                          <div className="text-green-600 font-medium text-xs mt-1">
                            {item.productOfferApplied ? "Range Offer Applied" : "Bulk Offer Applied"}
                          </div>
                        )}
                      </div>

                      <button className="text-xl font-bold select-none text-gray-400 hover:text-gray-600">
                        {expandedAccordion === index ? "−" : "+"}
                      </button>
                    </div>

                    {/* EXPANDED SECTION */}
                    {expandedAccordion === index && (
                      <div className="mt-4 space-y-4">
                        {/* Bulk Offers */}
                        {isVariationOfferActive && (
                          <div className="bg-green-50 rounded-lg p-3 text-green-800">
                            <div className="font-medium text-sm mb-1">Active Bulk Offers:</div>
                            <ul className="list-disc list-inside text-xs sm:text-sm">
                              {item.colors.map((c, i) => {
                                const matchVar = findColorVariation(fullProduct, c, item);
                                const bulkPrice = Number(c.bulkPrice ?? matchVar?.bulkPrice ?? baseVariation?.bulkPrice ?? fullProduct?.bulkPrice ?? 0);
                                const minQty = Number(c.bulkMinQty ?? matchVar?.minQuantity ?? baseVariation?.minQuantity ?? fullProduct?.minQuantity ?? 0);
                                if (!bulkPrice || !minQty) return null;
                                return (
                                  <li key={i}>{c.color}: ₹{fmt(bulkPrice)} per item (Min {minQty})</li>
                                );
                              })}
                            </ul>
                          </div>
                        )}

                        {/* Range Offer */}
                        {item.productOfferApplied && (
                          <div className="bg-blue-50 rounded-lg p-3 text-blue-800">
                            <div className="font-medium text-sm mb-1">Active Range Offer:</div>
                            <ul className="list-disc list-inside text-xs sm:text-sm">
                              <li>Buy {item.productOffer.discountValue.start}–{item.productOffer.discountValue.end}, Get {item.productOffer.discountValue.free} Free</li>
                              <li>Free items: Lowest priced variations 🎁</li>
                            </ul>
                          </div>
                        )}

                        {/* Variations */}
                        <div className="space-y-4">
                          {item.colors.map((c, idx) => {
                            const matchVar = findColorVariation(fullProduct, c, item);
                            const colorPrice = Number(c.pricePerItem ?? 0);
                            const bulkPrice = Number(c.bulkPrice ?? matchVar?.bulkPrice ?? baseVariation?.bulkPrice ?? fullProduct?.bulkPrice ?? 0);
                            const minQty = Number(c.bulkMinQty ?? matchVar?.minQuantity ?? baseVariation?.minQuantity ?? fullProduct?.minQuantity ?? 0);
                            const isBulkActive = bulkPrice > 0 && totalVariationQty >= minQty;

                            const originalTotal = colorPrice * Number(c.quantity);
                            const discountedTotal = isBulkActive ? bulkPrice * Number(c.quantity) : originalTotal;
                            const saved = isBulkActive ? (colorPrice - bulkPrice) * Number(c.quantity) : 0;

                            const offer = item.productOffer || null;

                            return (
                              <div key={idx} className="pt-3">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                  <div className="flex items-center gap-2">
                                    {c.image && <img src={c.image} alt={c.color} className="w-8 h-8 rounded-md object-cover" />}
                                    <span className="text-sm font-medium text-gray-700">{c.color}</span>
                                  </div>

                                  {/* Quantity Controls */}
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => updateVariationQuantity(c.itemId, -1)}
                                      className="px-2 py-1 border rounded-md text-gray-600 hover:bg-gray-100"
                                    >
                                      −
                                    </button>
                                    <span className="px-2 text-sm">{c.quantity}</span>
                                    <button
                                      onClick={() => updateVariationQuantity(c.itemId, 1)}
                                      className="px-2 py-1 border rounded-md text-gray-600 hover:bg-gray-100"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>

                                {/* Price UI */}
                                <div className="pl-2 sm:pl-4 text-sm mt-2">
                                  {item.productOfferApplied && item.productOffer?.name === "Range" ? (
                                    (() => {
                                      const free = offer?.freeItems?.find(f => f.variationId === c.variationId || f.id === c.variationId || f.variationId === c.id);
                                      const paid = offer?.paidItems?.find(p => p.variationId === c.variationId || p.id === c.variationId || p.variationId === c.id);
                                      return (
                                        <div className="flex flex-col">
                                          {paid && <div className="text-gray-700 font-semibold">₹{fmt(c.pricePerItem)} × {paid.paidQty} = ₹{fmt(c.pricePerItem * paid.paidQty)}</div>}
                                          {free && <div className="text-green-700 font-semibold">🎁 {free.freeQty} FREE (Saved ₹{fmt(c.pricePerItem * free.freeQty)})</div>}
                                          {!paid && !free && <div>₹{fmt(c.pricePerItem)} × {c.quantity} = ₹{fmt(c.pricePerItem * c.quantity)}</div>}
                                        </div>
                                      );
                                    })()
                                  ) : isBulkActive ? (
                                    <>
                                      <div className="text-gray-400 line-through">₹{fmt(colorPrice)} × {c.quantity} = ₹{fmt(originalTotal)}</div>
                                      <div className="text-green-700 font-semibold">₹{fmt(bulkPrice)} × {c.quantity} = ₹{fmt(discountedTotal)} ✅</div>
                                      <div className="text-xs text-green-600">You saved ₹{fmt(saved)} 🎉</div>
                                    </>
                                  ) : (
                                    <div>₹{fmt(colorPrice)} × {c.quantity} = ₹{fmt(originalTotal)}</div>
                                  )}
                                </div>

                                {/* Remove button */}
                                <div className="flex justify-end mt-1">
                                  <button
                                    onClick={() => { setSelectedItemId(c.itemId); setShowConfirm(true); }}
                                    className="text-red-500 hover:text-red-700 text-xs"
                                  >
                                    ✕ Remove
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* FOOTER (collapsed) */}
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200 text-sm">
                      <button
                        onClick={() => { setSelectedItemId(item.itemIds); setShowConfirm(true); }}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        🗑 Remove
                      </button>

                      <div className="text-center text-gray-700 font-semibold text-sm">
                        Total Qty: {item.colors.reduce((sum, c) => sum + Number(c.quantity), 0)}
                      </div>

                      <div className="text-right text-sm font-bold text-gray-900">
                        {(() => {
                          const totalOriginal = item.colors.reduce((sum, c) => sum + Number(c.pricePerItem) * Number(c.quantity), 0);
                          const offer = item.productOfferApplied ? item.productOffer : null;
                          let totalAfterOffer = 0;

                          if (offer && offer.paidItems && offer.freeItems) {
                            totalAfterOffer = offer.paidItems.reduce((sum, p) => {
                              const color = item.colors.find(c => c.itemId === p.id || c.id === p.id || c.variationId === p.variationId);
                              if (!color) return sum;
                              return sum + Number(color.pricePerItem) * Number(p.paidQty);
                            }, 0);
                          } else {
                            totalAfterOffer = item.colors.reduce((sum, c) => {
                              const matchVar = findColorVariation(fullProduct, c, item);
                              const bulkPrice = Number(c.bulkPrice ?? matchVar?.bulkPrice ?? baseVariation?.bulkPrice ?? fullProduct?.bulkPrice ?? 0);
                              const minQty = Number(c.bulkMinQty ?? matchVar?.minQuantity ?? baseVariation?.minQuantity ?? fullProduct?.minQuantity ?? 0);
                              const isBulk = bulkPrice > 0 && totalVariationQty >= minQty;
                              const effective = isBulk ? bulkPrice : c.pricePerItem;
                              return sum + effective * c.quantity;
                            }, 0);
                          }

                          const isDiscounted = totalAfterOffer < totalOriginal;
                          const savings = totalOriginal - totalAfterOffer;

                          return (
                            <div className="flex flex-col items-end">
                              <div>
                                Total: {isDiscounted ? (
                                  <>
                                    <span className="line-through text-gray-400 mr-1">₹{fmt(totalOriginal)}</span>
                                    <span className="text-green-700">₹{fmt(totalAfterOffer)} ✅</span>
                                  </>
                                ) : (
                                  <span>₹{fmt(totalOriginal)}</span>
                                )}
                              </div>
                              {isDiscounted && <div className="text-xs text-green-600 font-semibold mt-1">Total Savings: ₹{fmt(savings)}</div>}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>

              );

            })
          )}
        </div>

        {/* Right - Order Summary */}
        <div className="bg-white shadow-lg rounded-xl p-6 sticky top-6 max-h-[90vh] overflow-y-auto space-y-6">
          {/* Order Summary */}

          {/* Shipping Address Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-md font-semibold text-gray-700">Shipping Address</h4>
              <button
                className="px-3 py-1 bg-gray-700 text-white rounded-lg hover:bg-gray-900 text-sm cursor-pointer"
                onClick={() => {
                  setTempShipping(selectedShipping); // modal me pre-select
                  setShippingModalOpen(true);
                }}
              >
                Change
              </button>
            </div>
            <div className="text-gray-600">
              <div className="flex justify-between items-center font-semibold text-gray-800">
                <span>{selectedAddress?.name || user?.name}</span>
                <span>{selectedAddress?.mobile || user?.phone}</span>
              </div>
              <div className="mt-1 text-gray-700 text-sm">
                {selectedShipping === "default_address"
                  ? user?.address || "No address available"
                  : [selectedAddress?.address, selectedAddress?.city, selectedAddress?.state, selectedAddress?.country, selectedAddress?.pincode]
                    .filter(Boolean)
                    .join(", ") || "No address available"
                }

              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-semibold text-gray-700 mb-1">
                Billing Address
              </h4>

              {isIncomplete && (
                <button
                  className="px-3 py-1 bg-gray-700 text-white rounded-lg hover:bg-gray-900 text-sm cursor-pointer"
                  onClick={() => setOpen(true)}

                >
                  Update
                </button>
              )}
            </div>

            <div className="text-gray-600 text-sm">
              <div className="font-semibold">{user?.name}</div>
              <div>{user?.phone || "No phone"}</div>
              <div className="truncate">
                {user?.address || "No billing address"}
              </div>
            </div>
          </div>


          <div className="flex justify-between font-bold text-lg">
            <span>Subtotal</span>
            <span>{currency} {currencySymbol}{subtotal.toFixed(2)}
            </span>
          </div>

          {!isIncomplete && (
            <div className="space-y-4">
              <span className="flex justify-between font-bold text-lg">Shipping</span>

              <div className="flex flex-col gap-3">
                {shippingPricings
                  .filter((option) =>
                    option.country.toLowerCase() === (user?.country || "IND").toLowerCase()
                  )
                  .map((option) => {
                    const isSelected = selectedShippingOption?.id === option.id;

                    return (
                      <button
                        key={option.id}
                        onClick={() => setSelectedShippingOption(option)}
                        className={`flex items-start gap-3 p-4 rounded-lg border transition-all duration-200 text-left
                ${isSelected
                            ? "bg-gray-400 text-black border-gray-800 shadow-md"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                          }`}
                      >
                        <span
                          className={`w-4 h-4 mt-1 rounded-full border-2 flex-shrink-0 ${isSelected ? "bg-white border-white" : "border-gray-400"
                            }`}
                        />

                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">{option.type}</span>

                            {option.price ? (
                              <span className="font-medium">
                                {option.currencySymbol}
                                {option.price.toFixed(2)}
                              </span>
                            ) : (
                              <span className="font-medium">Price not available</span>
                            )}
                          </div>

                          {option.description && (
                            <p className="mt-1 text-xs text-gray-800">
                              {option.description}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          )}





          <div className="flex justify-between font-bold text-lg border-t pt-3">
            <span>Total</span>
            <span>{currency} {currencySymbol}{grandTotal.toFixed(2)}</span>
          </div>

          {/* Payment Method */}
          {user?.country?.toLowerCase() === "india" && (
            <div className="bg-gray-50 p-6 rounded-lg shadow-md space-y-4 max-w-md mx-auto">
              <h4 className="text-lg font-semibold text-gray-700">Payment</h4>

              <div className="flex gap-4 justify-between">
                {methods.map((method) => {
                  const isSelected = selected === method.name;
                  return (
                    <div key={method.name} className="relative flex-1 min-w-0">
                      <button
                        onClick={() => setSelected(method.name)}
                        className={`
                flex flex-col items-center justify-center w-full h-28 sm:h-32 rounded-xl border transition-all duration-300
                cursor-pointer p-2
                ${isSelected
                            ? "bg-gray-800 text-white border-gray-700 shadow-lg scale-105"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                          }
              `}
                      >
                        <img
                          src={method.href}
                          alt={method.name}
                          className="w-16 h-16 object-contain mb-2 sm:w-20 sm:h-20"
                        />
                        <span className="text-sm font-medium">{method.name}</span>
                      </button>

                      {isSelected && (
                        <span className="absolute top-1 right-1 text-green-500 font-bold text-lg">✔</span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="text-gray-600 text-sm">
                Selected Payment: <span className="font-semibold">{selected}</span>
              </div>
            </div>
          )}



          <div className="flex justify-center items-center">
            <button onClick={handleClick} className="cursor-pointer bg-gradient-to-r from-gray-800 to-gray-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300">
              Place order
            </button>
          </div>


        </div>

      </div >

      {/* Remove / Change Address Modal */}
      {
        shippingModalOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 sm:px-6">
            <div className="bg-white w-full max-w-lg sm:max-w-md rounded-2xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden">

              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Select Shipping Address
                </h3>
                <Link href="/dashboard?addresses">
                  <button className="px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-lg text-sm sm:text-base hover:scale-105 transition-transform">
                    Add New Address
                  </button>
                </Link>
              </div>

              {/* Addresses List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {shippingOptions?.length > 0 ? (
                  shippingOptions.map((addr) => (
                    <label
                      key={addr.id}
                      className={`block p-4 border rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${tempShipping === addr.id
                        ? "border-gray-500 bg-gray-100 shadow"
                        : "border-gray-200 hover:border-gray-300"
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Radio button */}
                        <input
                          type="radio"
                          name="shippingAddress"
                          value={addr.id}
                          checked={tempShipping === addr.id}
                          onChange={() => setTempShipping(addr.id)}
                          className="mt-1 scale-110 accent-gray-700"
                        />



                        <div className="flex-1 flex flex-col">
                          {/* Type + Default + Edit */}
                          <div className="flex items-center justify-between gap-2 font-semibold text-gray-800 mb-1 text-sm sm:text-base">
                            {/* Left: Type + Icon */}
                            <div className="flex items-center gap-1">
                              {/* {getTypeIcon(addr)}
                            {addr.type === "Other" ? `${addr.type} (${addr.customType || ""})` : addr.type} */}
                            </div>

                            {/* Right: Default + Edit */}
                            <div className="flex items-center gap-2">
                              {addr.isDefault && (
                                <div className="flex items-center gap-1">
                                  <input type="checkbox" checked readOnly className="w-4 h-4 accent-green-600 cursor-default" />
                                  <span className="text-green-600 text-sm font-semibold">Default</span>
                                </div>
                              )}

                              {/* Edit icon */}
                              {addr.id !== "default_address" && (
                                <Link href={`/dashboard?addresses=true&editId=${addr.id}`}>
                                  <button className="text-gray-500 hover:text-gray-800 transition p-1 rounded-full">
                                    <Edit className="h-4 w-4 cursor-pointer text-gray-500" />
                                  </button>
                                </Link>
                              )}

                            </div>
                          </div>


                          {/* Name & mobile */}
                          <div className="flex justify-between items-center">
                            <div className="font-semibold text-gray-600">{addr.name}</div>
                            <div className="text-gray-600 text-right text-sm">{addr.mobile}</div>

                          </div>

                          {/* Full address */}
                          <div className="text-gray-600 text-sm mt-1 sm:mt-2 whitespace-pre-line">
                            {addr.address}, {addr.city}, {addr.state}, {addr.country} - {addr.pincode}
                          </div>
                        </div>
                      </div>
                    </label>
                  ))


                ) : (
                  <div className="text-center p-6">
                    <p className="text-gray-600 mb-4">No shipping address found.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-3">
                      <button
                        onClick={() => setShippingModalOpen(false)}
                        className="px-5 py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300 transition"
                      >
                        Cancel
                      </button>
                      <Link href="/dashboard?addresses">
                        <button className="px-5 py-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-lg hover:scale-105 transition-transform">
                          Add Address
                        </button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Sticky Buttons */}
              <div className="flex justify-end gap-3 p-4 border-t bg-white">
                <button
                  onClick={() => setShippingModalOpen(false)}
                  className="px-5 py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setSelectedShipping(tempShipping);
                    setShippingModalOpen(false);
                  }}
                  className="px-5 py-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-lg hover:scale-105 transition-transform"
                >
                  Confirm
                </button>
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

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl p-8 animate-fadeIn relative">

            {/* CLOSE BUTTON */}
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>

            {/* IMAGE SECTION */}
            <div className="flex flex-col items-center mb-6 space-y-2">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ values, setFieldValue, isSubmitting }) => (
                  <Form className="w-full">
                    <div className="flex flex-col items-center mb-6 space-y-2">
                      <label className="cursor-pointer group flex flex-col items-center">

                        {/* Avatar */}
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 shadow-md flex items-center justify-center bg-gray-100">
                          {values.profileImage || user?.profileImage ? (
                            <img
                              src={
                                values.profileImage
                                  ? URL.createObjectURL(values.profileImage)
                                  : user?.profileImage
                              }
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-4xl font-bold text-gray-600">
                              {user?.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase() || "U"}
                            </span>
                          )}
                        </div>

                        <span className="mt-2 text-sm bg-gray-200 px-3 py-1 rounded-lg group-hover:bg-gray-300 transition cursor-pointer">
                          Change Photo
                        </span>

                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            setFieldValue("profileImage", e.target.files?.[0] || null)
                          }
                        />
                      </label>
                    </div>

                    {/* TITLE */}
                    <h2 className="text-2xl font-bold mb-6 text-center">Update Profile</h2>

                    {/* FORM GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto pr-1">

                      {/* NAME */}
                      <div className="col-span-1">
                        <label className="text-sm font-medium">Name</label>
                        <input
                          type="text"
                          disabled
                          value={user?.name}
                          className="w-full border rounded-lg p-3 mt-1 bg-gray-200 text-gray-600 cursor-not-allowed"
                        />
                      </div>

                      {/* EMAIL */}
                      <div className="col-span-1">
                        <label className="text-sm font-medium">Email</label>
                        <input
                          type="email"
                          disabled
                          value={user?.email}
                          className="w-full border rounded-lg p-3 mt-1 bg-gray-200 text-gray-600 cursor-not-allowed"
                        />
                      </div>

                      {/* GENDER */}
                      <div className="col-span-1">
                        <label className="text-sm font-medium">Gender</label>
                        <Field
                          as="select"
                          name="gender"
                          className="w-full border rounded-lg p-3 mt-1 bg-gray-50 focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Gender</option>
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                          <option value="OTHER">Other</option>
                        </Field>
                        <ErrorMessage
                          name="gender"
                          component="p"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      {/* COUNTRY */}
                      <div className="col-span-1">
                        <label className="mb-2 font-medium text-gray-700">Country</label>
                        <ReactSelect
                          options={countries.map((c) => ({
                            value: c.name,
                            label: `${c.name} (${c.phoneCode})`,
                          }))}
                          value={
                            selectedCountry
                              ? { value: selectedCountry, label: selectedCountry }
                              : null
                          }
                          onChange={(option) => {
                            const countryName = option?.value || "";
                            setSelectedCountry(countryName);
                            setFieldValue("country", countryName);
                            setFieldValue("state", "");
                            setFieldValue("city", "");
                            setFieldValue("pincode", "");
                            setCities([]);

                            const phoneCode = countries.find(c => c.name === countryName)?.phoneCode;
                            if (phoneCode && !values.phone.startsWith(phoneCode)) {
                              setFieldValue("phone", phoneCode + " ");
                            }
                          }}
                          isClearable
                          placeholder="Select Country..."
                        />
                        <ErrorMessage
                          name="country"
                          component="p"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      {/* PINCODE */}
                      <div className="col-span-1">
                        <label className="mb-2 font-medium text-gray-700">Pincode</label>
                        <Field name="pincode">
                          {({ field }) => (
                            <input
                              type="text"
                              {...field}
                              placeholder="Enter Pincode"
                              className="w-full border rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-blue-500"
                              onChange={async (e) => {
                                const value = e.target.value;
                                setFieldValue("pincode", value);

                                if (selectedCountry === "India" && value.length === 6) {
                                  await fetchPincodeData(value, (fieldName, val) =>
                                    setFieldValue(fieldName, val)
                                  );
                                }
                              }}
                            />
                          )}
                        </Field>
                      </div>

                      {/* STATE */}
                      <div className="col-span-1">
                        <label className="mb-2 font-medium text-gray-700">State</label>
                        <ReactSelect
                          options={states.map(s => ({ value: s, label: s }))}
                          value={values.state ? { value: values.state, label: values.state } : null}
                          onChange={(option) => {
                            const stateVal = option?.value || "";
                            setSelectedState(stateVal);
                            setFieldValue("state", stateVal);
                            setFieldValue("city", "");

                            if (option?.value && selectedCountry) {
                              setLoadingCities(true);
                              getCities(selectedCountry, option.value).then(res => {
                                setCities(res);
                                setLoadingCities(false);
                              });
                            }
                          }}
                          isClearable
                          isLoading={loadingStates}
                          placeholder="Select State..."
                        />
                        <ErrorMessage
                          name="state"
                          component="p"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      {/* CITY */}
                      <div className="col-span-1">
                        <label className="mb-2 font-medium text-gray-700">City</label>
                        <ReactSelect
                          options={cities.map(c => ({ value: c, label: c }))}
                          value={values.city ? { value: values.city, label: values.city } : null}
                          onChange={(option) => setFieldValue("city", option?.value || "")}
                          isClearable
                          isLoading={loadingCities}
                          placeholder="Select City..."
                        />
                        <ErrorMessage
                          name="city"
                          component="p"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      {/* PHONE */}
                      <div className="col-span-1">
                        <label className="mb-2 font-medium text-gray-700">Phone Number</label>
                        <Field name="phone">
                          {({ field, form }) => {
                            const phoneCode = countries.find(c => c.name === values.country)?.phoneCode || "+";
                            const numberPart = field.value?.replace(/^\+\d+\s*/, "") || "";
                            return (
                              <input
                                type="tel"
                                value={`${phoneCode} ${numberPart}`}
                                placeholder={`${phoneCode} 98765 43210`}
                                className="w-full border rounded-lg h-10 px-3 bg-gray-50 focus:ring-2 focus:ring-blue-400"
                                onChange={e => {
                                  const newNumber = e.target.value.replace(/^\+\d+\s*/, "");
                                  form.setFieldValue("phone", `${phoneCode} ${newNumber}`);
                                }}
                                onPaste={e => {
                                  const pasteData = e.clipboardData.getData("text");
                                  const newNumber = pasteData.replace(/^\+\d+\s*/, "");
                                  form.setFieldValue("phone", `${phoneCode} ${newNumber}`);
                                  e.preventDefault();
                                }}
                                onKeyDown={e => {
                                  if (
                                    e.target.selectionStart <= phoneCode.length &&
                                    ["Backspace", "Delete"].includes(e.key)
                                  ) e.preventDefault();
                                }}
                              />
                            );
                          }}
                        </Field>
                        <ErrorMessage
                          name="phone"
                          component="p"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      {/* ADDRESS */}
                      <div className="col-span-1 sm:col-span-2">
                        <label className="text-sm font-medium">Address</label>
                        <Field
                          name="address"
                          placeholder="Enter Address"
                          className="w-full border rounded-lg p-3 mt-1 bg-gray-50 focus:ring-2 focus:ring-blue-500"
                        />
                        <ErrorMessage
                          name="address"
                          component="p"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    </div>

                    {/* BUTTONS */}
                    <div className="flex justify-end gap-4 mt-8">
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="px-5 py-2.5 rounded-lg bg-gray-200 hover:bg-gray-300 cursor-pointer font-medium"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-5 py-2.5 rounded-lg bg-gray-700 text-white hover:bg-black cursor-pointer font-medium"
                      >
                        Save Changes
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      )}
      {
        showConfirm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                Remove from Cart?
              </h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to remove this item from your cart?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* <PaymentModal isOpen={isModalOpen} onClose={closeModal} /> */}
    </div >
  );
};

export default Checkout;
