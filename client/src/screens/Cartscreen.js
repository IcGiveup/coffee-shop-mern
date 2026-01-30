// FIYAZ AHMED
import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Card, Container, Row, Col, Form } from "react-bootstrap";
import { addToCart, removeFromCart } from "../actions/cartActions";
import Checkout from "../components/Checkout";
import { FaPlus, FaMinus, FaTrash, FaShoppingCart } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

export default function Cartscreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartState = useSelector((state) => state.cart);
  const loginUserState = useSelector((state) => state.loginUser);
  const { cartItems } = cartState;
  const { userInfo } = loginUserState;

  const [address, setAddress] = useState({
    street: "",
    city: "",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user?._id && !userInfo?._id) {
      navigate("/login");
    } else if (!user?._id && userInfo?._id) {
      localStorage.setItem("currentUser", JSON.stringify(userInfo));
    }
  }, [navigate, userInfo]);

  const incrementQty = (item) => {
    if (item.quantity >= item.stock) {
      alert(`⚠️ Only ${item.stock} units available.`);
      return;
    }

    const newQty = item.quantity + 1;

    dispatch(
      addToCart(
        {
          ...item,
          stock: item.stock, 
        },
        newQty,
        item.variant
      )
    );
  };

  const decrementQty = (item) => {
    if (!item.variants || !Array.isArray(item.variants)) {
      console.error("Invalid variants in item:", item);
      return;
    }

    if (item.quantity > 1) {
      const newQty = item.quantity - 1;
      dispatch(
        addToCart(
          {
            name: item.name,
            _id: item._id,
            image: item.image,
            variant: item.variant,
            prices: item.prices,
            variants: item.variants,
          },
          newQty,
          item.variant
        )
      );
    }
  };

  const deleteItem = (item) => {
    dispatch(removeFromCart(item));
  };

  const getTotal = useCallback(() => {
    return cartItems.reduce((acc, item) => acc + (Number(item.price) || 0), 0);
  }, [cartItems]);

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const isAddressValid = () => {
    return address.street.trim() !== "" && address.city.trim() !== "";
  };

  return (
    <Container className="my-5">
      <h2
        className="mb-4 text-center"
        style={{ fontWeight: "bold", color: "#b82828" }}
      >
        Your Cart
      </h2>

      {cartItems.length === 0 ? (
        <div className="text-center py-5">
          <FaShoppingCart size={50} color="#ccc" className="mb-3" />
          <h4 className="text-muted mb-3">Your cart is empty.</h4>
          <Button
            variant="primary"
            href="/"
            style={{
              backgroundColor: "#0c9f31",
              borderColor: "#28a745",
              padding: "10px 20px",
              fontWeight: "bold",
            }}
          >
            Continue Shopping
          </Button>
        </div>
      ) : (
        <Row>
          <Col md={8}>
            {cartItems.map((item) => {
              const perItemPrice =
                (item.variants &&
                  item.prices[item.variants.indexOf(item.variant)]) ||
                0;
              const totalPrice = perItemPrice * item.quantity;

              return (
                <Card
                  key={`${item._id}-${item.variant}`}
                  className="mb-3 shadow-sm"
                  style={{
                    borderRadius: "10px",
                    border: "none",
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.02)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <Row className="g-0 align-items-center p-3">
                    <Col md={3}>
                      <Card.Img
                        src={item.image}
                        alt={item.name}
                        style={{
                          height: "100px",
                          width: "100%",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    </Col>

                    <Col md={6}>
                      <Card.Body className="p-2">
                        <Card.Title
                          className="mb-1"
                          style={{ fontSize: "1.2rem", color: "#333" }}
                        >
                          {item.name}
                        </Card.Title>
                        <Card.Text className="text-muted mb-1">
                          <strong>Variant:</strong> {item.variant} <br />
                          <strong>Price per Item:</strong> ৳{perItemPrice}{" "}
                          <br />
                          <strong>Total:</strong> ৳{totalPrice}
                        </Card.Text>

                        <div className="d-flex align-items-center mt-2">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => decrementQty(item)}
                            className="me-2"
                            disabled={item.quantity <= 1}
                            style={{ borderRadius: "50%", padding: "5px 10px" }}
                          >
                            <FaMinus />
                          </Button>

                          <span className="mx-2 fw-bold">{item.quantity}</span>

                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => incrementQty(item)}
                            disabled={item.quantity >= item.stock}
                            className="me-2"
                            style={{ borderRadius: "50%", padding: "5px 10px" }}
                          >
                            <FaPlus />
                          </Button>
                        </div>

                        {item.stock <= item.quantity && (
                          <p style={{ color: "red", fontSize: "0.9rem" }}>
                            ⚠️ Stock limit reached ({item.stock} items)
                          </p>
                        )}
                      </Card.Body>
                    </Col>

                    <Col
                      md={3}
                      className="d-flex justify-content-center align-items-center"
                    >
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deleteItem(item)}
                        className="d-flex align-items-center"
                        style={{ borderRadius: "5px", padding: "8px 15px" }}
                      >
                        <FaTrash className="me-1" /> ADD
                      </Button>
                    </Col>
                  </Row>
                </Card>
              );
            })}
          </Col>

          <Col md={4}>
            <Card
              className="shadow-sm p-4"
              style={{
                borderRadius: "10px",
                border: "none",
                position: "sticky",
                top: "20px",
              }}
            >
              <h4
                className="mb-4"
                style={{ fontWeight: "bold", color: "#333" }}
              >
                Cart Summary
              </h4>

              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">
                  Subtotal ({cartItems.length} items):
                </span>
                <span style={{ fontWeight: "bold", color: "#333" }}>
                  ৳{getTotal()}
                </span>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Shipping:</span>
                <span style={{ color: "#28a745" }}>Free</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-4">
                <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                  Total:
                </span>
                <span
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    color: "#28a745",
                  }}
                >
                  ৳{getTotal()}
                </span>
              </div>

              <h5 className="mb-3">Shipping Address</h5>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Street</Form.Label>
                  <Form.Control
                    type="text"
                    name="street"
                    value={address.street}
                    onChange={handleAddressChange}
                    placeholder="Enter street address"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={handleAddressChange}
                    placeholder="Enter city"
                    required
                  />
                </Form.Group>
              </Form>

              <Checkout
                cartItems={cartItems}
                address={address}
                totalAmount={getTotal()}
                isAddressValid={isAddressValid()}
              />
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}
