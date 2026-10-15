import { useEffect, useState } from "react";
import axios from "axios";
import "./MealBooking.css";

import API_URL from "../api";

function MealBooking() {
  const [bookings, setBookings] = useState([]);

  const [formData, setFormData] = useState({
    residentId: "",
    menuId: "",
    bookingStatus: "BOOKED",
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${API_URL}/meal-boookings`);
      setBookings(response.data);
    } catch (err) {
      console.error(err);
      setError("Unable to load meal booking records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
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
      residentId: "",
      menuId: "",
      bookingStatus: "BOOKED",
    });

    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const data = {
        residentId: Number(formData.residentId),
        menuId: Number(formData.menuId),
        bookingStatus: formData.bookingStatus,
      };

      if (editingId) {
        await axios.put(`${API_URL}/meal-bookings/${editingId}`, data);
      } else {
        await axios.post(`${API_URL}/meal-bookings`, data);
      }

      await fetchBookings();
      resetForm();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to save booking. Please check the entered information."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (booking) => {
    setEditingId(booking.id);

    setFormData({
      residentId: booking.residentId ?? "",
      menuId: booking.menuId ?? "",
      bookingStatus: booking.bookingStatus ?? "BOOKED",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this meal booking?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await axios.delete(`${API_URL}/meal-bookings/${id}`);

      await fetchBookings();

      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      console.error(err);
      setError("Unable to delete meal booking.");
    }
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) {
      return "-";
    }

    return new Date(dateTime).toLocaleString();
  };

  return (
    <div className="meal-booking-page">

      {/* Header */}
      <div className="meal-booking-header">
        <div>
          <h1>Meal Bookings</h1>
          <p>Manage resident meal bookings and booking status.</p>
        </div>

        <button
          type="button"
          className="meal-booking-refresh-btn"
          onClick={fetchBookings}
        >
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="meal-booking-error">
          {error}
        </div>
      )}

      {/* Form */}
      <section className="meal-booking-form-card">

        <div className="meal-booking-card-header">
          <div>
            <h2>
              {editingId
                ? "Edit Meal Booking"
                : "Add Meal Booking"}
            </h2>

            <p>
              {editingId
                ? "Update the booking information below."
                : "Create a meal booking for a resident."}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="meal-booking-form-grid">

            {/* Resident ID */}
            <div className="meal-booking-field">
              <label htmlFor="residentId">
                Resident ID
              </label>

              <input
                id="residentId"
                type="number"
                name="residentId"
                value={formData.residentId}
                onChange={handleChange}
                placeholder="Enter resident ID"
                min="1"
                required
              />
            </div>

            {/* Menu ID */}
            <div className="meal-booking-field">
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

            {/* Booking Status */}
            <div className="meal-booking-field">
              <label htmlFor="bookingStatus">
                Booking Status
              </label>

              <select
                id="bookingStatus"
                name="bookingStatus"
                value={formData.bookingStatus}
                onChange={handleChange}
              >
                <option value="BOOKED">BOOKED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

          </div>

          <div className="meal-booking-form-actions">

            <button
              type="submit"
              className="meal-booking-primary-btn"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Booking"
                  : "Add Booking"}
            </button>

            {editingId && (
              <button
                type="button"
                className="meal-booking-secondary-btn"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}

          </div>

        </form>
      </section>

      {/* Table */}
      <section className="meal-booking-table-card">

        <div className="meal-booking-card-header">

          <div>
            <h2>Meal Booking Records</h2>

            <p>
              {bookings.length} booking
              {bookings.length !== 1 ? "s" : ""} registered
            </p>
          </div>

        </div>

        {loading ? (
          <div className="meal-booking-state">
            Loading meal bookings...
          </div>
        ) : bookings.length === 0 ? (
          <div className="meal-booking-state">
            No meal booking records found.
          </div>
        ) : (
          <div className="meal-booking-table-wrapper">

            <table className="meal-booking-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Resident ID</th>
                  <th>Menu ID</th>
                  <th>Booking Status</th>
                  <th>Booked At</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {bookings.map((booking) => (
                  <tr key={booking.id}>

                    <td>{booking.id}</td>

                    <td>
                      <strong>{booking.residentId}</strong>
                    </td>

                    <td>
                      <strong>{booking.menuId}</strong>
                    </td>

                    <td>
                      <span
                        className={`meal-booking-status ${
                          booking.bookingStatus === "BOOKED"
                            ? "meal-booking-status-booked"
                            : "meal-booking-status-cancelled"
                        }`}
                      >
                        {booking.bookingStatus}
                      </span>
                    </td>

                    <td>
                      {formatDateTime(booking.bookedAt)}
                    </td>

                    <td>

                      <div className="meal-booking-actions">

                        <button
                          type="button"
                          className="meal-booking-edit-btn"
                          onClick={() => handleEdit(booking)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="meal-booking-delete-btn"
                          onClick={() =>
                            handleDelete(booking.id)
                          }
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

export default MealBooking;