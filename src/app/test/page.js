"use client";
import React, { useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableRow from "@/components/SortableRow";

// Dummy static data
const staticProducts = [
    { id: "1", name: "Product 1", categoryId: "c1", subcategoryId: "sc1", price: 100, stock: 50, active: true },
    { id: "2", name: "Product 2", categoryId: "c2", subcategoryId: "sc2", price: 200, stock: 20, active: false },
    { id: "3", name: "Product 3", categoryId: "c1", subcategoryId: "sc1", price: 150, stock: 30, active: true },
];

const staticCategories = [
    { id: "c1", name: "Category 1" },
    { id: "c2", name: "Category 2" },
];

const staticSubcategories = [
    { id: "sc1", name: "Subcategory 1" },
    { id: "sc2", name: "Subcategory 2" },
];

const Page = () => {
    const [products, setProducts] = useState([...staticProducts]);

    const toggleActive = (id, current) => {
        const updated = products.map(p => p.id === id ? { ...p, active: !current } : p);
        setProducts(updated);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = products.findIndex(p => p.id === active.id);
        const newIndex = products.findIndex(p => p.id === over.id);

        const updated = [...products];
        const [moved] = updated.splice(oldIndex, 1);
        updated.splice(newIndex, 0, moved);
        setProducts(updated);

        console.log("New Order:", updated.map(p => p.name));
    };

    // Dummy modal handlers
    const openModal = (product) => alert("Open View Modal: " + product.name);
    const setEditProductData = (data) => console.log("Edit:", data);
    const setNewImage = () => { };
    const setEditModalOpen = (val) => { };
    const setDeleteProductId = (id) => console.log("Delete ID:", id);
    const setDeleteModalOpen = (val) => { };

    return (
        <div className="overflow-x-auto p-4">
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={products.map(p => p.id)} strategy={verticalListSortingStrategy}>
                    <table className="min-w-full divide-y divide-gray-200 bg-white shadow-lg rounded-lg">
                        <thead className="bg-gray-50">
                            <tr>
                                <th>S.No</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Subcategory</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p, idx) => (
                                <SortableRow
                                    key={p.id}
                                    product={p}
                                    index={idx}
                                    categories={staticCategories}
                                    subcategories={staticSubcategories}
                                    toggleActive={toggleActive}
                                    openModal={openModal}
                                    setEditProductData={setEditProductData}
                                    setNewImage={setNewImage}
                                    setEditModalOpen={setEditModalOpen}
                                    setDeleteProductId={setDeleteProductId}
                                    setDeleteModalOpen={setDeleteModalOpen}
                                />
                            ))}
                        </tbody>
                    </table>
                </SortableContext>
            </DndContext>
        </div>
    );
};

export default Page;
