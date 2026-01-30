// FIYAZ AHMED 
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Modal, Button, Table, Badge } from "react-bootstrap";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState(null);

  const formatDateTime = (value) => {
    if (!value) return "-";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleString();
  };

  const money = (n) => {
    const x = Number(n || 0);
    return `৳${x.toFixed(2)}`;
  };

  const statusBadge = (status) => {
    const s = String(status || "Pending");
    const variant =
      s === "Delivered"
        ? "success"
        : s === "Accepted"
        ? "primary"
        : s === "Rejected"
        ? "danger"
        : s === "Processing"
        ? "warning"
        : "secondary";
    return <Badge bg={variant}>{s}</Badge>;
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setErr("");

      const res = await axios.get("/api/admin/orders");

      const list = Array.isArray(res.data?.orders)
        ? res.data.orders
        : Array.isArray(res.data)
        ? res.data
        : [];

      setOrders(list);
    } catch (e) {
      console.error("FETCH ORDERS ERROR:", e?.response?.data || e.message);
      setErr(e?.response?.data?.message || "Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(`/api/admin/orders/${orderId}/status`, { status });
      fetchOrders();
      setSelected((prev) => (prev?._id === orderId ? { ...prev, status } : prev));
    } catch (e) {
      console.error("UPDATE STATUS ERROR:", e?.response?.data || e.message);
      alert(e?.response?.data?.message || "Failed to update status");
    }
  };

  const openDetails = (order) => {
    setSelected(order);
    setShow(true);
  };

  const closeDetails = () => {
    setShow(false);
    setSelected(null);
  };

  const selectedItems = useMemo(() => {
    if (!selected?.items || !Array.isArray(selected.items)) return [];
    return selected.items;
  }, [selected]);

  const itemsTotal = useMemo(() => {
    return selectedItems.reduce((sum, it) => {
      const price = Number(it?.price || 0);
      const qty = Number(it?.quantity || 0);
      return sum + price * qty;
    }, 0);
  }, [selectedItems]);

  if (loading) return <div className="container mt-5">Loading orders...</div>;
  if (err) return <div className="container mt-5 alert alert-danger">{err}</div>;

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Customer Orders</h2>

      <table className="table table-bordered text-center">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User</th>
            <th>Purchase Date</th>
            <th>Total</th>
            <th>Status</th>
            <th>Change</th>
          </tr>
        </thead>

        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="6">No orders found</td>
            </tr>
          ) : (
            orders.map((o) => (
              <tr key={o._id}>
                <td>
                  <button
                    type="button"
                    className="btn btn-link p-0"
                    style={{ fontWeight: 600, textDecoration: "underline" }}
                    onClick={() => openDetails(o)}
                    title="View order details"
                  >
                    {o._id}
                  </button>
                </td>

                <td>{o.userId?.email || o.userId || "Unknown"}</td>
                <td>{formatDateTime(o.createdAt)}</td>
                <td>{money(o.totalAmount)}</td>
                <td>{statusBadge(o.status)}</td>

                <td style={{ minWidth: 220 }}>
                  <select
                    className="form-select"
                    value={o.status || "Pending"}
                    onChange={(e) => updateStatus(o._id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Processing">Processing</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Modal show={show} onHide={closeDetails} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {!selected ? (
            <div>No order selected</div>
          ) : (
            <>
              <div className="mb-3">
                <div>
                  <strong>Order ID:</strong> {selected._id}
                </div>
                <div>
                  <strong>User:</strong> {selected.userId?.email || selected.userId || "Unknown"}
                </div>
                <div>
                  <strong>Purchase Date:</strong> {formatDateTime(selected.createdAt)}
                </div>
                <div>
                  <strong>Status:</strong> {statusBadge(selected.status)}
                </div>
                <div>
                  <strong>Payment ID:</strong> {selected.paymentId || "N/A"}
                </div>
              </div>

              <div className="mb-3">
                <strong>Shipping Address:</strong>
                <div>
                  {selected.address?.street || "-"}, {selected.address?.city || "-"}
                  {selected.address?.zip ? `, ${selected.address.zip}` : ""}
                </div>
              </div>

              <h5 className="mt-3 mb-2">Items</h5>
              <Table bordered striped responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Item</th>
                    <th>Variant</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Line Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedItems.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No items found
                      </td>
                    </tr>
                  ) : (
                    selectedItems.map((it, idx) => {
                      const price = Number(it?.price || 0);
                      const qty = Number(it?.quantity || 0);
                      return (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{it?.name || "-"}</td>
                          <td>{it?.variant || "-"}</td>
                          <td>{qty}</td>
                          <td>{money(price)}</td>
                          <td>{money(price * qty)}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </Table>

              <div className="d-flex justify-content-end">
                <div style={{ minWidth: 260 }}>
                  <div className="d-flex justify-content-between">
                    <span>
                      <strong>Items Total:</strong>
                    </span>
                    <span>{money(itemsTotal)}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>
                      <strong>Order Total:</strong>
                    </span>
                    <span>{money(selected.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeDetails}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}



