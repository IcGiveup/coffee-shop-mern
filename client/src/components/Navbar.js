// FIYAZ AHMED
import React, { useEffect, useState } from "react";
import {
  Navbar as BootstrapNavbar,
  Nav,
  Container,
  Dropdown,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaUserCircle, FaShoppingCart, FaAngleDown } from "react-icons/fa";
import { logoutUser } from "../actions/userActions";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginUserState = useSelector((state) => state.loginUser);
  const cartState = useSelector((state) => state.cart);
  const { userInfo } = loginUserState || {};
  const { cartItems } = cartState || { cartItems: [] };

  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser")) || null
  );

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (storedUser && storedUser.email) {
      setCurrentUser(storedUser);
    } else if (userInfo && userInfo.email) {
      setCurrentUser(userInfo);
    } else {
      setCurrentUser(null);
    }
  }, [userInfo]);

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem("currentUser");
    localStorage.removeItem("cartItems");
    navigate("/login");
  };

  const isAdmin = currentUser?.isAdmin || false;
  const userName = currentUser?.email?.split("@")[0] || "Guest";

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">
          <span
            style={{
              fontWeight: "bold",
              fontSize: "1.5rem",
              color: "#f8f9fa",
            }}
          >
            Mern Coffee Shop
          </span>
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {/* 🔹 Guest View */}
            {!currentUser && (
              <Nav.Link as={Link} to="/login" className="mx-2">
                Login
              </Nav.Link>
            )}

            {/* 🔹 Normal User Menu */}
            {currentUser && !isAdmin && (
              <>
                <Nav.Link as={Link} to="/find-us" className="mx-2">
                  Find Us
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/cart"
                  className="mx-2 position-relative"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <FaShoppingCart size={20} />
                  {cartItems.length > 0 && (
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                      style={{
                        fontSize: "0.7rem",
                        transform: "translate(50%, -30%)",
                      }}
                    >
                      {cartItems.length}
                    </span>
                  )}
                </Nav.Link>
                <Nav.Link as={Link} to="/orders" className="mx-2">
                  Orders
                </Nav.Link>
              </>
            )}

            {currentUser && isAdmin && (
              <>
                <Nav.Link as={Link} to="/admin/dashboard" className="mx-2">
                  Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/orders" className="mx-2">
                  Manage Orders
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/stats" className="mx-2">
                  Summary
                </Nav.Link>
              </>
            )}

            {currentUser && (
              <Dropdown align="end" className="mx-2">
                <Dropdown.Toggle
                  as="span"
                  id="dropdown-user"
                  style={{
                    cursor: "pointer",
                    color: "#f8f9fa",
                    display: "flex",
                    alignItems: "center",
                    padding: "0.5rem 1rem",
                  }}
                >
                  <FaUserCircle size={20} className="me-1" />
                  {userName}
                  {isAdmin && (
                    <span className="badge bg-warning text-dark ms-2">
                      Admin
                    </span>
                  )}
                  <FaAngleDown size={16} className="ms-1" />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
