import { useEffect, useState } from "react";
import axios from "axios";
import "./Rooms.css";

const API_URL = "https://smartmeal-project.onrender.com/rooms";

function Rooms() {
  const [rooms, setRooms] = useState([]);

  const [formData, setFormData] = useState({
    roomNumber: "",
    floor: "",
    capacity: "",
    status: "AVAILABLE",
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API_URL);
      setRooms(response.data);
    } catch (err) {
      console.error(err);
      setError("Unable to load rooms.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
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
      roomNumber: "",
      floor: "",
      capacity: "",
      status: "AVAILABLE",
    });

    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const data = {
        roomNumber: formData.roomNumber,
        floor: Number(formData.floor),
        capacity: Number(formData.capacity),
        status: formData.status,
      };

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, data);
      } else {
        await axios.post(API_URL, data);
      }

      await fetchRooms();
      resetForm();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
        "Unable to save room. Please check the entered information."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (room) => {
    setEditingId(room.id);

    setFormData({
      roomNumber: room.roomNumber ?? "",
      floor: room.floor ?? "",
      capacity: room.capacity ?? "",
      status: room.status ?? "AVAILABLE",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this room?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await axios.delete(`${API_URL}/${id}`);

      await fetchRooms();

      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      console.error(err);
      setError("Unable to delete room.");
    }
  };

  return (
    <div className="rooms-page">

      <div className="rooms-header">

        <div>
          <h1>Rooms</h1>
          <p>Manage hostel rooms, capacity and availability.</p>
        </div>

        <button
          type="button"
          className="rooms-refresh-btn"
          onClick={fetchRooms}
        >
          Refresh
        </button>

      </div>

      {error && (
        <div className="rooms-error">
          {error}
        </div>
      )}

      <section className="rooms-form-card">

        <div className="rooms-card-header">

          <div>
            <h2>
              {editingId ? "Edit Room" : "Add Room"}
            </h2>

            <p>
              {editingId
                ? "Update the room information below."
                : "Enter the details to create a new room."}
            </p>
          </div>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="rooms-form-grid">

            <div className="rooms-field">
              <label htmlFor="roomNumber">
                Room Number
              </label>

              <input
                id="roomNumber"
                type="text"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleChange}
                placeholder="Example: A-101"
                required
              />
            </div>

            <div className="rooms-field">
              <label htmlFor="floor">
                Floor
              </label>

              <input
                id="floor"
                type="number"
                name="floor"
                value={formData.floor}
                onChange={handleChange}
                placeholder="Enter floor"
                min="0"
                required
              />
            </div>

            <div className="rooms-field">
              <label htmlFor="capacity">
                Capacity
              </label>

              <input
                id="capacity"
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="Enter capacity"
                min="0"
                required
              />
            </div>

            <div className="rooms-field">
              <label htmlFor="status">
                Status
              </label>

              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="OCCUPIED">OCCUPIED</option>
                <option value="MAINTENANCE">MAINTENANCE</option>
              </select>
            </div>

          </div>

          <div className="rooms-form-actions">

            <button
              type="submit"
              className="rooms-primary-btn"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Room"
                  : "Add Room"}
            </button>

            {editingId && (
              <button
                type="button"
                className="rooms-secondary-btn"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}

          </div>

        </form>

      </section>

      <section className="rooms-table-card">

        <div className="rooms-card-header">

          <div>
            <h2>Room Records</h2>

            <p>
              {rooms.length} room
              {rooms.length !== 1 ? "s" : ""} registered
            </p>
          </div>

        </div>

        {loading ? (
          <div className="rooms-state">
            Loading rooms...
          </div>
        ) : rooms.length === 0 ? (
          <div className="rooms-state">
            No rooms found.
          </div>
        ) : (
          <div className="rooms-table-wrapper">

            <table className="rooms-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Room Number</th>
                  <th>Floor</th>
                  <th>Capacity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {rooms.map((room) => (
                  <tr key={room.id}>

                    <td>{room.id}</td>

                    <td>
                      <strong>{room.roomNumber}</strong>
                    </td>

                    <td>{room.floor}</td>

                    <td>{room.capacity}</td>

                    <td>
                      <span
                        className={`room-status room-status-${String(
                          room.status
                        ).toLowerCase()}`}
                      >
                        {room.status}
                      </span>
                    </td>

                    <td>
                      <div className="room-actions">

                        <button
                          type="button"
                          className="room-edit-btn"
                          onClick={() => handleEdit(room)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="room-delete-btn"
                          onClick={() => handleDelete(room.id)}
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

export default Rooms;