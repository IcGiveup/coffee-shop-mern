// FIYAZ AHMED
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addToCart } from "../actions/cartActions";
import { useNavigate } from "react-router-dom";

export default function CFE({ coffee }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [variant, setVariant] = useState("Small");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const descriptions = {
    Espresso:
      "A strong, concentrated coffee made by forcing hot water through finely-ground beans.",
    Latte:
      "A creamy coffee drink made with espresso and steamed milk, topped with foam.",
    Cappuccino:
      "A balanced mix of espresso, steamed milk, and a thick milk-foam layer.",
    Americano: "Espresso diluted with hot water for a milder taste.",
    Mocha:
      "Espresso, chocolate, and steamed milk blended together, often topped with cream.",
    Macchiato:
      "Espresso with a touch of steamed milk or foam for intense flavor.",
    "Flat White":
      "Espresso with a thin layer of steamed milk for a velvety texture.",
    Affogato: "Vanilla ice cream drowned in hot espresso.",
    "Cold Brew":
      "Coffee brewed cold for hours to produce a smooth, bold flavor.",
  };

useEffect(() => {
  if (coffee?.variants?.length) {
    setVariant(coffee.variants[0]);
  } else {
    setVariant("Small");
  }
  setQuantity(1);
}, [coffee]); 

  if (!coffee || !coffee.name) return <div>No coffee data available</div>;

  const safeVariants =
    Array.isArray(coffee?.variants) && coffee.variants.length > 0
      ? coffee.variants
      : ["Small", "Large"];

  const stock = Number(coffee?.stock || 0);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const addToCartHandler = () => {
    if (stock <= 0) {
      setError("❌ This item is currently out of stock.");
      return;
    }
    if (Number(quantity) > stock) {
      setError(`⚠️ Only ${stock} units available in stock.`);
      return;
    }

    setError("");
    dispatch(addToCart(coffee, Number(quantity), variant));
    navigate("/cart");
  };

  const variantIndex = safeVariants.indexOf(variant);
  const basePrice = Number(coffee?.prices?.[variantIndex] ?? 0);

  const offer = Number(coffee?.offer || 0);
  const discounted = offer > 0 ? basePrice - (basePrice * offer) / 100 : basePrice;
  const total = discounted * Number(quantity);

  const modalDescription =
    (coffee?.description || "").trim() ||
    (descriptions[coffee.name] || "").trim() ||
    "No description available.";

  return (
    <div
      className="shadow p-3 mb-5 bg-white rounded text-center"
      style={{
        margin: "20px",
        width: "90%",
        maxWidth: "300px",
        position: "relative",
      }}
    >
      <h5 className="mb-3">{coffee.name}</h5>

      {offer > 0 && (
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 15,
            background: "green",
            color: "white",
            padding: "3px 8px",
            borderRadius: 5,
            fontSize: "0.8rem",
            fontWeight: "bold",
          }}
        >
          {offer}% OFF
        </div>
      )}

      <div style={{ position: "relative" }}>
        <img
          src={coffee.image || "https://via.placeholder.com/180"}
          className="img-fluid mb-2"
          style={{
            height: 180,
            width: 180,
            borderRadius: "10%",
            objectFit: "cover",
            cursor: "pointer",
          }}
          onClick={handleShow}
          alt={coffee.name}
        />

        {stock <= 0 && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "rgba(0,0,0,0.75)",
              color: "#fff",
              padding: "10px 15px",
              borderRadius: 8,
              fontWeight: "bold",
            }}
          >
            OUT OF STOCK
          </div>
        )}
      </div>

      <div className="row mt-2">
        <div className="col">
          <p className="mb-1">Variants</p>
          <select
            className="form-control"
            value={variant}
            onChange={(e) => setVariant(e.target.value)}
            disabled={stock <= 0}
          >
            {safeVariants.map((v) => (
              <option value={v} key={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        <div className="col">
          <p className="mb-1">Quantity</p>
          <select
            className="form-control"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            disabled={stock <= 0}
          >
            {[...Array(Math.min(stock || 0, 10)).keys()].map((x) => (
              <option key={x + 1} value={x + 1}>
                {x + 1}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="row mt-3 align-items-center">
        <div className="col">
          {offer > 0 ? (
            <div style={{ lineHeight: 1.2 }}>
              <p style={{ margin: 0, textDecoration: "line-through", color: "gray" }}>
                {(basePrice * Number(quantity)).toFixed(0)} Taka/-
              </p>
              <p style={{ margin: 0, color: "green", fontWeight: "bold" }}>
                {total.toFixed(0)} Taka/- ({offer}% OFF)
              </p>
            </div>
          ) : (
            <strong>Price: {total.toFixed(0)} Taka/-</strong>
          )}
        </div>

        <div className="col">
          <button
            className="btn custom-btn w-100"
            onClick={addToCartHandler}
            disabled={stock <= 0}
            style={{
              backgroundColor: stock <= 0 ? "gray" : "var(--bs-success)",
              border: "none",
              cursor: stock <= 0 ? "not-allowed" : "pointer",
            }}
          >
            {stock <= 0 ? "Out of Stock" : "ADD TO CART"}
          </button>
        </div>
      </div>

      {error && (
        <p style={{ color: "red", marginTop: 10, fontWeight: 500, fontSize: "0.9rem" }}>
          {error}
        </p>
      )}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{coffee.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            src={coffee.image || "https://via.placeholder.com/180"}
            className="img-fluid mb-3"
            alt={coffee.name}
          />
          <p>{modalDescription}</p>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleClose}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
