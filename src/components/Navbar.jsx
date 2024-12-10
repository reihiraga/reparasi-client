import { NavLink } from "react-router-dom";
import { Home, FileText, Users } from "lucide-react";

export const Navbar = () => {
  return (
    <nav className="w-64 min-h-screen p-4 text-white bg-gray-800">
      <div className="space-y-4">
        <NavLink
          to="/app/dashboard"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded ${
              isActive ? "bg-gray-700" : "hover:bg-gray-700"
            }`
          }
        >
          <Home className="w-5 h-5" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/app/tickets"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded ${
              isActive ? "bg-gray-700" : "hover:bg-gray-700"
            }`
          }
        >
          <FileText className="w-5 h-5" />
          <span>Tickets</span>
        </NavLink>
        <NavLink
          to="/app/users"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded ${
              isActive ? "bg-gray-700" : "hover:bg-gray-700"
            }`
          }
        >
          <Users className="w-5 h-5" />
          <span>Users</span>
        </NavLink>
      </div>
    </nav>
  );
};
