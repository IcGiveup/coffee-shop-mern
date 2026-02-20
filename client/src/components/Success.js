import React, { useEffect, useCallback } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { useDispatch } from "react-redux";
import { clearCart } from "../actions/cartActions";

function Success() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toNum = (v, def = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : def;
  };

  // ✅ Wrapped in useCallback to prevent dependency warning
  const getDiscountedUnitPrice = useCallback((item) => {
    const variants = Array.isArray(item?.variants) ? item.variants : [];
    const prices = Array.isArray(item?.prices) ? item.prices : [];

    const vIdx = variants.indexOf(item?.variant);
    const base = vIdx >= 0 ? toNum(prices[vIdx], 0) : 0;

    const offer = toNum(item?.offer, 0);
    const discounted =
      offer > 0 ? base - (base * offer) / 100 : base;

    return Math.round(discounted * 100) / 100;
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sessionId = params.get("session_id");

    const totalAmountQ = params.get("totalAmount");
    const addressQ = params.get("address");

    const totalAmountLS = localStorage.getItem("checkout_totalAmount");
    const addressLS = localStorage.getItem("checkout_address");
    const cartLS = localStorage.getItem("checkout_cartItems");

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

    const branchId =
      localStorage.getItem("selectedBranchId") ||
      localStorage.getItem("selectedBranch") ||
      localStorage.getItem("branchId") ||
      "";

    let address = null;
    try {
      if (addressQ)
        address = JSON.parse(decodeURIComponent(addressQ));
      else if (addressLS)
        address = JSON.parse(addressLS);
    } catch (e) {
      console.error("Address parse error:", e);
    }

    const totalAmount = toNum(
      totalAmountQ || totalAmountLS || 0
    );

    let cartItems = [];
    try {
      cartItems = JSON.parse(cartLS || "[]");
    } catch (e) {
      cartItems = [];
    }

    if (!address || !address.street || !address.city) {
      alert("Address missing. Please try again.");
      return;
    }

    if (!cartItems.length) {
      alert("Cart snapshot missing. Please try again.");
      return;
    }

    const orderItems = cartItems.map((item) => {
      const quantity = toNum(item.quantity || 1, 1);
      const offer = toNum(item.offer || 0, 0);
      const unitPrice = getDiscountedUnitPrice(item);
      const lineTotal =
        Math.round(unitPrice * quantity * 100) / 100;

      return {
        name: String(item.name || "").trim(),
        variant: String(item.variant || "").trim(),
        quantity,
        price: unitPrice,
        lineTotal,
        offer,
      };
    });

    const orderPayload = {
      userId: user._id,
      items: orderItems,
      address,
      totalAmount,
      paymentId: sessionId,
      ...(branchId ? { branchId } : {}),
    };

    axios
      .post("/api/orders", orderPayload)
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
        console.error(
          "Order save error:",
          err?.response?.data || err.message
        );
        alert(
          err?.response?.data?.message ||
            "Failed to save order"
        );
      });
  }, [location, navigate, dispatch, getDiscountedUnitPrice]);

  const generatePDF = (e) => {
    e.preventDefault();

    const order = JSON.parse(
      localStorage.getItem("lastOrder") || "{}"
    );

    if (!order?._id || !Array.isArray(order.items)) {
      alert("No valid order found to generate receipt.");
      return;
    }

    const {
      _id,
      items,
      totalAmount,
      address,
      createdAt,
      paymentId,
    } = order;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(
      "MERN Coffee Ordering System",
      105,
      15,
      { align: "center" }
    );

    doc.setFontSize(12);
    doc.text("Receipt", 105, 23, {
      align: "center",
    });

    doc.setFontSize(11);
    doc.text(`Order ID: ${_id}`, 20, 35);
    doc.text(
      `Order Date: ${
        createdAt
          ? new Date(createdAt).toLocaleString()
          : "-"
      }`,
      20,
      43
    );

    doc.text(
      `Total Amount: BDT ${toNum(totalAmount, 0)}`,
      20,
      51
    );

    doc.text(
      `Shipping Address: ${
        address?.street || "-"
      }, ${address?.city || "-"}${
        address?.zip ? `, ${address.zip}` : ""
      }`,
      20,
      59
    );

    doc.text(
      `Payment ID: ${paymentId || "-"}`,
      20,
      67
    );

    let y = 80;

    doc.setFontSize(12);
    doc.text("Items:", 20, y);
    y += 8;

    doc.setFontSize(10);

    items.forEach((it, idx) => {
      const qty = toNum(it.quantity, 0);
      const unit = toNum(it.price, 0);
      const line = toNum(it.lineTotal, unit * qty);

      doc.text(
        `${idx + 1}. ${String(
          it.name || "-"
        )} (${String(
          it.variant || "-"
        )}) x${qty}  |  Unit: ${unit}  |  Total: ${line}`,
        20,
        y
      );

      y += 7;

      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save(`receipt-${_id}.pdf`);
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
