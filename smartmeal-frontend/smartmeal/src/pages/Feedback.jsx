import { useEffect, useState } from "react";
import axios from "axios";
import "./Feedback.css";

import API_URL from "../api";
function Feedback() {
  const [feedbackList, setFeedbackList] = useState([]);

  const [formData, setFormData] = useState({
    residentId: "",
    rating: "5",
    comment: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Fetch feedback
  const fetchFeedback = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API_URL);
      setFeedbackList(response.data);
    } catch (err) {
      console.error(err);
      setError("Unable to load feedback records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  // Handle input
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      residentId: "",
      rating: "5",
      comment: "",
    });

    setEditingId(null);
  };

  // Add / Update
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const data = {
        residentId: Number(formData.residentId),
        rating: Number(formData.rating),
        comment: formData.comment,
      };

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, data);
      } else {
        await axios.post(API_URL, data);
      }

      await fetchFeedback();
      resetForm();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to save feedback. Please check the entered information."
      );
    } finally {
      setSaving(false);
    }
  };

  // Edit
  const handleEdit = (feedback) => {
    setEditingId(feedback.id);

    setFormData({
      residentId: feedback.residentId ?? "",
      rating: feedback.rating ?? "5",
      comment: feedback.comment ?? "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Delete
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this feedback?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await axios.delete(`${API_URL}/${id}`);

      await fetchFeedback();

      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      console.error(err);
      setError("Unable to delete feedback.");
    }
  };

  // Format date
  const formatDateTime = (dateTime) => {
    if (!dateTime) {
      return "-";
    }

    return new Date(dateTime).toLocaleString();
  };

  // Rating label
  const getRatingLabel = (rating) => {
    switch (Number(rating)) {
      case 5:
        return "Excellent";

      case 4:
        return "Very Good";

      case 3:
        return "Good";

      case 2:
        return "Poor";

      case 1:
        return "Very Poor";

      default:
        return "-";
    }
  };

  return (
    <div className="feedback-page">

      {/* Header */}
      <div className="feedback-header">
        <div>
          <h1>Feedback</h1>
          <p>Manage resident feedback and meal ratings.</p>
        </div>

        <button
          type="button"
          className="feedback-refresh-btn"
          onClick={fetchFeedback}
        >
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="feedback-error">
          {error}
        </div>
      )}

      {/* Form */}
      <section className="feedback-form-card">

        <div className="feedback-card-header">
          <div>
            <h2>
              {editingId ? "Edit Feedback" : "Add Feedback"}
            </h2>

            <p>
              {editingId
                ? "Update the feedback information below."
                : "Record feedback submitted by a resident."}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="feedback-form-grid">

            {/* Resident ID */}
            <div className="feedback-field">
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

            {/* Rating */}
            <div className="feedback-field">
              <label htmlFor="rating">
                Rating
              </label>

              <select
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                required
              >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Very Good</option>
                <option value="3">3 - Good</option>
                <option value="2">2 - Poor</option>
                <option value="1">1 - Very Poor</option>
              </select>
            </div>

            {/* Comment */}
            <div className="feedback-field feedback-comment-field">
              <label htmlFor="comment">
                Comment
              </label>

              <textarea
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                placeholder="Enter resident feedback"
                rows="4"
              />
            </div>

          </div>

          <div className="feedback-form-actions">

            <button
              type="submit"
              className="feedback-primary-btn"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Feedback"
                  : "Add Feedback"}
            </button>

            {editingId && (
              <button
                type="button"
                className="feedback-secondary-btn"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}

          </div>

        </form>
      </section>

      {/* Table */}
      <section className="feedback-table-card">

        <div className="feedback-card-header">
          <div>
            <h2>Feedback Records</h2>

            <p>
              {feedbackList.length} feedback
              {feedbackList.length !== 1 ? "s" : ""} registered
            </p>
          </div>
        </div>

        {loading ? (
          <div className="feedback-state">
            Loading feedback...
          </div>
        ) : feedbackList.length === 0 ? (
          <div className="feedback-state">
            No feedback records found.
          </div>
        ) : (
          <div className="feedback-table-wrapper">

            <table className="feedback-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Resident ID</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {feedbackList.map((feedback) => (
                  <tr key={feedback.id}>

                    <td>{feedback.id}</td>

                    <td>
                      <strong>{feedback.residentId}</strong>
                    </td>

                    <td>
                      <div className="feedback-rating-cell">

                        <span className="feedback-rating-badge">
                          {feedback.rating}/5
                        </span>

                        <span className="feedback-rating-label">
                          {getRatingLabel(feedback.rating)}
                        </span>

                      </div>
                    </td>

                    <td className="feedback-comment-cell">
                      {feedback.comment || "-"}
                    </td>

                    <td>
                      {formatDateTime(feedback.createdAt)}
                    </td>

                    <td>
                      <div className="feedback-actions">

                        <button
                          type="button"
                          className="feedback-edit-btn"
                          onClick={() => handleEdit(feedback)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="feedback-delete-btn"
                          onClick={() =>
                            handleDelete(feedback.id)
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

export default Feedback;