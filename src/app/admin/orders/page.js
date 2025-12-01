"use client"
import React, { useEffect } from 'react'
import DefaultPageAdmin from '@/components/Admin/Include/DefaultPageAdmin/DefaultPageAdmin'
import { fetchOrders } from '@/app/redux/slices/order/orderSlice'
import { useDispatch, useSelector } from "react-redux";

const page = () => {
    const dispatch = useDispatch();
    const { orders } = useSelector((state) => state.order);
    console.log("orders", orders)

    useEffect(() => {
        dispatch(fetchOrders())
    }, [dispatch]);

    return (
        <>
            <DefaultPageAdmin>
                <h1>User Orders</h1>
            </DefaultPageAdmin>
        </>
    )
}

export default page