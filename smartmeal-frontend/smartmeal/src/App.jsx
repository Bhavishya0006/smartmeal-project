import { BrowserRouter, Routes, Route, Link, NavLink, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import Cook from "./Cook";
import Resident from "./Resident";
import Login from "./Login";
import Residents from "./pages/Residents";
import Users from "./pages/Users";
import Rooms from "./pages/Rooms";
import Menu from "./pages/Menu";
import Inventory from "./pages/Inventory";
import FoodWaste from "./pages/FoodWaste";
import MealAttendance from "./pages/MealAttendance";
import MealBooking from "./pages/MealBooking";
import Feedback from "./pages/Feedback";

import "./App.css";
import "./Dashboard.css";

function AdminRoute({ children }) {
  const storedUser = localStorage.getItem("smartmealUser");

  if (!storedUser) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(storedUser);

  if (user.role !== "ADMIN") {
    if (user.role === "RESIDENT") {
      return <Navigate to="/resident" replace />;
    }

    if (user.role === "COOK") {
      return <Navigate to="/cook" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
}


function Dashboard() {

  const [residents, setResidents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [menus, setMenus] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [foodWaste, setFoodWaste] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [feedback, setFeedback] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {

    try {

      setLoading(true);

      const [
        residentsResponse,
        roomsResponse,
        menusResponse,
        inventoryResponse,
        foodWasteResponse,
        attendanceResponse,
        bookingsResponse,
        feedbackResponse
      ] = await Promise.all([

        axios.get("https://smartmeal-project.onrender.com/residents"),
        axios.get("https://smartmeal-project.onrender.com/rooms"),
        axios.get("https://smartmeal-project.onrender.com/menus"),
        axios.get("https://smartmeal-project.onrender.com/inventory"),
        axios.get("https://smartmeal-project.onrender.com/food-waste"),
        axios.get("https://smartmeal-project.onrender.com/meal-attendance"),
        axios.get("https://smartmeal-project.onrender.com/meal-bookings"),
        axios.get("https://smartmeal-project.onrender.com/feedback")

      ]);

      setResidents(residentsResponse.data);
      setRooms(roomsResponse.data);
      setMenus(menusResponse.data);
      setInventory(inventoryResponse.data);
      setFoodWaste(foodWasteResponse.data);
      setAttendance(attendanceResponse.data);
      setBookings(bookingsResponse.data);
      setFeedback(feedbackResponse.data);

    } catch (error) {

      console.error("Dashboard data loading failed:", error);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Low stock items
  const lowStockItems = inventory.filter(
    (item) =>
      Number(item.quantity) < Number(item.minimumStock)
  );

  // Today's date
  const today = new Date().toISOString().split("T")[0];

  // Today's menu
  const todayMenus = menus.filter(
    (menu) => menu.menuDate === today
  );

  // Food waste calculation
  const totalPrepared = foodWaste.reduce(
    (total, item) => total + Number(item.preparedMeals || 0),
    0
  );

  const totalLeftover = foodWaste.reduce(
    (total, item) => total + Number(item.leftoverMeals || 0),
    0
  );

  const wastePercentage =
    totalPrepared > 0
      ? ((totalLeftover / totalPrepared) * 100).toFixed(1)
      : 0;

  if (loading) {
    return (
      <div className="dashboard-loading">
        Loading SmartMeal Dashboard...
      </div>
    );
  }

  return (
    <div className="dashboard">

      {/* Header */}

      <div className="dashboard-header">

        <div>
          <h1>SmartMeal Dashboard</h1>

          <p>
            Food management and meal monitoring system
          </p>
        </div>

        <button
          className="dashboard-refresh"
          onClick={fetchDashboardData}
        >
          Refresh
        </button>

      </div>


      {/* Statistics Cards */}

      <div className="dashboard-stats">

        <div className="dashboard-card">
          <h3>Total Residents</h3>
          <div className="dashboard-number">
            {residents.length}
          </div>
          <p>Registered residents</p>
        </div>


        <div className="dashboard-card">
          <h3>Total Rooms</h3>
          <div className="dashboard-number">
            {rooms.length}
          </div>
          <p>Available room records</p>
        </div>


        <div className="dashboard-card">
          <h3>Meal Bookings</h3>
          <div className="dashboard-number">
            {bookings.length}
          </div>
          <p>Total bookings</p>
        </div>


        <div className="dashboard-card">
          <h3>Attendance</h3>
          <div className="dashboard-number">
            {attendance.length}
          </div>
          <p>Attendance records</p>
        </div>

      </div>


      {/* Second Row */}

      <div className="dashboard-stats">

        <div className="dashboard-card">
          <h3>Inventory Items</h3>
          <div className="dashboard-number">
            {inventory.length}
          </div>
          <p>Items in inventory</p>
        </div>


        <div className="dashboard-card">
          <h3>Low Stock</h3>
          <div className="dashboard-number dashboard-warning">
            {lowStockItems.length}
          </div>
          <p>Items below minimum stock</p>
        </div>


        <div className="dashboard-card">
          <h3>Feedback</h3>
          <div className="dashboard-number">
            {feedback.length}
          </div>
          <p>Total feedback records</p>
        </div>


        <div className="dashboard-card">
          <h3>Food Waste</h3>
          <div className="dashboard-number">
            {wastePercentage}%
          </div>
          <p>Overall leftover percentage</p>
        </div>

      </div>


      {/* Main Dashboard Sections */}

      <div className="dashboard-grid">


        {/* Today's Menu */}

        <div className="dashboard-section">

          <div className="dashboard-section-header">

            <h2>Today's Menu</h2>

            <Link to="/menu">
              View Menu
            </Link>

          </div>

          {todayMenus.length === 0 ? (

            <p className="dashboard-empty">
              No menu added for today.
            </p>

          ) : (

            <div className="dashboard-menu-list">

              {todayMenus.map((menu) => (

                <div
                  className="dashboard-menu-item"
                  key={menu.id}
                >

                  <strong>
                    {menu.mealType}
                  </strong>

                  <span>
                    {menu.foodItems}
                  </span>

                </div>

              ))}

            </div>

          )}

        </div>


        {/* Low Stock */}

        <div className="dashboard-section">

          <div className="dashboard-section-header">

            <h2>Low Stock Items</h2>

            <Link to="/inventory">
              View Inventory
            </Link>

          </div>

          {lowStockItems.length === 0 ? (

            <p className="dashboard-empty">
              No low stock items.
            </p>

          ) : (

            <div className="dashboard-list">

              {lowStockItems.slice(0, 5).map((item) => (

                <div
                  className="dashboard-list-item"
                  key={item.id}
                >

                  <span>
                    {item.itemName}
                  </span>

                  <span>
                    {item.quantity} {item.unit}
                  </span>

                </div>

              ))}

            </div>

          )}

        </div>


        {/* Food Waste */}

        <div className="dashboard-section">

          <div className="dashboard-section-header">

            <h2>Food Waste Summary</h2>

            <Link to="/food-waste">
              View Details
            </Link>

          </div>

          <div className="waste-summary">

            <div>
              <span>Total Prepared</span>
              <strong>{totalPrepared}</strong>
            </div>

            <div>
              <span>Total Leftover</span>
              <strong>{totalLeftover}</strong>
            </div>

            <div>
              <span>Waste Percentage</span>
              <strong>{wastePercentage}%</strong>
            </div>

          </div>

        </div>


        {/* Quick Actions */}

        <div className="dashboard-section">

          <div className="dashboard-section-header">

            <h2>Quick Actions</h2>

          </div>

          <div className="dashboard-actions">

            <Link to="/residents">Manage Residents</Link>

            <Link to="/menu">Manage Menu</Link>

            <Link to="/meal-bookings">Manage Bookings</Link>

            <Link to="/inventory">Manage Inventory</Link>

            <Link to="/feedback">View Feedback</Link>

          </div>

        </div>

      </div>

    </div>
  );
}


function App() {

  return (

    <BrowserRouter>

      <div className="app">

        
<aside className="sidebar">
  <h2>SmartMeal</h2>

  <nav>
    <NavLink
      to="/"
      className={({ isActive }) =>
        isActive ? "active-link" : ""
      }
    >
      Dashboard
    </NavLink>

    <NavLink
      to="/residents"
      className={({ isActive }) =>
        isActive ? "active-link" : ""
      }
    >
      Residents
    </NavLink>

    <NavLink
      to="/users"
      className={({ isActive }) =>
        isActive ? "active-link" : ""
      }
    >
      Users
    </NavLink>

    <NavLink
      to="/rooms"
      className={({ isActive }) =>
        isActive ? "active-link" : ""
      }
    >
      Rooms
    </NavLink>

    <NavLink
      to="/menu"
      className={({ isActive }) =>
        isActive ? "active-link" : ""
      }
    >
      Menu
    </NavLink>

    <NavLink
      to="/inventory"
      className={({ isActive }) =>
        isActive ? "active-link" : ""
      }
    >
      Inventory
    </NavLink>

    <NavLink
      to="/food-waste"
      className={({ isActive }) =>
        isActive ? "active-link" : ""
      }
    >
      Food Waste
    </NavLink>

    <NavLink
      to="/meal-attendance"
      className={({ isActive }) =>
        isActive ? "active-link" : ""
      }
    >
      Meal Attendance
    </NavLink>

    <NavLink
      to="/meal-bookings"
      className={({ isActive }) =>
        isActive ? "active-link" : ""
      }
    >
      Meal Bookings
    </NavLink>

    <NavLink
      to="/feedback"
      className={({ isActive }) =>
        isActive ? "active-link" : ""
      }
    >
      Feedback
    </NavLink>
  </nav>

  <div className="sidebar-user">
    <div className="sidebar-user-name">
    
    </div>

    <button
      className="logout-button"
      onClick={() => {
        localStorage.removeItem("smartmealUser");
        window.location.href = "/login";
      }}
    >
      Logout
    </button>
  </div>
</aside>



        <main className="main-content">

          <Routes>

            <Route path="/"element={<AdminRoute><Dashboard /></AdminRoute>}/>

            <Route
  path="/residents"
  element={
    <AdminRoute>
      <Residents />
    </AdminRoute>
  }
/>

           <Route
  path="/users"
  element={
    <AdminRoute>
      <Users />
    </AdminRoute>
  }
/>

           <Route
  path="/rooms"
  element={
    <AdminRoute>
      <Rooms />
    </AdminRoute>
  }
/>

            <Route
              path="/menu"
              element={
              <AdminRoute>
                <Menu />
              </AdminRoute>}
            />

            <Route
              path="/inventory"
              element={<AdminRoute><Inventory /></AdminRoute>}
            />

            <Route
              path="/food-waste"
              element={
              <AdminRoute><FoodWaste /></AdminRoute>}
            />

            <Route
              path="/meal-attendance"
              element={<AdminRoute><MealAttendance /></AdminRoute>}
            />

            <Route
              path="/meal-bookings"
              element={<AdminRoute><MealBooking /></AdminRoute>}
            />

            <Route
              path="/feedback"
              element={<AdminRoute><Feedback /></AdminRoute>}
            />

            <Route path="/login" element={<Login />} />

            <Route path="/resident" element={<Resident />} />

            <Route path="/cook" element={<Cook />} />

          </Routes>

        </main>

      </div>

    </BrowserRouter>
  );
}

export default App;