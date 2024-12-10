import { Outlet } from "react-router-dom";

import { Header } from "./Header";
import { Navbar } from "./Navbar";

const MainLayout = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex">
        <Navbar />
        <main className="flex-1 p-6 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
