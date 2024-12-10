/* eslint-disable no-unused-vars */
import { SyncLoader } from "react-spinners";
import { useGetAllUsersQuery } from "@/api/usersApiSlice";
import User from "./User";
import { CreateUserDrawer } from "./CreateUserDrawer";

export const UsersList = () => {
  const {
    data: usersData,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetAllUsersQuery("usersList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let list;

  if (isLoading) {
    list = (
      <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
        <SyncLoader color="#4f46e5" size={30} />
      </div>
    );
  }

  if (isSuccess) {
    const { ids } = usersData;
    const tableBody =
      ids?.length && ids.map((userId) => <User key={userId} userId={userId} />);

    list = (
      <div>
        <div className="mb-8 sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Users</h1>
            <p>Mengelola akses dan data karyawan</p>
          </div>
          {/* Sebuah Drawer create User */}
          <CreateUserDrawer />
        </div>

        <div className="overflow-hidden bg-white rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  User
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Role
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tableBody}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return list;
};
