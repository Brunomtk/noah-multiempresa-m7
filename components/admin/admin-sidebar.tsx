import type React from "react"
import { Link } from "react-router-dom"
import "./admin-sidebar.css"

const AdminSidebar: React.FC = () => {
  return (
    <div className="admin-sidebar">
      <ul>
        <li>
          <Link to="/admin/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/admin/companies">Companies</Link>
        </li>
        <li>
          <Link to="/admin/users">Users</Link>
        </li>
        <li>
          <Link to="/admin/professionals">Professionals</Link>
        </li>
        <li>
          <Link to="/admin/teams">Teams</Link>
        </li>
        <li>
          <Link to="/admin/customers">Customers</Link>
        </li>
        <li>
          <Link to="/admin/plans">Plans</Link>
        </li>
        <li>
          <Link to="/admin/appointments">Appointments</Link>
        </li>
        <li>
          <Link to="/admin/check-in">Check-in</Link>
        </li>
        <li>
          <Link to="/admin/recurrences">Recurrences</Link>
        </li>
        <li>
          <Link to="/admin/gps-tracking">GPS Tracking</Link>
        </li>
        <li>
          <Link to="/admin/cancellations">Cancellations</Link>
        </li>
        <li>
          <Link to="/admin/reviews">Reviews</Link>
        </li>
        <li>
          <Link to="/admin/feedback">Feedback</Link>
        </li>
        <li>
          <Link to="/admin/notifications">Notifications</Link>
        </li>
        <li>
          <Link to="/admin/materials">Materials</Link>
        </li>
        <li>
          <Link to="/admin/payments">Payments</Link>
        </li>
        <li>
          <Link to="/admin/reports">Reports</Link>
        </li>
        <li>
          <Link to="/admin/settings">Settings</Link>
        </li>
      </ul>
    </div>
  )
}

export default AdminSidebar
