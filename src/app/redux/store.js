import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import meReducer from './slices/meProfile/meSlice'
import headersReducer from './slices/addHeader/addHeaderSlice'
import getAllUserReducer from './slices/getAllUser/getAllUser'
import addCategory from './slices/addCategory/addCategorySlice'
import subcategoryReducer from './slices/subcategory/subcategorySlice';
import productsReducer from './slices/products/productSlice';
import attributesReducer from './slices/attribute/attributeSlice';
import offersReducer from './slices/offer/offerSlice'
import countryPricingReducer from './slices/countryPricing/countryPricingSlice';
import countryReducer from "./slices/countrySlice";
import cartReducer from './slices/addToCart/addToCartSlice'
import addressReducer from "./slices/address/addressSlice";
import tagsReducer from './slices/tag/tagSlice';
import marketLinksReducer from './slices/externalMarket/externalMarketSlice';
import countryTaxReducer from "./slices/countryTaxes/countryTaxesSlice";
import videoStoryReducer from "./slices/videoStory/videoStorySlice"
import contactMessageReducer from './slices/contact/contactMessageSlice';
import orderReducer from "./slices/order/orderSlice";
import shippingPricingReducer from "./slices/shippingPricing/shippingPricingSlice";
import stateReducer from "./slices/state/addStateSlice";
import warehousesReducer from './slices/warehouse/wareHouseSlice';
import transferWarehouseReducer from './slices/transferWarehouse/transferWarehouseSlice';
import dispatchWarehouseReducer from './slices/dispatchUnitsWareHouse/dispatchUnitsWareHouseSlice';
import delhiStoreReducer from './slices/delhiStore/delhiStoreSlice';
import variationReducer from './slices/variationDelete/variationDeleteSlice';
import chatReducer from './slices/chat/chatSlice';
import bannerReducer from "./slices/banners/bannersSlice";
import selectedStateReducer from './slices/selectedStateSlice';
import locationModalReducer from './slices/locationModalSlice';
import warehouseSelectionReducer from "./slices/warehouseSelectionSlice";


// import updateUserReducer from './slices/userSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        me: meReducer,
        headers: headersReducer,
        getAllUser: getAllUserReducer,
        category: addCategory,
        subcategory: subcategoryReducer,
        products: productsReducer,
        attributes: attributesReducer,
        offers: offersReducer,
        countryPricing: countryPricingReducer,
        country: countryReducer,
        cart: cartReducer,
        address: addressReducer,
        tags: tagsReducer,
        marketLinks: marketLinksReducer,
        countryTax: countryTaxReducer,
        videoStory: videoStoryReducer,
        contactMessage: contactMessageReducer,
        order: orderReducer,
        shippingPricing: shippingPricingReducer,
        states: stateReducer,
        warehouses: warehousesReducer,
        transferWarehouse: transferWarehouseReducer,
        dispatchWarehouse: dispatchWarehouseReducer,
        delhiStore: delhiStoreReducer,
        variation: variationReducer,
        chat: chatReducer,
        banner: bannerReducer,
        selectedState: selectedStateReducer,
        locationModal: locationModalReducer,
        warehouseSelection: warehouseSelectionReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
});

export default store;
