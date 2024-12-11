import { Navigate, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import Landing from "./components/Landing";
import MainLayout from "./components/MainLayout";

import { UsersList } from "./pages/Users/UsersList";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { TicketsList } from "./pages/Tickets/TicketsList";
import { Login } from "./pages/Login/Login";
import PersistLogin from "./components/PersistLogin";
import RBAC from "./components/RBAC";

export default function App() {
  return (
    <Routes>
      {/* path = "/" -> root URL */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="login" element={<Login />} />

        <Route element={<PersistLogin />}>
          <Route path="/app" element={<MainLayout />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard">
              <Route index element={<Dashboard />} />
            </Route>

            <Route element={<RBAC allowedRoles={["Manager", "Admin"]} />}>
              <Route path="users">
                <Route index element={<UsersList />} />
              </Route>
            </Route>

            <Route path="tickets">
              <Route index element={<TicketsList />} />
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
