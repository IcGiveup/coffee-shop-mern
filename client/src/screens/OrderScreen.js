// FIYAZ AHMED
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Button } from "react-bootstrap";
import { jsPDF } from "jspdf";

const OrderScreen = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const safeDate = (v) => {
    if (!v) return "-";
    const d = new Date(v);
    return isNaN(d.getTime()) ? "-" : d.toLocaleString();
  };

  const getLineTotal = (item) => {
    const qty = Number(item?.quantity || 0);
    const unit = Number(item?.price || 0);
    const line = Number(item?.lineTotal || 0);
    return line > 0 ? line : unit * qty;
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user || !user._id) {
      navigate("/login");
      return;
    }

    const userId = user._id;

    const fetchSingleOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`, {
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          throw new Error((await response.json()).message || "Failed to fetch order");
        }
        const orderData = await response.json();
        setOrder(orderData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    const fetchAllOrders = async () => {
      try {
        const response = await fetch(`/api/orders/user/${userId}`, {
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          throw new Error((await response.json()).message || "Failed to fetch orders");
        }
        const ordersData = await response.json();
        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (orderId) fetchSingleOrder();
    else fetchAllOrders();
  }, [orderId, navigate]);

  const generatePDF = (orderData) => {
    if (!orderData || !orderData.items || !Array.isArray(orderData.items)) {
      alert("No valid order data available to generate receipt.");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(33, 37, 41);
    doc.text("MERN Coffee Ordering System", 105, 15, { align: "center" });

    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(108, 117, 125);
    doc.text("Receipt", 105, 25, { align: "center" });

    doc.setDrawColor(108, 117, 125);
    doc.setLineWidth(0.5);
    doc.line(20, 30, 190, 30);

    doc.setFontSize(12);
    doc.setTextColor(33, 37, 41);
    doc.setFont("helvetica", "normal");

    doc.text(`Order ID: ${orderData._id || "N/A"}`, 20, 40);
    doc.text(`Order Date: ${safeDate(orderData.createdAt)}`, 20, 48);
    doc.text(`Total Amount: BDT ${Number(orderData.totalAmount || 0)}`, 20, 56);
    doc.text(
      `Shipping Address: ${orderData?.address?.street || "N/A"}, ${orderData?.address?.city || "N/A"}, ${
        orderData?.address?.zip || "N/A"
      }`,
      20,
      64
    );
    doc.text(`Payment ID: ${orderData.paymentId || "N/A"}`, 20, 72);

    let yPosition = 90;

    // header
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(139, 69, 19);
    doc.rect(20, yPosition - 6, 170, 8, "F");
    doc.text("#", 22, yPosition);
    doc.text("Item Name", 30, yPosition);
    doc.text("Variant", 80, yPosition);
    doc.text("Qty", 115, yPosition);
    doc.text("Line Total", 140, yPosition);

    yPosition += 6;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(33, 37, 41);

    orderData.items.forEach((item, index) => {
      const qty = Number(item.quantity || 0);
      const lineTotal = getLineTotal(item);

      if (index % 2 === 0) {
        doc.setFillColor(245, 245, 245);
        doc.rect(20, yPosition - 6, 170, 8, "F");
      }

      doc.text(String(index + 1), 22, yPosition);
      doc.text(String(item.name || "N/A"), 30, yPosition);
      doc.text(String(item.variant || "N/A"), 80, yPosition);
      doc.text(String(qty), 115, yPosition);
      doc.text(`BDT ${Number(lineTotal || 0)}`, 140, yPosition);

      yPosition += 8;
    });

    yPosition += 10;
    doc.setFontSize(12);
    doc.setTextColor(108, 117, 125);
    doc.text("Thank you for your purchase!", 105, yPosition, { align: "center" });

    doc.save(`order-receipt-${orderData._id}.pdf`);
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (error) return <div className="text-center py-5 text-danger">Error: {error}</div>;

  return (
    <Container className="my-5">
      {orderId ? (
        <>
          <h1 className="mb-4 text-center" style={{ fontWeight: "bold", color: "#333" }}>
            Order Receipt
          </h1>

          {order ? (
            <Card
              className="shadow-sm"
              style={{
                borderRadius: "10px",
                border: "none",
                backgroundColor: "#800020",
                color: "#ffffff",
              }}
            >
              <Card.Body>
                <h4 className="mb-3">Thank You for Your Order!</h4>

                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Order Date:</strong> {safeDate(order.createdAt)}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Total Amount:</strong> ৳{order.totalAmount}</p>

                <p><strong>Items:</strong></p>
                <ul style={{ color: "#ffffff" }}>
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, index) => (
                      <li key={index}>
                        {item.name} ({item.variant}) x {item.quantity} — ৳{getLineTotal(item)}
                      </li>
                    ))
                  ) : (
                    <li>No items available</li>
                  )}
                </ul>

                <p>
                  <strong>Shipping Address:</strong> {order?.address?.street}, {order?.address?.city}
                </p>
                <p><strong>Payment ID:</strong> {order.paymentId}</p>

                <Button
                  variant="primary"
                  onClick={() => navigate("/")}
                  style={{
                    backgroundColor: "#28a745",
                    borderColor: "#28a745",
                    padding: "10px 20px",
                    fontWeight: "bold",
                    color: "#ffffff",
                  }}
                >
                  Continue Shopping
                </Button>
              </Card.Body>
            </Card>
          ) : (
            <div className="text-center py-5">
              <h4 className="text-muted mb-3">Order not found.</h4>
            </div>
          )}
        </>
      ) : (
        <>
          <h1 className="mb-4 text-center" style={{ fontWeight: "bold", color: "#333" }}>
            Your Orders
          </h1>

          {orders.length > 0 ? (
            orders.map((order) => (
              <Card
                key={order._id}
                className="mb-3 shadow-sm"
                style={{
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: "#800020",
                  color: "#ffffff",
                }}
              >
                <Card.Body>
                  <p><strong>Order ID:</strong> {order._id}</p>
                  <p><strong>Order Date:</strong> {safeDate(order.createdAt)}</p>
                  <p><strong>Status:</strong> {order.status}</p>
                  <p><strong>Total Amount:</strong> ৳{order.totalAmount}</p>

                  <p><strong>Items:</strong></p>
                  <ul style={{ color: "#ffffff" }}>
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, index) => (
                        <li key={index}>
                          {item.name} ({item.variant}) x {item.quantity} — ৳{getLineTotal(item)}
                        </li>
                      ))
                    ) : (
                      <li>No items available</li>
                    )}
                  </ul>

                  <p><strong>Shipping Address:</strong> {order?.address?.street}, {order?.address?.city}</p>
                  <p><strong>Payment ID:</strong> {order.paymentId}</p>

                  <Button
                    variant="primary"
                    onClick={() => generatePDF(order)}
                    style={{
                      backgroundColor: "#28a745",
                      borderColor: "#28a745",
                      padding: "8px 15px",
                      color: "#ffffff",
                    }}
                  >
                    View Receipt
                  </Button>
                </Card.Body>
              </Card>
            ))
          ) : (
            <div className="text-center py-5">
              <h4 className="text-muted mb-3">No orders found.</h4>
              <Button
                variant="primary"
                onClick={() => navigate("/")}
                style={{
                  backgroundColor: "#28a745",
                  borderColor: "#28a745",
                  padding: "10px 20px",
                  fontWeight: "bold",
                  color: "#ffffff",
                }}
              >
                Continue Shopping
              </Button>
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default OrderScreen;

