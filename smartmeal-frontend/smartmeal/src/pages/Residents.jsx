import { useEffect, useState } from "react";
import axios from "axios";
import "./Residents.css";

import API_URL from "../api";

function Residents() {
  const [residents, setResidents] = useState([]);

  const [formData, setFormData] = useState({
    userId: "",
    residentId: "",
    name: "",
    email: "",
    phone: "",
    roomId: "",
    status: "ACTIVE",
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchResidents = async () => {
    try {
      setLoading(true);
      setError("");

     const response = await axios.get(`${API_URL}/residents`);
      setResidents(response.data);
    } catch (err) {
      console.error(err);
      setError("Unable to load residents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResidents();
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
      userId: "",
      residentId: "",
      name: "",
      email: "",
      phone: "",
      roomId: "",
      status: "ACTIVE",
    });

    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const data = {
        userId: Number(formData.userId),
        residentId: formData.residentId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        roomId: Number(formData.roomId),
        status: formData.status,
      };

     if (editingId) {
  await axios.put(`${API_URL}/residents/${editingId}`, data);
} else {
  await axios.post(`${API_URL}/residents`, data);
}

      await fetchResidents();
      resetForm();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "Unable to save resident. Please check the entered information."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (resident) => {
    setEditingId(resident.id);

    setFormData({
      userId: resident.userId ?? "",
      residentId: resident.residentId ?? "",
      name: resident.name ?? "",
      email: resident.email ?? "",
      phone: resident.phone ?? "",
      roomId: resident.roomId ?? "",
      status: resident.status ?? "ACTIVE",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resident?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await axios.delete(`${API_URL}/residents/${id}`);

      await fetchResidents();

      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      console.error(err);
      setError("Unable to delete resident.");
    }
  };

  return (
    <div className="residents-page">

      <div className="residents-header">
        <div>
          <h1>Residents</h1>
          <p>Manage registered residents and their room information.</p>
        </div>

        <button
          type="button"
          className="residents-refresh-btn"
          onClick={fetchResidents}
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="residents-error">
          {error}
        </div>
      )}

      <section className="residents-form-card">

        <div className="residents-card-header">
          <div>
            <h2>
              {editingId ? "Edit Resident" : "Add Resident"}
            </h2>

            <p>
              {editingId
                ? "Update the resident information below."
                : "Enter the details to register a new resident."}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="residents-form-grid">

            <div className="residents-field">
              <label htmlFor="userId">User ID</label>
              <input
                id="userId"
                type="number"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                placeholder="Enter user ID"
                required
              />
            </div>

            <div className="residents-field">
              <label htmlFor="residentId">Resident ID</label>
              <input
                id="residentId"
                type="text"
                name="residentId"
                value={formData.residentId}
                onChange={handleChange}
                placeholder="Example: RES001"
                required
              />
            </div>

            <div className="residents-field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="residents-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
              />
            </div>

            <div className="residents-field">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />
            </div>

            <div className="residents-field">
              <label htmlFor="roomId">Room ID</label>
              <input
                id="roomId"
                type="number"
                name="roomId"
                value={formData.roomId}
                onChange={handleChange}
                placeholder="Enter room ID"
                required
              />
            </div>

            <div className="residents-field">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>

          </div>

          <div className="residents-form-actions">

            <button
              type="submit"
              className="residents-primary-btn"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Resident"
                  : "Add Resident"}
            </button>

            {editingId && (
              <button
                type="button"
                className="residents-secondary-btn"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}

          </div>

        </form>

      </section>

      <section className="residents-table-card">

        <div className="residents-card-header">

          <div>
            <h2>Resident Records</h2>
            <p>
              {residents.length} resident
              {residents.length !== 1 ? "s" : ""} registered
            </p>
          </div>

        </div>

        {loading ? (
          <div className="residents-state">
            Loading residents...
          </div>
        ) : residents.length === 0 ? (
          <div className="residents-state">
            No residents found.
          </div>
        ) : (
          <div className="residents-table-wrapper">

            <table className="residents-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>User ID</th>
                  <th>Resident ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Room ID</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {residents.map((resident) => (
                  <tr key={resident.id}>

                    <td>{resident.id}</td>

                    <td>{resident.userId}</td>

                    <td>
                      <strong>{resident.residentId}</strong>
                    </td>

                    <td>{resident.name}</td>

                    <td>{resident.email}</td>

                    <td>{resident.phone}</td>

                    <td>{resident.roomId}</td>

                    <td>
                      <span
                        className={`resident-status ${
                          resident.status === "ACTIVE"
                            ? "resident-status-active"
                            : "resident-status-inactive"
                        }`}
                      >
                        {resident.status}
                      </span>
                    </td>

                    <td>
                      <div className="resident-actions">

                        <button
                          type="button"
                          className="resident-edit-btn"
                          onClick={() => handleEdit(resident)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="resident-delete-btn"
                          onClick={() => handleDelete(resident.id)}
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

export default Residents;