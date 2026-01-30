// FIYAZ AHMED
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const emptyForm = {
  name: "",
  category: "coffee",
  description: "",
  image: "",

  smallPrice: "",
  largePrice: "",
};

export default function AdminDashboard() {
  const [coffees, setCoffees] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState(localStorage.getItem("adminSelectedBranchId") || "");
  const [newBranch, setNewBranch] = useState({ name: "", address: "" });

  const [inventoryRows, setInventoryRows] = useState([]);

  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const normalizeNumber = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const selectedBranch = useMemo(
    () => branches.find((b) => b._id === branchId) || null,
    [branches, branchId]
  );

  const fetchBranches = async () => {
    try {
      const { data } = await axios.get("/api/admin/branches");
      const list = Array.isArray(data) ? data : [];
      setBranches(list);

      if (!branchId && list.length > 0) {
        setBranchId(list[0]._id);
        localStorage.setItem("adminSelectedBranchId", list[0]._id);
      }
    } catch (e) {
      console.error("Fetch branches error:", e?.response?.data || e.message);
      setBranches([]);
    }
  };

  const fetchCoffees = async () => {
    try {
      const res = await axios.get("/api/coffees");
      setCoffees(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setCoffees([]);
    }
  };

  const fetchInventory = async (bid) => {
    if (!bid) return;
    try {
      const { data } = await axios.get(`/api/admin/inventory/${bid}`);
      setInventoryRows(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Fetch inventory error:", e?.response?.data || e.message);
      setInventoryRows([]);
    }
  };

  useEffect(() => {
    fetchBranches();
    fetchCoffees();
  }, []);

  useEffect(() => {
    if (!branchId) return;
    localStorage.setItem("adminSelectedBranchId", branchId);
    fetchInventory(branchId);
  }, [branchId]);

  const createBranch = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    try {
      const { data } = await axios.post("/api/admin/branches", newBranch);
      setInfo("✅ Branch created");
      setNewBranch({ name: "", address: "" });
      await fetchBranches();
      setBranchId(data._id);
    } catch (e2) {
      setError(e2?.response?.data?.message || "Failed to create branch");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    const payload = {
      name: form.name.trim(),
      category: (form.category || "coffee").trim(),
      description: form.description.trim(),
      image: form.image.trim(),

      variants: ["Small", "Large"],
      prices: [normalizeNumber(form.smallPrice), normalizeNumber(form.largePrice)],
    };

    if (!payload.name) return setError("Name is required");
    if (!payload.category) return setError("Category is required");
    if (!payload.description) return setError("Description is required");
    if (!payload.image) return setError("Image URL is required");
    if (!payload.prices[0] || !payload.prices[1]) return setError("Both Small & Large price are required");

    try {
      let savedCoffeeId = editingId;

      if (editingId) {
        await axios.put(`/api/admin/coffees/${editingId}`, payload);
        setEditingId(null);
        setInfo("✅ Coffee updated");
      } else {
        const res = await axios.post("/api/admin/coffees/add", payload);
        savedCoffeeId = res.data?.coffee?._id;
        setInfo("✅ Coffee added");
      }

      setForm(emptyForm);
      await fetchCoffees();

      if (branchId && savedCoffeeId) {
        await axios.post("/api/admin/inventory/set", {
          coffeeId: savedCoffeeId,
          branchId,
          stock: 0,
          offer: 0,
          isAvailable: false,
        });
        await fetchInventory(branchId);
      }
    } catch (err) {
      console.error("SAVE ERROR:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to save coffee.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coffee?")) return;
    try {
      await axios.delete(`/api/admin/coffees/${id}`);
      await fetchCoffees();
      if (branchId) await fetchInventory(branchId);
    } catch (err) {
      console.error("DELETE ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const handleEdit = (coffee) => {
    const small = coffee?.prices?.[0] ?? 0;
    const large = coffee?.prices?.[1] ?? 0;

    setForm({
      name: coffee?.name || "",
      category: coffee?.category || "coffee",
      description: coffee?.description || "",
      image: coffee?.image || "",
      smallPrice: small,
      largePrice: large,
    });

    setEditingId(coffee._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateInventory = async (coffeeId, changes) => {
    if (!branchId) return alert("Select a branch first.");

    try {
      await axios.post("/api/admin/inventory/set", {
        coffeeId,
        branchId,
        stock: Number(changes.stock || 0),
        offer: Number(changes.offer || 0),
        isAvailable: Boolean(changes.isAvailable),
      });
      setInfo("✅ Inventory updated");
      fetchInventory(branchId);
    } catch (e) {
      console.error("Inventory update error:", e?.response?.data || e.message);
      setError(e?.response?.data?.message || "Failed to update inventory");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Admin Dashboard</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {info && <div className="alert alert-success">{info}</div>}

      <div className="card p-3 mb-4">
        <h5 className="mb-3">Branches</h5>

        <div className="row g-2 align-items-end">
          <div className="col-md-6">
            <label className="form-label fw-bold">Select Branch</label>
            <select
              className="form-select"
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
            >
              {branches.length === 0 && <option value="">No branches</option>}
              {branches.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name} {b.isActive ? "" : "(Inactive)"}
                </option>
              ))}
            </select>
            {selectedBranch?.address && (
              <small className="text-muted">Address: {selectedBranch.address}</small>
            )}
          </div>

          <div className="col-md-6">
            <form onSubmit={createBranch}>
              <div className="row g-2">
                <div className="col-6">
                  <input
                    className="form-control"
                    placeholder="New Branch Name"
                    value={newBranch.name}
                    onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
                  />
                </div>
                <div className="col-6">
                  <input
                    className="form-control"
                    placeholder="Address (optional)"
                    value={newBranch.address}
                    onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
                  />
                </div>
                <div className="col-12">
                  <button className="btn btn-dark w-100" type="submit">
                    Add Branch
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="card p-3 mb-4">
        <h5 className="mb-3">Coffee Master (Product)</h5>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            type="text"
            className="form-control mb-2"
            placeholder="Category (e.g. coffee, shake, latte)"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          />

          <textarea
            className="form-control mb-2"
            placeholder="Description"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />

          <div className="row">
            <div className="col-md-6">
              <input
                type="number"
                className="form-control mb-2"
                placeholder="Small Price"
                value={form.smallPrice}
                onChange={(e) => setForm({ ...form, smallPrice: e.target.value })}
                required
              />
            </div>
            <div className="col-md-6">
              <input
                type="number"
                className="form-control mb-2"
                placeholder="Large Price"
                value={form.largePrice}
                onChange={(e) => setForm({ ...form, largePrice: e.target.value })}
                required
              />
            </div>
          </div>

          <input
            type="text"
            className="form-control mb-2"
            placeholder="Image URL"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            required
          />

          {form.image && (
            <div className="text-center mb-3">
              <img
                src={form.image}
                alt="Preview"
                style={{ width: "110px", height: "110px", objectFit: "cover" }}
                onError={(e) =>
                  (e.target.src =
                    "https://cdn-icons-png.flaticon.com/512/415/415733.png")
                }
              />
            </div>
          )}

          <button className="btn btn-success w-100" type="submit">
            {editingId ? "Update Coffee" : "Add Coffee"}
          </button>
        </form>
      </div>

      <h5 className="mb-2">Coffee Master List</h5>
      <table className="table table-bordered text-center mb-5">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Small</th>
            <th>Large</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {coffees.map((coffee) => (
            <tr key={coffee._id}>
              <td>
                <img
                  src={coffee.image}
                  alt={coffee.name}
                  style={{ width: "60px", height: "60px", objectFit: "cover" }}
                  onError={(e) =>
                    (e.target.src =
                      "https://cdn-icons-png.flaticon.com/512/415/415733.png")
                  }
                />
              </td>
              <td>{coffee.name}</td>
              <td>{coffee?.prices?.[0] ?? 0}</td>
              <td>{coffee?.prices?.[1] ?? 0}</td>
              <td>
                <button
                  onClick={() => handleEdit(coffee)}
                  className="btn btn-warning btn-sm mx-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(coffee._id)}
                  className="btn btn-danger btn-sm mx-1"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {coffees.length === 0 && (
            <tr>
              <td colSpan="5">No coffees found</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="card p-3">
        <h5 className="mb-3">Branch Inventory {selectedBranch ? `— ${selectedBranch.name}` : ""}</h5>
        <p className="text-muted mb-3">
          Here you control which items are available in the selected branch + stock + offer.
        </p>

        <table className="table table-bordered text-center">
          <thead>
            <tr>
              <th>Coffee</th>
              <th>Available?</th>
              <th>Stock</th>
              <th>Offer (%)</th>
              <th>Save</th>
            </tr>
          </thead>

          <tbody>
            {inventoryRows.map((row) => {
              const c = row.coffee;
              const inv = row.inventory || { stock: 0, offer: 0, isAvailable: false };

              return (
                <InventoryRow
                  key={c._id}
                  coffee={c}
                  inventory={inv}
                  onSave={(changes) => updateInventory(c._id, changes)}
                />
              );
            })}

            {inventoryRows.length === 0 && (
              <tr>
                <td colSpan="5">Select a branch to manage inventory.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InventoryRow({ coffee, inventory, onSave }) {
  const [isAvailable, setIsAvailable] = useState(Boolean(inventory.isAvailable));
  const [stock, setStock] = useState(String(inventory.stock || 0));
  const [offer, setOffer] = useState(String(inventory.offer || 0));

  useEffect(() => {
    setIsAvailable(Boolean(inventory.isAvailable));
    setStock(String(inventory.stock || 0));
    setOffer(String(inventory.offer || 0));
  }, [inventory?.stock, inventory?.offer, inventory?.isAvailable]);

  return (
    <tr>
      <td style={{ textAlign: "left" }}>
        <strong>{coffee.name}</strong>
        <div className="text-muted" style={{ fontSize: 12 }}>
          Small: {coffee?.prices?.[0] ?? 0} | Large: {coffee?.prices?.[1] ?? 0}
        </div>
      </td>

      <td>
        <input
          type="checkbox"
          checked={isAvailable}
          onChange={(e) => setIsAvailable(e.target.checked)}
        />
      </td>

      <td style={{ width: 140 }}>
        <input
          type="number"
          className="form-control"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          min="0"
        />
      </td>

      <td style={{ width: 140 }}>
        <input
          type="number"
          className="form-control"
          value={offer}
          onChange={(e) => setOffer(e.target.value)}
          min="0"
          max="100"
        />
      </td>

      <td style={{ width: 160 }}>
        <button
          className="btn btn-primary w-100"
          onClick={() =>
            onSave({
              isAvailable,
              stock: Number(stock || 0),
              offer: Number(offer || 0),
            })
          }
        >
          Save
        </button>
      </td>
    </tr>
  );
}