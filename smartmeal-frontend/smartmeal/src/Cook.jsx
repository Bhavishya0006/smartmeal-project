import { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "./api";
import { useNavigate } from "react-router-dom";
import "./Cook.css";

const API = API_URL;
function Cook() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [menus, setMenus] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [foodWaste, setFoodWaste] = useState([]);
  const [inventory, setInventory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [wasteForm, setWasteForm] = useState({
    menuId: "",
    preparedMeals: "",
    servedMeals: "",
    leftoverMeals: "",
    wasteReason: "",
  });

  const getToday = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const today = getToday();

  useEffect(() => {
    const storedUser = localStorage.getItem("smartmealUser");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const loggedUser = JSON.parse(storedUser);

    if (loggedUser.role !== "COOK") {
      if (loggedUser.role === "ADMIN") {
        navigate("/");
      } else if (loggedUser.role === "RESIDENT") {
        navigate("/resident");
      } else {
        navigate("/login");
      }

      return;
    }

    setUser(loggedUser);
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        menuResponse,
        bookingResponse,
        attendanceResponse,
        wasteResponse,
        inventoryResponse,
      ] = await Promise.all([
       axios.get(`${API}/menus`),
axios.get(`${API}/meal-bookings`),
axios.get(`${API}/meal-attendance`),
axios.get(`${API}/food-waste`),
axios.get(`${API}/inventory`),
      ]);

      setMenus(menuResponse.data);
      setBookings(bookingResponse.data);
      setAttendance(attendanceResponse.data);
      setFoodWaste(wasteResponse.data);
      setInventory(inventoryResponse.data);
    } catch (err) {
      console.error(err);
      setError("Unable to load cook dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const getTodayMenus = () => {
    return menus.filter((menu) => menu.menuDate === today);
  };

  const getTodayBookings = () => {
    const todayMenuIds = getTodayMenus().map((menu) => menu.id);

    return bookings.filter(
      (booking) =>
        todayMenuIds.includes(booking.menuId) &&
        booking.bookingStatus === "YES"
    );
  };

  const getAttendanceForBooking = (bookingId) => {
    return attendance.find(
      (item) => Number(item.bookingId) === Number(bookingId)
    );
  };

  const getMenuName = (menuId) => {
    const menu = menus.find((item) => Number(item.id) === Number(menuId));

    if (!menu) {
      return `Menu #${menuId}`;
    }

    return `${menu.mealType} - ${menu.foodItems}`;
  };

  const markAttendance = async (booking, status) => {
    try {
      setError("");
      setMessage("");

      const existingAttendance = getAttendanceForBooking(booking.id);

      if (existingAttendance) {
        await axios.put(
          `${API}/meal-attendance/${existingAttendance.id}`,
          {
            bookingId: booking.id,
            attendanceStatus: status,
            servedAt:
              status === "SERVED"
                ? new Date().toISOString()
                : null,
          }
        );

        setMessage(`Booking #${booking.id} marked as ${status}.`);
      } else {
        await axios.post(`${API}/meal-attendance`, {
          bookingId: booking.id,
          attendanceStatus: status,
          servedAt:
            status === "SERVED"
              ? new Date().toISOString()
              : null,
        });

        setMessage(`Booking #${booking.id} marked as ${status}.`);
      }

      await loadData();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Unable to update attendance."
      );
    }
  };

  const handleWasteChange = (e) => {
    const { name, value } = e.target;

    setWasteForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitFoodWaste = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setMessage("");

      if (
        !wasteForm.menuId ||
        wasteForm.preparedMeals === "" ||
        wasteForm.servedMeals === "" ||
        wasteForm.leftoverMeals === ""
      ) {
        setError("Please fill all required food waste fields.");
        return;
      }

      await axios.post(`${API}/food-waste`, {
        menuId: Number(wasteForm.menuId),
        preparedMeals: Number(wasteForm.preparedMeals),
        servedMeals: Number(wasteForm.servedMeals),
        leftoverMeals: Number(wasteForm.leftoverMeals),
        wasteReason: wasteForm.wasteReason,
      });

      setMessage("Food waste record added successfully.");

      setWasteForm({
        menuId: "",
        preparedMeals: "",
        servedMeals: "",
        leftoverMeals: "",
        wasteReason: "",
      });

      await loadData();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Unable to record food waste."
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("smartmealUser");
    navigate("/login");
  };

  const todayMenus = getTodayMenus();
  const todayBookings = getTodayBookings();

  const servedCount = todayBookings.filter((booking) => {
    const record = getAttendanceForBooking(booking.id);
    return record?.attendanceStatus === "SERVED";
  }).length;

  const absentCount = todayBookings.filter((booking) => {
    const record = getAttendanceForBooking(booking.id);
    return record?.attendanceStatus === "ABSENT";
  }).length;

  const pendingCount =
    todayBookings.length - servedCount - absentCount;

  const lowStockItems = inventory.filter((item) => {
    const quantity = Number(item.quantity);
    const minimumStock = Number(item.minimumStock);

    return quantity <= minimumStock;
  });

  if (loading) {
    return (
      <div className="cook-loading">
        <div className="cook-loader"></div>
        <p>Loading Cook Portal...</p>
      </div>
    );
  }

  return (
    <div className="cook-page">

      {/* HEADER */}
      <header className="cook-header">
        <div>
          <h1>SmartMeal</h1>
          <p>Cook Portal</p>
        </div>

        <div className="cook-header-right">
          <div className="cook-user">
            <span className="cook-user-name">
              {user?.username || "Cook"}
            </span>
            <span className="cook-user-role">COOK</span>
          </div>

          <button
            className="cook-logout-btn"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="cook-container">

        {/* WELCOME */}
        <section className="cook-welcome">
          <div>
            <span className="cook-label">COOK DASHBOARD</span>
            <h2>Welcome, {user?.username || "Cook"}</h2>
            <p>
              Manage today's meals, attendance, food waste and
              inventory from one place.
            </p>
          </div>

          <div className="cook-date">
            <span>Today's Date</span>
            <strong>{today}</strong>
          </div>
        </section>

        {/* MESSAGES */}
        {message && (
          <div className="cook-message success">
            {message}
          </div>
        )}

        {error && (
          <div className="cook-message error">
            {error}
          </div>
        )}

        {/* STATS */}
        <section className="cook-stats">

          <div className="cook-stat-card">
            <div className="cook-stat-icon">M</div>
            <div>
              <span>Today's Menus</span>
              <strong>{todayMenus.length}</strong>
            </div>
          </div>

          <div className="cook-stat-card">
            <div className="cook-stat-icon">B</div>
            <div>
              <span>Today's Bookings</span>
              <strong>{todayBookings.length}</strong>
            </div>
          </div>

          <div className="cook-stat-card">
            <div className="cook-stat-icon">S</div>
            <div>
              <span>Served</span>
              <strong>{servedCount}</strong>
            </div>
          </div>

          <div className="cook-stat-card">
            <div className="cook-stat-icon">P</div>
            <div>
              <span>Pending</span>
              <strong>{pendingCount}</strong>
            </div>
          </div>

          <div className="cook-stat-card">
            <div className="cook-stat-icon">W</div>
            <div>
              <span>Low Stock</span>
              <strong>{lowStockItems.length}</strong>
            </div>
          </div>

        </section>

        {/* TODAY'S MENU */}
        <section className="cook-section">
          <div className="cook-section-header">
            <div>
              <h2>Today's Menu</h2>
              <p>Meals scheduled for today.</p>
            </div>
          </div>

          {todayMenus.length === 0 ? (
            <div className="cook-empty">
              No menu has been added for today.
            </div>
          ) : (
            <div className="cook-menu-grid">
              {todayMenus.map((menu) => (
                <div className="cook-menu-card" key={menu.id}>

                  <div className="cook-menu-top">
                    <span className="cook-meal-badge">
                      {menu.mealType}
                    </span>

                    <span className="cook-menu-id">
                      #{menu.id}
                    </span>
                  </div>

                  <h3>{menu.foodItems}</h3>

                  <p>
                    Menu Date: {menu.menuDate}
                  </p>

                  <div className="cook-menu-bookings">
                    <span>Bookings</span>

                    <strong>
                      {
                        todayBookings.filter(
                          (booking) =>
                            Number(booking.menuId) ===
                            Number(menu.id)
                        ).length
                      }
                    </strong>
                  </div>

                </div>
              ))}
            </div>
          )}
        </section>

        {/* BOOKINGS + ATTENDANCE */}
        <section className="cook-section">

          <div className="cook-section-header">
            <div>
              <h2>Today's Meal Bookings</h2>
              <p>Mark residents as served or absent.</p>
            </div>
          </div>

          {todayBookings.length === 0 ? (
            <div className="cook-empty">
              No meal bookings for today.
            </div>
          ) : (
            <div className="cook-table-wrapper">
              <table className="cook-table">

                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Resident ID</th>
                    <th>Menu</th>
                    <th>Booking</th>
                    <th>Attendance</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {todayBookings.map((booking) => {

                    const attendanceRecord =
                      getAttendanceForBooking(booking.id);

                    return (
                      <tr key={booking.id}>

                        <td>#{booking.id}</td>

                        <td>
                          Resident #{booking.residentId}
                        </td>

                        <td>
                          {getMenuName(booking.menuId)}
                        </td>

                        <td>
                          <span className="cook-status yes">
                            {booking.bookingStatus}
                          </span>
                        </td>

                        <td>
                          {attendanceRecord ? (
                            <span
                              className={`cook-status ${
                                attendanceRecord.attendanceStatus ===
                                "SERVED"
                                  ? "served"
                                  : "absent"
                              }`}
                            >
                              {attendanceRecord.attendanceStatus}
                            </span>
                          ) : (
                            <span className="cook-status pending">
                              PENDING
                            </span>
                          )}
                        </td>

                        <td>
                          <div className="cook-action-buttons">

                            <button
                              className="cook-btn served-btn"
                              onClick={() =>
                                markAttendance(
                                  booking,
                                  "SERVED"
                                )
                              }
                            >
                              Served
                            </button>

                            <button
                              className="cook-btn absent-btn"
                              onClick={() =>
                                markAttendance(
                                  booking,
                                  "ABSENT"
                                )
                              }
                            >
                              Absent
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

        {/* FOOD WASTE */}
        <section className="cook-section">

          <div className="cook-section-header">
            <div>
              <h2>Record Food Waste</h2>
              <p>
                Record prepared, served and leftover meals.
              </p>
            </div>
          </div>

          <form
            className="cook-form"
            onSubmit={submitFoodWaste}
          >

            <div className="cook-form-grid">

              <div className="cook-form-group">
                <label>Menu *</label>

                <select
                  name="menuId"
                  value={wasteForm.menuId}
                  onChange={handleWasteChange}
                  required
                >
                  <option value="">
                    Select Menu
                  </option>

                  {menus.map((menu) => (
                    <option
                      key={menu.id}
                      value={menu.id}
                    >
                      {menu.menuDate} - {menu.mealType} -{" "}
                      {menu.foodItems}
                    </option>
                  ))}
                </select>
              </div>

              <div className="cook-form-group">
                <label>Prepared Meals *</label>

                <input
                  type="number"
                  min="0"
                  name="preparedMeals"
                  value={wasteForm.preparedMeals}
                  onChange={handleWasteChange}
                  placeholder="Enter quantity"
                  required
                />
              </div>

              <div className="cook-form-group">
                <label>Served Meals *</label>

                <input
                  type="number"
                  min="0"
                  name="servedMeals"
                  value={wasteForm.servedMeals}
                  onChange={handleWasteChange}
                  placeholder="Enter quantity"
                  required
                />
              </div>

              <div className="cook-form-group">
                <label>Leftover Meals *</label>

                <input
                  type="number"
                  min="0"
                  name="leftoverMeals"
                  value={wasteForm.leftoverMeals}
                  onChange={handleWasteChange}
                  placeholder="Enter quantity"
                  required
                />
              </div>

            </div>

            <div className="cook-form-group full-width">
              <label>Waste Reason</label>

              <textarea
                name="wasteReason"
                value={wasteForm.wasteReason}
                onChange={handleWasteChange}
                placeholder="Enter reason for food waste"
                rows="4"
              />
            </div>

            <button
              type="submit"
              className="cook-primary-btn"
            >
              Record Food Waste
            </button>

          </form>
        </section>

        {/* FOOD WASTE HISTORY */}
        <section className="cook-section">

          <div className="cook-section-header">
            <div>
              <h2>Food Waste History</h2>
              <p>Previously recorded food waste.</p>
            </div>
          </div>

          {foodWaste.length === 0 ? (
            <div className="cook-empty">
              No food waste records available.
            </div>
          ) : (
            <div className="cook-table-wrapper">

              <table className="cook-table">

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Menu</th>
                    <th>Prepared</th>
                    <th>Served</th>
                    <th>Leftover</th>
                    <th>Reason</th>
                  </tr>
                </thead>

                <tbody>
                  {foodWaste.map((item) => (
                    <tr key={item.id}>

                      <td>#{item.id}</td>

                      <td>
                        {getMenuName(item.menuId)}
                      </td>

                      <td>{item.preparedMeals}</td>

                      <td>{item.servedMeals}</td>

                      <td>
                        <span className="leftover-value">
                          {item.leftoverMeals}
                        </span>
                      </td>

                      <td>
                        {item.wasteReason || "—"}
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>

            </div>
          )}

        </section>

        {/* INVENTORY */}
        <section className="cook-section">

          <div className="cook-section-header">
            <div>
              <h2>Inventory</h2>
              <p>
                Check available ingredients and stock levels.
              </p>
            </div>
          </div>

          {inventory.length === 0 ? (
            <div className="cook-empty">
              No inventory records available.
            </div>
          ) : (
            <div className="cook-table-wrapper">

              <table className="cook-table">

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Unit</th>
                    <th>Minimum Stock</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {inventory.map((item) => {

                    const isLow =
                      Number(item.quantity) <=
                      Number(item.minimumStock);

                    return (
                      <tr key={item.id}>

                        <td>#{item.id}</td>

                        <td>{item.itemName}</td>

                        <td>{item.quantity}</td>

                        <td>{item.unit}</td>

                        <td>{item.minimumStock}</td>

                        <td>
                          <span
                            className={`cook-stock-status ${
                              isLow
                                ? "stock-low"
                                : "stock-ok"
                            }`}
                          >
                            {isLow
                              ? "LOW STOCK"
                              : "AVAILABLE"}
                          </span>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>

              </table>

            </div>
          )}

        </section>

        {/* FOOTER */}
        <footer className="cook-footer">
          <p>
            SmartMeal Cook Portal
          </p>

          <span>
            Meal management and food waste monitoring system
          </span>
        </footer>

      </main>
    </div>
  );
}

export default Cook;