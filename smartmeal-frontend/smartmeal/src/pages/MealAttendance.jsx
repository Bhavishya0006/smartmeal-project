import { useEffect, useState } from "react";
import axios from "axios";
import "./MealAttendance.css";

import API_URL from "../api";

function MealAttendance() {
  const [attendance, setAttendance] = useState([]);

  const [formData, setFormData] = useState({
    bookingId: "",
    attendanceStatus: "SERVED",
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${API_URL}/meal-attendance`);
      setAttendance(response.data);
   } catch (err) {
  console.error("Meal Attendance Error:", err);
  console.error("Request URL:", `${API_URL}/meal-attendance`);
  console.error("Status Code:", err.response?.status);
  console.error("Response Data:", err.response?.data);

  setError(
    `Unable to load attendance. ${
      err.response?.status
        ? `Status: ${err.response.status}`
        : "Network or connection error."
    }`
  );
}
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
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
      bookingId: "",
      attendanceStatus: "SERVED",
    });

    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const data = {
        bookingId: Number(formData.bookingId),
        attendanceStatus: formData.attendanceStatus,
      };

      if (editingId) {
        await axios.put(`${API_URL}/meal-attendance/${editingId}`, data);
      } else {
        await axios.post(`${API_URL}/meal-attendance`, data);
      }

      await fetchAttendance();
      resetForm();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to save attendance. Please check the entered information."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (record) => {
    setEditingId(record.id);

    setFormData({
      bookingId: record.bookingId ?? "",
      attendanceStatus: record.attendanceStatus ?? "SERVED",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this attendance record?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await axios.delete(`${API_URL}/meal-attendance/${id}`);

      await fetchAttendance();

      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      console.error(err);
      setError("Unable to delete attendance record.");
    }
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) {
      return "-";
    }

    return new Date(dateTime).toLocaleString();
  };

  return (
    <div className="meal-attendance-page">

      {/* Header */}
      <div className="meal-attendance-header">
        <div>
          <h1>Meal Attendance</h1>
          <p>Track whether booked meals were served or missed.</p>
        </div>

        <button
          type="button"
          className="meal-attendance-refresh-btn"
          onClick={fetchAttendance}
        >
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="meal-attendance-error">
          {error}
        </div>
      )}

      {/* Form */}
      <section className="meal-attendance-form-card">

        <div className="meal-attendance-card-header">
          <div>
            <h2>
              {editingId
                ? "Edit Attendance"
                : "Add Attendance"}
            </h2>

            <p>
              {editingId
                ? "Update the attendance information below."
                : "Record attendance for a meal booking."}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="meal-attendance-form-grid">

            {/* Booking ID */}
            <div className="meal-attendance-field">
              <label htmlFor="bookingId">
                Booking ID
              </label>

              <input
                id="bookingId"
                type="number"
                name="bookingId"
                value={formData.bookingId}
                onChange={handleChange}
                placeholder="Enter booking ID"
                min="1"
                required
              />
            </div>

            {/* Attendance Status */}
            <div className="meal-attendance-field">
              <label htmlFor="attendanceStatus">
                Attendance Status
              </label>

              <select
                id="attendanceStatus"
                name="attendanceStatus"
                value={formData.attendanceStatus}
                onChange={handleChange}
              >
                <option value="SERVED">SERVED</option>
                <option value="ABSENT">ABSENT</option>
              </select>
            </div>

          </div>

          <div className="meal-attendance-form-actions">

            <button
              type="submit"
              className="meal-attendance-primary-btn"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Attendance"
                  : "Add Attendance"}
            </button>

            {editingId && (
              <button
                type="button"
                className="meal-attendance-secondary-btn"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}

          </div>

        </form>
      </section>

      {/* Table */}
      <section className="meal-attendance-table-card">

        <div className="meal-attendance-card-header">

          <div>
            <h2>Attendance Records</h2>

            <p>
              {attendance.length} attendance
              {attendance.length !== 1 ? "s" : ""} recorded
            </p>
          </div>

        </div>

        {loading ? (
          <div className="meal-attendance-state">
            Loading attendance records...
          </div>
        ) : attendance.length === 0 ? (
          <div className="meal-attendance-state">
            No attendance records found.
          </div>
        ) : (
          <div className="meal-attendance-table-wrapper">

            <table className="meal-attendance-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Booking ID</th>
                  <th>Attendance Status</th>
                  <th>Served At</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {attendance.map((record) => (
                  <tr key={record.id}>

                    <td>{record.id}</td>

                    <td>
                      <strong>{record.bookingId}</strong>
                    </td>

                    <td>
                      <span
                        className={`meal-attendance-status ${
                          record.attendanceStatus === "SERVED"
                            ? "meal-attendance-status-served"
                            : "meal-attendance-status-absent"
                        }`}
                      >
                        {record.attendanceStatus}
                      </span>
                    </td>

                    <td>
                      {formatDateTime(record.servedAt)}
                    </td>

                    <td>
                      <div className="meal-attendance-actions">

                        <button
                          type="button"
                          className="meal-attendance-edit-btn"
                          onClick={() => handleEdit(record)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="meal-attendance-delete-btn"
                          onClick={() => handleDelete(record.id)}
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

export default MealAttendance;