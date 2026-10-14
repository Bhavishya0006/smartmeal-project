import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Resident.css";
import API_URL from "./api";

const API = API_URL;

function Resident() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [resident, setResident] = useState(null);

  const [menus, setMenus] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [feedback, setFeedback] = useState([]);

  const [selectedMenu, setSelectedMenu] = useState("");
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const getToday = () => {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const today = getToday();

  useEffect(() => {
    const storedUser = localStorage.getItem("smartmealUser");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    try {
      const loggedUser = JSON.parse(storedUser);

      if (loggedUser.role !== "RESIDENT") {
        if (loggedUser.role === "ADMIN") {
          navigate("/");
        } else if (loggedUser.role === "COOK") {
          navigate("/cook");
        } else {
          navigate("/login");
        }

        return;
      }

      setUser(loggedUser);
      loadResidentData(loggedUser.id);
    } catch (err) {
      console.error(err);
      localStorage.removeItem("smartmealUser");
      navigate("/login");
    }
  }, [navigate]);

  const loadResidentData = async (userId) => {
    try {
      setLoading(true);
      setError("");

      const [
        residentsResponse,
        menusResponse,
        bookingsResponse,
        attendanceResponse,
        feedbackResponse,
      ] = await Promise.all([
        axios.get(`${API}/residents`),
        axios.get(`${API}/menus`),
        axios.get(`${API}/meal-bookings`),
        axios.get(`${API}/meal-attendance`),
        axios.get(`${API}/feedback`),
      ]);

      const allResidents = residentsResponse.data;
      const allMenus = menusResponse.data;
      const allBookings = bookingsResponse.data;
      const allAttendance = attendanceResponse.data;
      const allFeedback = feedbackResponse.data;

      const currentResident = allResidents.find(
        (item) => Number(item.userId) === Number(userId)
      );

      if (!currentResident) {
        setError("Resident profile not found.");
        setLoading(false);
        return;
      }

      setResident(currentResident);
      setMenus(allMenus);

      const myBookings = allBookings.filter(
        (item) =>
          Number(item.residentId) === Number(currentResident.id)
      );

      setBookings(myBookings);

      const myBookingIds = myBookings.map((item) => Number(item.id));

      const myAttendance = allAttendance.filter((item) =>
        myBookingIds.includes(Number(item.bookingId))
      );

      setAttendance(myAttendance);

      const myFeedback = allFeedback.filter(
        (item) =>
          Number(item.residentId) === Number(currentResident.id)
      );

      setFeedback(myFeedback);
    } catch (err) {
      console.error(err);
      setError("Unable to load resident data.");
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setMessage("");
    setError("");
  };

  const getBookingForMenu = (menuId) => {
    return bookings.find(
      (booking) => Number(booking.menuId) === Number(menuId)
    );
  };

  const handleBookMeal = async () => {
    if (!selectedMenu) {
      setError("Please select a meal first.");
      return;
    }

    const existingBooking = getBookingForMenu(selectedMenu);

    if (existingBooking?.bookingStatus === "YES") {
      setError("You have already booked this meal.");
      return;
    }

    try {
      setActionLoading(true);
      clearMessages();

      console.log("Booking data:", {
        residentId: resident.id,
        menuId: Number(selectedMenu),
        bookingStatus: "YES",
      });

      await axios.post(`${API}/meal-bookings`, {
        residentId: resident.id,
        menuId: Number(selectedMenu),
        bookingStatus: "YES",
      });

      setMessage("Meal booked successfully.");
      setSelectedMenu("");

      await loadResidentData(user.id);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to book the meal."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleNoMeal = () => {
    setSelectedMenu("");
    setMessage("Meal selection cleared.");
    setError("");
  };

  const handleCancelBooking = async (booking) => {
    try {
      setActionLoading(true);
      clearMessages();

      await axios.put(`${API}/meal-bookings/${booking.id}`, {
        residentId: resident.id,
        menuId: booking.menuId,
        bookingStatus: "NO",
      });

      setMessage("Meal booking cancelled.");
      await loadResidentData(user.id);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to cancel the booking."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleFeedback = async (event) => {
    event.preventDefault();

    if (!comment.trim()) {
      setError("Please enter a comment.");
      return;
    }

    try {
      setActionLoading(true);
      clearMessages();

      await axios.post(`${API}/feedback`, {
        residentId: resident.id,
        rating: Number(rating),
        comment: comment.trim(),
      });

      setMessage("Feedback submitted successfully.");
      setRating("5");
      setComment("");

      await loadResidentData(user.id);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to submit feedback."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("smartmealUser");
    navigate("/login");
  };

  const todayMenus = menus.filter(
    (menu) => menu.menuDate === today
  );

  const activeBookings = bookings.filter(
    (booking) => booking.bookingStatus === "YES"
  );

  const servedMeals = attendance.filter(
    (item) => item.attendanceStatus === "SERVED"
  );

  const getMealClass = (mealType) => {
    return mealType
      ? mealType.toLowerCase()
      : "";
  };

  if (loading) {
    return (
      <div className="resident-loading">
        <div className="resident-loader"></div>
        <p>Loading your SmartMeal dashboard...</p>
      </div>
    );
  }

  return (
    <div className="resident-page">

      {/* HEADER */}

      <header className="resident-header">

        <div className="resident-brand">
          <div className="resident-brand-logo">
            SM
          </div>

          <div>
            <h1>SmartMeal</h1>
            <p>Resident Portal</p>
          </div>
        </div>

        <div className="resident-header-right">

          <div className="resident-welcome">
            <strong>
              {resident?.name || user?.username}
            </strong>

            <span>Resident</span>
          </div>

          <button
            className="resident-logout"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>

      <main className="resident-content">

        {/* MESSAGES */}

        {message && (
          <div className="resident-success">
            <span>✓</span>
            {message}
          </div>
        )}

        {error && (
          <div className="resident-error">
            <span>!</span>
            {error}
          </div>
        )}

        {/* WELCOME */}

        <section className="resident-welcome-card">

          <div>

            <p className="welcome-small">
              Welcome back
            </p>

            <h2>
              {resident?.name || user?.username}
            </h2>

            <p>
              Manage your meals, bookings, attendance
              and feedback from one place.
            </p>

          </div>

          <div className="resident-profile-mini">

            <span>Room</span>

            <strong>
              {resident?.roomId || "-"}
            </strong>

          </div>

        </section>

        {/* STATISTICS */}

        <section className="resident-stats">

          <div className="resident-stat-card">

            <div className="stat-icon">
              M
            </div>

            <div>
              <span>Today's Menu</span>
              <strong>{todayMenus.length}</strong>
            </div>

          </div>

          <div className="resident-stat-card">

            <div className="stat-icon">
              B
            </div>

            <div>
              <span>Active Bookings</span>
              <strong>{activeBookings.length}</strong>
            </div>

          </div>

          <div className="resident-stat-card">

            <div className="stat-icon">
              A
            </div>

            <div>
              <span>Meals Served</span>
              <strong>{servedMeals.length}</strong>
            </div>

          </div>

          <div className="resident-stat-card">

            <div className="stat-icon">
              F
            </div>

            <div>
              <span>Feedback Given</span>
              <strong>{feedback.length}</strong>
            </div>

          </div>

        </section>

        {/* TODAY'S MENU */}

        <section className="resident-section">

          <div className="resident-section-header">

            <div>
              <h2>Today's Menu</h2>
              <p>
                Meals available for today
              </p>
            </div>

          </div>

          {todayMenus.length === 0 ? (

            <div className="resident-empty">
              <div className="empty-icon">M</div>
              <h3>No menu available</h3>
              <p>
                No menu has been added for today.
              </p>
            </div>

          ) : (

            <div className="menu-grid">

              {todayMenus.map((menu) => {

                const existingBooking =
                  getBookingForMenu(menu.id);

                const isBooked =
                  existingBooking?.bookingStatus === "YES";

                return (

                  <div
                    className={`menu-card ${
                      isBooked ? "menu-card-booked" : ""
                    }`}
                    key={menu.id}
                  >

                    <div className="menu-card-top">

                      <span
                        className={`meal-badge ${getMealClass(
                          menu.mealType
                        )}`}
                      >
                        {menu.mealType}
                      </span>

                      {isBooked && (
                        <span className="booked-label">
                          Booked
                        </span>
                      )}

                    </div>

                    <h3>
                      {menu.foodItems}
                    </h3>

                    <p className="menu-date">
                      {menu.menuDate}
                    </p>

                    {isBooked ? (

                      <button
                        className="booked-button"
                        disabled
                      >
                        Already Booked
                      </button>

                    ) : (

                      <button
                        className="primary-button"
                        onClick={() =>
                          setSelectedMenu(String(menu.id))
                        }
                      >
                        Select Meal
                      </button>

                    )}

                  </div>

                );

              })}

            </div>

          )}

        </section>

        {/* BOOK MEAL */}

        <section className="resident-section">

          <div className="resident-section-header">

            <div>
              <h2>Book a Meal</h2>
              <p>
                Select a menu and confirm whether you want
                the meal.
              </p>
            </div>

          </div>

          <div className="booking-box">

            <div className="booking-select-area">

              <label htmlFor="meal-select">
                Select Menu
              </label>

              <select
                id="meal-select"
                value={selectedMenu}
                onChange={(event) =>
                  setSelectedMenu(event.target.value)
                }
              >

                <option value="">
                  Select a meal
                </option>

                {menus.map((menu) => {

                  const existingBooking =
                    getBookingForMenu(menu.id);

                  const isBooked =
                    existingBooking?.bookingStatus === "YES";

                  return (
                    <option
                      key={menu.id}
                      value={menu.id}
                      disabled={isBooked}
                    >
                      {menu.menuDate} - {menu.mealType}
                      {isBooked ? " - Already Booked" : ""}
                    </option>
                  );

                })}

              </select>

            </div>

            <div className="booking-choice">

              <button
                type="button"
                className="booking-yes-button"
                onClick={handleBookMeal}
                disabled={
                  !selectedMenu || actionLoading
                }
              >
                {actionLoading ? "Processing..." : "YES"}
              </button>

              <button
                type="button"
                className="booking-no-button"
                onClick={handleNoMeal}
                disabled={actionLoading}
              >
                NO
              </button>

            </div>

          </div>

        </section>

        {/* MY BOOKINGS */}

        <section className="resident-section">

          <div className="resident-section-header">

            <div>
              <h2>My Bookings</h2>
              <p>
                Your meal booking history
              </p>
            </div>

          </div>

          {bookings.length === 0 ? (

            <div className="resident-empty">
              <div className="empty-icon">B</div>
              <h3>No bookings yet</h3>
              <p>
                Your meal bookings will appear here.
              </p>
            </div>

          ) : (

            <div className="resident-table-wrapper">

              <table className="resident-table">

                <thead>

                  <tr>
                    <th>ID</th>
                    <th>Menu ID</th>
                    <th>Status</th>
                    <th>Booked At</th>
                    <th>Action</th>
                  </tr>

                </thead>

                <tbody>

                  {bookings.map((booking) => (

                    <tr key={booking.id}>

                      <td>
                        #{booking.id}
                      </td>

                      <td>
                        {booking.menuId}
                      </td>

                      <td>

                        <span
                          className={`status-badge ${
                            booking.bookingStatus === "YES"
                              ? "yes"
                              : "no"
                          }`}
                        >
                          {booking.bookingStatus}
                        </span>

                      </td>

                      <td>
                        {booking.bookedAt
                          ? new Date(
                              booking.bookedAt
                            ).toLocaleString()
                          : "-"}
                      </td>

                      <td>

                        {booking.bookingStatus === "YES" ? (

                          <button
                            className="cancel-button"
                            onClick={() =>
                              handleCancelBooking(booking)
                            }
                            disabled={actionLoading}
                          >
                            Cancel
                          </button>

                        ) : (

                          <span className="not-active">
                            Not Active
                          </span>

                        )}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>

        {/* ATTENDANCE */}

        <section className="resident-section">

          <div className="resident-section-header">

            <div>
              <h2>Meal Attendance</h2>
              <p>
                Your meal serving history
              </p>
            </div>

          </div>

          {attendance.length === 0 ? (

            <div className="resident-empty">
              <div className="empty-icon">A</div>
              <h3>No attendance records</h3>
              <p>
                Your meal attendance will appear here.
              </p>
            </div>

          ) : (

            <div className="resident-table-wrapper">

              <table className="resident-table">

                <thead>

                  <tr>
                    <th>ID</th>
                    <th>Booking ID</th>
                    <th>Status</th>
                    <th>Served At</th>
                  </tr>

                </thead>

                <tbody>

                  {attendance.map((item) => (

                    <tr key={item.id}>

                      <td>
                        #{item.id}
                      </td>

                      <td>
                        {item.bookingId}
                      </td>

                      <td>

                        <span
                          className={`status-badge ${
                            item.attendanceStatus === "SERVED"
                              ? "served"
                              : "absent"
                          }`}
                        >
                          {item.attendanceStatus}
                        </span>

                      </td>

                      <td>
                        {item.servedAt
                          ? new Date(
                              item.servedAt
                            ).toLocaleString()
                          : "-"}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>

        {/* FEEDBACK */}

        <section className="resident-section">

          <div className="resident-section-header">

            <div>
              <h2>Give Feedback</h2>
              <p>
                Tell us about your meal experience
              </p>
            </div>

          </div>

          <form
            className="feedback-form"
            onSubmit={handleFeedback}
          >

            <div className="feedback-field">

              <label htmlFor="rating">
                Rating
              </label>

              <select
                id="rating"
                value={rating}
                onChange={(event) =>
                  setRating(event.target.value)
                }
              >

                <option value="5">
                  5 - Excellent
                </option>

                <option value="4">
                  4 - Very Good
                </option>

                <option value="3">
                  3 - Good
                </option>

                <option value="2">
                  2 - Average
                </option>

                <option value="1">
                  1 - Poor
                </option>

              </select>

            </div>

            <div className="feedback-field">

              <label htmlFor="comment">
                Comment
              </label>

              <textarea
                id="comment"
                value={comment}
                onChange={(event) =>
                  setComment(event.target.value)
                }
                placeholder="Write your feedback..."
                rows="5"
              />

            </div>

            <button
              type="submit"
              className="primary-button feedback-submit"
              disabled={actionLoading}
            >
              {actionLoading
                ? "Submitting..."
                : "Submit Feedback"}
            </button>

          </form>

        </section>

        {/* MY FEEDBACK */}

        <section className="resident-section">

          <div className="resident-section-header">

            <div>
              <h2>My Feedback</h2>
              <p>
                Feedback you have submitted
              </p>
            </div>

          </div>

          {feedback.length === 0 ? (

            <div className="resident-empty">
              <div className="empty-icon">F</div>
              <h3>No feedback submitted</h3>
              <p>
                Your submitted feedback will appear here.
              </p>
            </div>

          ) : (

            <div className="feedback-list">

              {feedback.map((item) => (

                <div
                  className="feedback-card"
                  key={item.id}
                >

                  <div className="feedback-card-header">

                    <span className="rating-badge">
                      {item.rating}/5
                    </span>

                    <span className="feedback-date">
                      {item.createdAt
                        ? new Date(
                            item.createdAt
                          ).toLocaleString()
                        : "-"}
                    </span>

                  </div>

                  <p>
                    {item.comment}
                  </p>

                </div>

              ))}

            </div>

          )}

        </section>

        {/* PROFILE */}

        <section className="resident-section">

          <div className="resident-section-header">

            <div>
              <h2>My Profile</h2>
              <p>
                Your resident information
              </p>
            </div>

          </div>

          <div className="profile-grid">

            <div className="profile-item">
              <span>Name</span>
              <strong>
                {resident?.name || "-"}
              </strong>
            </div>

            <div className="profile-item">
              <span>Resident ID</span>
              <strong>
                {resident?.residentId || "-"}
              </strong>
            </div>

            <div className="profile-item">
              <span>Email</span>
              <strong>
                {resident?.email || "-"}
              </strong>
            </div>

            <div className="profile-item">
              <span>Phone</span>
              <strong>
                {resident?.phone || "-"}
              </strong>
            </div>

            <div className="profile-item">
              <span>Room</span>
              <strong>
                {resident?.roomId || "-"}
              </strong>
            </div>

            <div className="profile-item">
              <span>Status</span>
              <strong>
                {resident?.status || "-"}
              </strong>
            </div>

          </div>

        </section>

      </main>

      <footer className="resident-footer">
        SmartMeal Management System
      </footer>

    </div>
  );
}

export default Resident;