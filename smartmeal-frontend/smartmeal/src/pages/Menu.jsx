import { useEffect, useState } from "react";
import axios from "axios";
import "./Menu.css";

import API_URL from "../api";

function Menu() {
  const [menus, setMenus] = useState([]);

  const [formData, setFormData] = useState({
    menuDate: "",
    mealType: "BREAKFAST",
    foodItems: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchMenus = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${API_URL}/menus`);
      setMenus(response.data);
    } catch (err) {
      console.error(err);
      setError("Unable to load menu records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
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
      menuDate: "",
      mealType: "BREAKFAST",
      foodItems: "",
    });

    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const data = {
        menuDate: formData.menuDate,
        mealType: formData.mealType,
        foodItems: formData.foodItems,
      };

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, data);
      } else {
        await axios.post(API_URL, data);
      }

      await fetchMenus();
      resetForm();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
        "Unable to save menu. Please check the entered information."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (menu) => {
    setEditingId(menu.id);

    setFormData({
      menuDate: menu.menuDate ?? "",
      mealType: menu.mealType ?? "BREAKFAST",
      foodItems: menu.foodItems ?? "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this menu?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await axios.delete(`${API_URL}/${id}`);

      await fetchMenus();

      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      console.error(err);
      setError("Unable to delete menu.");
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const parts = date.split("-");

    if (parts.length !== 3) {
      return date;
    }

    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  return (
    <div className="menu-page">

      <div className="menu-header">

        <div>
          <h1>Menu</h1>
          <p>Manage daily breakfast, lunch and dinner menus.</p>
        </div>

        <button
          type="button"
          className="menu-refresh-btn"
          onClick={fetchMenus}
        >
          Refresh
        </button>

      </div>

      {error && (
        <div className="menu-error">
          {error}
        </div>
      )}

      <section className="menu-form-card">

        <div className="menu-card-header">

          <div>
            <h2>
              {editingId ? "Edit Menu" : "Add Menu"}
            </h2>

            <p>
              {editingId
                ? "Update the meal information below."
                : "Add a meal to the daily menu."}
            </p>
          </div>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="menu-form-grid">

            <div className="menu-field">
              <label htmlFor="menuDate">
                Menu Date
              </label>

              <input
                id="menuDate"
                type="date"
                name="menuDate"
                value={formData.menuDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="menu-field">
              <label htmlFor="mealType">
                Meal Type
              </label>

              <select
                id="mealType"
                name="mealType"
                value={formData.mealType}
                onChange={handleChange}
              >
                <option value="BREAKFAST">BREAKFAST</option>
                <option value="LUNCH">LUNCH</option>
                <option value="DINNER">DINNER</option>
              </select>
            </div>

            <div className="menu-field menu-food-field">
              <label htmlFor="foodItems">
                Food Items
              </label>

              <input
                id="foodItems"
                type="text"
                name="foodItems"
                value={formData.foodItems}
                onChange={handleChange}
                placeholder="Example: Rice, Dal, Roti, Salad"
                maxLength="500"
                required
              />
            </div>

          </div>

          <div className="menu-form-actions">

            <button
              type="submit"
              className="menu-primary-btn"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Menu"
                  : "Add Menu"}
            </button>

            {editingId && (
              <button
                type="button"
                className="menu-secondary-btn"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}

          </div>

        </form>

      </section>

      <section className="menu-table-card">

        <div className="menu-card-header">

          <div>
            <h2>Menu Records</h2>

            <p>
              {menus.length} menu
              {menus.length !== 1 ? "s" : ""} registered
            </p>
          </div>

        </div>

        {loading ? (
          <div className="menu-state">
            Loading menus...
          </div>
        ) : menus.length === 0 ? (
          <div className="menu-state">
            No menu records found.
          </div>
        ) : (
          <div className="menu-table-wrapper">

            <table className="menu-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Meal Type</th>
                  <th>Food Items</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {menus.map((menu) => (
                  <tr key={menu.id}>

                    <td>{menu.id}</td>

                    <td>
                      <strong>
                        {formatDate(menu.menuDate)}
                      </strong>
                    </td>

                    <td>
                      <span
                        className={`menu-meal-type menu-meal-${String(
                          menu.mealType
                        ).toLowerCase()}`}
                      >
                        {menu.mealType}
                      </span>
                    </td>

                    <td className="menu-food-items">
                      {menu.foodItems}
                    </td>

                    <td>
                      {menu.createdAt
                        ? new Date(menu.createdAt).toLocaleString()
                        : "-"}
                    </td>

                    <td>
                      <div className="menu-actions">

                        <button
                          type="button"
                          className="menu-edit-btn"
                          onClick={() => handleEdit(menu)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="menu-delete-btn"
                          onClick={() => handleDelete(menu.id)}
                        >
                          Delete
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </section>

    </div>
  );
}

export default Menu;