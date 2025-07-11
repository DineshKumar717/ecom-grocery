import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const { currency, user } = useAppContext();

  useEffect(() => {
  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/user/orders");
      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Orders Fetch Error:", error.response?.data || error.message);
      toast.error("Something went wrong while fetching orders.");
    }
  };

  fetchOrders();
}, []);



  return (
    <div className="mt-16 pb-16 px-4">
      <div className="flex flex-col items-start mb-8">
        <p className="text-2xl font-medium uppercase">My Orders</p>
        <div className="w-16 h-0.5 bg-primary rounded-full"></div>
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-center">No orders found.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl mx-auto"
          >
            <div className="flex justify-between flex-wrap text-gray-600 mb-4">
              <span><strong>OrderId:</strong> {order._id}</span>
              <span><strong>Payment:</strong> {order.paymentType}</span>
              <span><strong>Total:</strong> {currency}{order.amount}</span>
            </div>

            <div className="text-sm text-gray-500 mb-2">
              <p><strong>Address:</strong> {order.address?.fullName}, {order.address?.city}, {order.address?.state}</p>
            </div>

            {order.items.map(({ product, quantity }, i) => (
              <div
                key={product._id}
                className={`flex items-center justify-between py-4 ${
                  i !== order.items.length - 1 ? "border-b border-gray-200" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={product.image?.[0]}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-500">Category: {product.category}</p>
                    <p className="text-sm">Qty: {quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    Status: {order.status}
                  </p>
                  <p className="font-semibold text-primary">
                    {currency}{product.offerPrice * quantity}
                  </p>
                </div>
              </div>
            ))}

            <p className="text-right text-sm text-gray-500 mt-3">
              Ordered on: {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrders;
