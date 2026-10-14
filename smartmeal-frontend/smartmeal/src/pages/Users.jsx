import { useEffect, useState } from "react";
import axios from "axios";
import "./Users.css";

import API_URL from "../api";

function Users() {
  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "USER",
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

     const response = await axios.get(`${API_URL}/users`);
      setUsers(response.data);
    } catch (err) {
      console.error(err);
      setError("Unable to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
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
      username: "",
      password: "",
      role: "USER",
    });

    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const data = {
        username: formData.username,
        passwordHash: formData.password,
        role: formData.role,
      };

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, data);
      } else {
        await axios.post(API_URL, data);
      }

      await fetchUsers();
      resetForm();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
        "Unable to save user. Please check the entered information."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);

    setFormData({
      username: user.username ?? "",
      password: "",
      role: user.role ?? "USER",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await axios.delete(`${API_URL}/${id}`);

      await fetchUsers();

      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      console.error(err);
      setError("Unable to delete user.");
    }
  };

  return (
    <div className="users-page">

      <div className="users-header">
        <div>
          <h1>Users</h1>
          <p>Manage SmartMeal system users and their roles.</p>
        </div>

        <button
          type="button"
          className="users-refresh-btn"
          onClick={fetchUsers}
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="users-error">
          {error}
        </div>
      )}

      <section className="users-form-card">

        <div className="users-card-header">
          <div>
            <h2>
              {editingId ? "Edit User" : "Add User"}
            </h2>

            <p>
              {editingId
                ? "Update the user information below."
                : "Create a new SmartMeal system user."}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="users-form-grid">

            <div className="users-field">
              <label htmlFor="username">Username</label>

              <input
                id="username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
                required
              />
            </div>

            <div className="users-field">
              <label htmlFor="password">
                {editingId ? "New Password" : "Password"}
              </label>

              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={
                  editingId
                    ? "Enter new password"
                    : "Enter password"
                }
                required={!editingId}
              />
            </div>

            <div className="users-field">
              <label htmlFor="role">Role</label>

              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="ADMIN">ADMIN</option>
                <option value="USER">COOK</option>
                <option value="RESIDENT">RESIDENT</option>
              </select>
            </div>

          </div>

          <div className="users-form-actions">

            <button
              type="submit"
              className="users-primary-btn"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update User"
                  : "Add User"}
            </button>

            {editingId && (
              <button
                type="button"
                className="users-secondary-btn"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}

          </div>

        </form>

      </section>

      <section className="users-table-card">

        <div className="users-card-header">

          <div>
            <h2>User Records</h2>

            <p>
              {users.length} user
              {users.length !== 1 ? "s" : ""} registered
            </p>
          </div>

        </div>

        {loading ? (
          <div className="users-state">
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="users-state">
            No users found.
          </div>
        ) : (
          <div className="users-table-wrapper">

            <table className="users-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {users.map((user) => (
                  <tr key={user.id}>

                    <td>{user.id}</td>

                    <td>
                      <strong>{user.username}</strong>
                    </td>

                    <td>
                      <span
                        className={`user-role user-role-${String(
                          user.role
                        ).toLowerCase()}`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td>
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleString()
                        : "-"}
                    </td>

                    <td>
                      <div className="user-actions">

                        <button
                          type="button"
                          className="user-edit-btn"
                          onClick={() => handleEdit(user)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="user-delete-btn"
                          onClick={() => handleDelete(user.id)}
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

export default Users;