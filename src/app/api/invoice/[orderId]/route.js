import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function InvoicePage({ params }) {
    const order = await prisma.orders.findUnique({
        where: { orderNumber: params.orderId },
        include: { items: true }, // get items
    });

    if (!order) return <p>Order not found</p>;

    return (
        <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
            <img src="/image/logo.png" alt="Logo" style={{ width: "150px" }} />
            <h1>Invoice: {order.orderNumber}</h1>
            <p>Name: {order.shippingName}</p>
            <p>Total: {order.totalAmount}</p>
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {order.items.map((item) => (
                        <tr key={item.id}>
                            <td>{item.productName}</td>
                            <td>{item.quantity}</td>
                            <td>₹{item.totalPrice}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
