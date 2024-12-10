import { LogOut, User as UserIcon } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="px-4 py-4 mx-auto sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Toko Reparasi APL
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <UserIcon className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-600">{/* Username */}</span>
              <span className="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded">
                {/* Role */}
              </span>
            </div>
            <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
