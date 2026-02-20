import React, { useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { useDispatch } from "react-redux";
import { clearCart } from "../actions/cartActions";

function Success() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const toNum = (v, def = 0) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : def;
    };

    const getDiscountedUnitPrice = (item) => {
      const variants = Array.isArray(item?.variants) ? item.variants : [];
      const prices = Array.isArray(item?.prices) ? item.prices : [];

      const vIdx = variants.indexOf(item?.variant);
      const base = vIdx >= 0 ? toNum(prices[vIdx], 0) : 0;

      const offer = toNum(item?.offer, 0);
      const discounted =
        offer > 0 ? base - (base * offer) / 100 : base;

      return Math.round(discounted * 100) / 100;
    };

    const params = new URLSearchParams(location.search);
    const sessionId = params.get("session_id");

    if (!sessionId) return;

    const alreadySaved = sessionStorage.getItem(
      `order_saved_${sessionId}`
    );
    if (alreadySaved) return;

    const user = JSON.parse(
      localStorage.getItem("currentUser") || "{}"
    );

    if (!user?._id) {
      alert("Please login again.");
      navigate("/login");
      return;
    }

    const cartLS = localStorage.getItem("checkout_cartItems");
    const addressLS = localStorage.getItem("checkout_address");
    const totalAmountLS = localStorage.getItem("checkout_totalAmount");

    let cartItems = [];
    try {
      cartItems = JSON.parse(cartLS || "[]");
    } catch {
      cartItems = [];
    }

    let address = null;
    try {
      address = JSON.parse(addressLS || "{}");
    } catch {}

    const totalAmount = toNum(totalAmountLS || 0);

    if (!address?.street || !address?.city) return;
    if (!cartItems.length) return;

    const orderItems = cartItems.map((item) => {
      const quantity = toNum(item.quantity || 1, 1);
      const unitPrice = getDiscountedUnitPrice(item);
      const lineTotal =
        Math.round(unitPrice * quantity * 100) / 100;

      return {
        name: String(item.name || "").trim(),
        variant: String(item.variant || "").trim(),
        quantity,
        price: unitPrice,
        lineTotal,
        offer: toNum(item.offer || 0),
      };
    });

    axios
      .post("/api/orders", {
        userId: user._id,
        items: orderItems,
        address,
        totalAmount,
        paymentId: sessionId,
      })
      .then((res) => {
        sessionStorage.setItem(
          `order_saved_${sessionId}`,
          "1"
        );

        localStorage.setItem(
          "lastOrder",
          JSON.stringify(res.data)
        );

        dispatch(clearCart());
        localStorage.removeItem("cartItems");
        localStorage.removeItem("checkout_cartItems");
        localStorage.removeItem("checkout_address");
        localStorage.removeItem("checkout_totalAmount");
      })
      .catch((err) => {
        console.error(err);
      });
  }, [location, navigate, dispatch]);

  const generatePDF = (e) => {
    e.preventDefault();

    const order = JSON.parse(
      localStorage.getItem("lastOrder") || "{}"
    );
    if (!order?._id) return;

    const doc = new jsPDF();
    doc.text("Order Receipt", 20, 20);
    doc.text(`Order ID: ${order._id}`, 20, 30);
    doc.text(`Total: BDT ${order.totalAmount}`, 20, 40);
    doc.save(`receipt-${order._id}.pdf`);
  };

  return (
    <div className="container mt-5">
      <h2>Order Successful</h2>
      <p>Your coffee order has been placed successfully!</p>

      <button
        className="btn btn-success"
        onClick={() => navigate("/orders")}
      >
        Go to Orders
      </button>

      <button
        className="btn btn-primary ms-2"
        onClick={generatePDF}
      >
        View Receipt (PDF)
      </button>
    </div>
  );
}

export default Success;