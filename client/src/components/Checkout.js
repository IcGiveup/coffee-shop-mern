import React from "react";
import { Button } from "react-bootstrap";
import API from "../api";

export default function Checkout({
  cartItems,
  address,
  totalAmount,
  isAddressValid,
}) {

  const handleCheckout = async () => {
    try {
      if (!isAddressValid) {
        alert("⚠️ Please fill shipping address (street + city).");
        return;
      }

      if (!cartItems || cartItems.length === 0) {
        alert("⚠️ Cart is empty.");
        return;
      }

      const branchId = localStorage.getItem("selectedBranchId") || "";

      localStorage.setItem("checkout_cartItems", JSON.stringify(cartItems));
      localStorage.setItem("checkout_address", JSON.stringify(address));
      localStorage.setItem("checkout_totalAmount", String(totalAmount));
      localStorage.setItem("checkout_branchId", branchId);

      const response = await API.post("/api/create-checkout-session", {
        items: cartItems,
        address,
        totalAmount,
        branchId,
      });

      const data = response.data;

      if (data?.url) {
        window.location.href = data.url;
      } else {
        console.log("Checkout response:", data);
        alert("❌ Checkout failed: No Stripe URL returned.");
      }

    } catch (err) {
      console.error("Checkout error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Unknown error";
      alert("Failed to initiate checkout: " + msg);
    }
  };

  return (
    <Button
      variant="success"
      className="w-100"
      onClick={handleCheckout}
      disabled={!isAddressValid}
      style={{ fontWeight: "bold" }}
    >
      Proceed to Checkout
    </Button>
  );
}