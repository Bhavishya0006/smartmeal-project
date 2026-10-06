import { useEffect, useState } from "react";
import axios from "axios";
import "./Inventory.css";

const API_URL = "http://localhost:8080/inventory";

function Inventory() {
  const [inventory, setInventory] = useState([]);

  const [formData, setFormData] = useState({
    itemName: "",
    quantity: "",
    unit: "",
    minimumStock: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API_URL);
      setInventory(response.data);
    } catch (err) {
      console.error(err);
      setError("Unable to load inventory records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      itemName: "",
      quantity: "",
      unit: "",
      minimumStock: "",
    });

    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const data = {
        itemName: formData.itemName,
        quantity: Number(formData.quantity),
        unit: formData.unit,
        minimumStock: Number(formData.minimumStock),
      };

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, data);
      } else {
        await axios.post(API_URL, data);
      }

      await fetchInventory();
      resetForm();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to save inventory item. Please check the entered information."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);

    setFormData({
      itemName: item.itemName ?? "",
      quantity: item.quantity ?? "",
      unit: item.unit ?? "",
      minimumStock: item.minimumStock ?? "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this inventory item?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await axios.delete(`${API_URL}/${id}`);

      await fetchInventory();

      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      console.error(err);
      setError("Unable to delete inventory item.");
    }
  };

  const isLowStock = (item) => {
    return Number(item.quantity) < Number(item.minimumStock);
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) {
      return "-";
    }

    return new Date(dateTime).toLocaleString();
  };

  return (
    <div className="inventory-page">

      {/* Page Header */}
      <div className="inventory-header">
        <div>
          <h1>Inventory</h1>
          <p>Manage food items, quantities and minimum stock levels.</p>
        </div>

        <button
          type="button"
          className="inventory-refresh-btn"
          onClick={fetchInventory}
        >
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && <div className="inventory-error">{error}</div>}

      {/* Add / Edit Form */}
      <section className="inventory-form-card">

        <div className="inventory-card-header">
          <div>
            <h2>{editingId ? "Edit Inventory Item" : "Add Inventory Item"}</h2>

            <p>
              {editingId
                ? "Update the inventory information below."
                : "Enter the details to add a new inventory item."}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="inventory-form-grid">

            {/* Item Name */}
            <div className="inventory-field">
              <label htmlFor="itemName">
                Item Name
              </label>

              <input
                id="itemName"
                type="text"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                placeholder="Example: Rice"
                required
              />
            </div>

            {/* Quantity */}
            <div className="inventory-field">
              <label htmlFor="quantity">
                Quantity
              </label>

              <input
                id="quantity"
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Example: 50"
                min="0"
                step="0.01"
                required
              />
            </div>

            {/* Unit */}
            <div className="inventory-field">
              <label htmlFor="unit">
                Unit
              </label>

              <input
                id="unit"
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                placeholder="Example: kg"
                required
              />
            </div>

            {/* Minimum Stock */}
            <div className="inventory-field">
              <label htmlFor="minimumStock">
                Minimum Stock
              </label>

              <input
                id="minimumStock"
                type="number"
                name="minimumStock"
                value={formData.minimumStock}
                onChange={handleChange}
                placeholder="Example: 10"
                min="0"
                step="0.01"
                required
              />
            </div>

          </div>

          <div className="inventory-form-actions">

            <button
              type="submit"
              className="inventory-primary-btn"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Item"
                  : "Add Item"}
            </button>

            {editingId && (
              <button
                type="button"
                className="inventory-secondary-btn"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}

          </div>

        </form>
      </section>

      {/* Inventory Table */}
      <section className="inventory-table-card">

        <div className="inventory-card-header">

          <div>
            <h2>Inventory Records</h2>

            <p>
              {inventory.length} item
              {inventory.length !== 1 ? "s" : ""} in inventory
            </p>
          </div>

        </div>

        {loading ? (
          <div className="inventory-state">
            Loading inventory...
          </div>
        ) : inventory.length === 0 ? (
          <div className="inventory-state">
            No inventory records found.
          </div>
        ) : (
          <div className="inventory-table-wrapper">

            <table className="inventory-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Item Name</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                  <th>Minimum Stock</th>
                  <th>Stock Status</th>
                  <th>Updated At</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {inventory.map((item) => {

                  const lowStock = isLowStock(item);

                  return (
                    <tr key={item.id}>

                      <td>{item.id}</td>

                      <td>
                        <strong>{item.itemName}</strong>
                      </td>

                      <td>{item.quantity}</td>

                      <td>{item.unit}</td>

                      <td>{item.minimumStock}</td>

                      <td>
                        <span
                          className={`inventory-status ${
                            lowStock
                              ? "inventory-status-low"
                              : "inventory-status-good"
                          }`}
                        >
                          {lowStock ? "LOW STOCK" : "IN STOCK"}
                        </span>
                      </td>

                      <td>
                        {formatDateTime(item.updatedAt)}
                      </td>

                      <td>

                        <div className="inventory-actions">

                          <button
                            type="button"
                            className="inventory-edit-btn"
                            onClick={() => handleEdit(item)}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="inventory-delete-btn"
                            onClick={() => handleDelete(item.id)}
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>
        )}

      </section>

    </div>
  );
}

export default Inventory;