import { useEffect, useState } from "react";
import axios from "axios";
import "./FoodWaste.css";

import API_URL from "../api";

function FoodWaste() {
  const [foodWaste, setFoodWaste] = useState([]);

  const [formData, setFormData] = useState({
    menuId: "",
    preparedMeals: "",
    servedMeals: "",
    leftoverMeals: "",
    wasteReason: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchFoodWaste = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API_URL);
      setFoodWaste(response.data);
    } catch (err) {
      console.error(err);
      setError("Unable to load food waste records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoodWaste();
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
      menuId: "",
      preparedMeals: "",
      servedMeals: "",
      leftoverMeals: "",
      wasteReason: "",
    });

    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const data = {
        menuId: Number(formData.menuId),
        preparedMeals: Number(formData.preparedMeals),
        servedMeals: Number(formData.servedMeals),
        leftoverMeals: Number(formData.leftoverMeals),
        wasteReason: formData.wasteReason,
      };

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, data);
      } else {
        await axios.post(API_URL, data);
      }

      await fetchFoodWaste();
      resetForm();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to save food waste record. Please check the entered information."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (record) => {
    setEditingId(record.id);

    setFormData({
      menuId: record.menuId ?? "",
      preparedMeals: record.preparedMeals ?? "",
      servedMeals: record.servedMeals ?? "",
      leftoverMeals: record.leftoverMeals ?? "",
      wasteReason: record.wasteReason ?? "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this food waste record?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await axios.delete(`${API_URL}/${id}`);

      await fetchFoodWaste();

      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      console.error(err);
      setError("Unable to delete food waste record.");
    }
  };

  const calculateWastePercentage = (prepared, leftover) => {
    const preparedValue = Number(prepared);
    const leftoverValue = Number(leftover);

    if (!preparedValue || preparedValue <= 0) {
      return 0;
    }

    return (leftoverValue / preparedValue) * 100;
  };

  const getWasteClass = (percentage) => {
    if (percentage === 0) {
      return "food-waste-status-none";
    }

    if (percentage <= 10) {
      return "food-waste-status-low";
    }

    if (percentage <= 25) {
      return "food-waste-status-medium";
    }

    return "food-waste-status-high";
  };

  const getWasteLabel = (percentage) => {
    if (percentage === 0) {
      return "NO WASTE";
    }

    if (percentage <= 10) {
      return "LOW WASTE";
    }

    if (percentage <= 25) {
      return "MEDIUM WASTE";
    }

    return "HIGH WASTE";
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) {
      return "-";
    }

    return new Date(dateTime).toLocaleString();
  };

  return (
    <div className="food-waste-page">

      {/* Header */}
      <div className="food-waste-header">
        <div>
          <h1>Food Waste</h1>
          <p>
            Track prepared meals, served meals and leftover food.
          </p>
        </div>

        <button
          type="button"
          className="food-waste-refresh-btn"
          onClick={fetchFoodWaste}
        >
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="food-waste-error">
          {error}
        </div>
      )}

      {/* Form */}
      <section className="food-waste-form-card">

        <div className="food-waste-card-header">
          <div>
            <h2>
              {editingId
                ? "Edit Food Waste Record"
                : "Add Food Waste Record"}
            </h2>

            <p>
              {editingId
                ? "Update the food waste information below."
                : "Enter the meal and leftover information."}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="food-waste-form-grid">

            {/* Menu ID */}
            <div className="food-waste-field">
              <label htmlFor="menuId">
                Menu ID
              </label>

              <input
                id="menuId"
                type="number"
                name="menuId"
                value={formData.menuId}
                onChange={handleChange}
                placeholder="Enter menu ID"
                min="1"
                required
              />
            </div>

            {/* Prepared Meals */}
            <div className="food-waste-field">
              <label htmlFor="preparedMeals">
                Prepared Meals
              </label>

              <input
                id="preparedMeals"
                type="number"
                name="preparedMeals"
                value={formData.preparedMeals}
                onChange={handleChange}
                placeholder="Example: 100"
                min="0"
                required
              />
            </div>

            {/* Served Meals */}
            <div className="food-waste-field">
              <label htmlFor="servedMeals">
                Served Meals
              </label>

              <input
                id="servedMeals"
                type="number"
                name="servedMeals"
                value={formData.servedMeals}
                onChange={handleChange}
                placeholder="Example: 85"
                min="0"
                required
              />
            </div>

            {/* Leftover Meals */}
            <div className="food-waste-field">
              <label htmlFor="leftoverMeals">
                Leftover Meals
              </label>

              <input
                id="leftoverMeals"
                type="number"
                name="leftoverMeals"
                value={formData.leftoverMeals}
                onChange={handleChange}
                placeholder="Example: 15"
                min="0"
                required
              />
            </div>

            {/* Waste Reason */}
            <div className="food-waste-field food-waste-reason-field">
              <label htmlFor="wasteReason">
                Waste Reason
              </label>

              <input
                id="wasteReason"
                type="text"
                name="wasteReason"
                value={formData.wasteReason}
                onChange={handleChange}
                placeholder="Example: Residents did not attend"
                maxLength="500"
              />
            </div>

          </div>

          <div className="food-waste-form-actions">

            <button
              type="submit"
              className="food-waste-primary-btn"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Record"
                  : "Add Record"}
            </button>

            {editingId && (
              <button
                type="button"
                className="food-waste-secondary-btn"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}

          </div>

        </form>
      </section>

      {/* Table */}
      <section className="food-waste-table-card">

        <div className="food-waste-card-header">

          <div>
            <h2>Food Waste Records</h2>

            <p>
              {foodWaste.length} record
              {foodWaste.length !== 1 ? "s" : ""} registered
            </p>
          </div>

        </div>

        {loading ? (
          <div className="food-waste-state">
            Loading food waste records...
          </div>
        ) : foodWaste.length === 0 ? (
          <div className="food-waste-state">
            No food waste records found.
          </div>
        ) : (
          <div className="food-waste-table-wrapper">

            <table className="food-waste-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Menu ID</th>
                  <th>Prepared</th>
                  <th>Served</th>
                  <th>Leftover</th>
                  <th>Waste %</th>
                  <th>Status</th>
                  <th>Waste Reason</th>
                  <th>Recorded At</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {foodWaste.map((record) => {

                  const wastePercentage =
                    calculateWastePercentage(
                      record.preparedMeals,
                      record.leftoverMeals
                    );

                  const roundedPercentage =
                    wastePercentage.toFixed(1);

                  return (
                    <tr key={record.id}>

                      <td>{record.id}</td>

                      <td>
                        <strong>{record.menuId}</strong>
                      </td>

                      <td>{record.preparedMeals}</td>

                      <td>{record.servedMeals}</td>

                      <td>{record.leftoverMeals}</td>

                      <td>
                        <strong>
                          {roundedPercentage}%
                        </strong>
                      </td>

                      <td>
                        <span
                          className={`food-waste-status ${getWasteClass(
                            wastePercentage
                          )}`}
                        >
                          {getWasteLabel(wastePercentage)}
                        </span>
                      </td>

                      <td className="food-waste-reason">
                        {record.wasteReason || "-"}
                      </td>

                      <td>
                        {formatDateTime(record.recordedAt)}
                      </td>

                      <td>

                        <div className="food-waste-actions">

                          <button
                            type="button"
                            className="food-waste-edit-btn"
                            onClick={() => handleEdit(record)}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="food-waste-delete-btn"
                            onClick={() =>
                              handleDelete(record.id)
                            }
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

export default FoodWaste;