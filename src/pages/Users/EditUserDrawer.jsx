/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Switch } from "@headlessui/react";
import { FiEdit } from "react-icons/fi";
import {
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "@/api/usersApiSlice";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ROLES } from "@/config/roles";

export function EditUserDrawer({ selectedUser }) {
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [isActive, setIsActive] = useState(selectedUser?.active || false); // Local state for Switch

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: selectedUser,
  });

  const [updateUser, { isLoading, isSuccess, isError, error }] =
    useUpdateUserMutation();

  useEffect(() => {
    if (selectedUser) {
      reset({
        username: selectedUser.username,
        password: selectedUser.password,
        roles: selectedUser.roles,
        active: selectedUser.active,
      });
      setIsActive(selectedUser.active); // Sync local state with selectedUser
    }
  }, [selectedUser, reset]);

  const onSubmit = async (payload) => {
    try {
      await updateUser({
        ...selectedUser,
        username: payload.username,
        roles: payload.roles,
        active: isActive, // Use local state value
      });
      reset();
    } catch (err) {
      console.error("Failed to create user:", err);
    }
  };

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const handleDelete = async () => {
    if (
      confirm(
        `Are you sure you want to delete ticket: ${selectedUser.username}?`
      )
    ) {
      try {
        await deleteUser({ id: selectedUser.id }).unwrap();
        console.log("User deleted successfully");
      } catch (err) {
        console.error("Failed to delete user:", err);
      }
    }
  };

  const onStatusChange = (newStatus) => {
    setIsActive(newStatus); // Update local state
    setValue("active", newStatus); // Sync with form
  };

  return (
    <Sheet>
      <SheetTrigger className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        <FiEdit className="w-5 h-5" />
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit User</SheetTitle>
          <SheetDescription>
            Edit details for user{" "}
            <span className="font-bold capitalize">
              {" "}
              {selectedUser.username}
            </span>{" "}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              {...register("username")}
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">
                {errors.username.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password")}
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* roles */}
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Role
            </label>
            <select
              id="roles"
              {...register("roles")}
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              multiple={true}
              value={selectedRoles} // controlled component
              onChange={(e) =>
                setSelectedRoles(
                  Array.from(e.target.selectedOptions, (opt) => opt.value)
                )
              }
            >
              <option value="">Pilih Role</option>
              {Object.values(ROLES).map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Status
            </label>
            <Switch
              checked={isActive} // Use local state for checked value
              onChange={onStatusChange} // Call onStatusChange when toggled
              className="group relative inline-flex h-6 w-11 mt-1 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 data-[checked]:bg-indigo-600"
            >
              <span className="pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5" />
            </Switch>
          </div>

          {/* Delete */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-red-500 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              disabled={isDeleting} // Disable while deleting
            >
              {isDeleting ? "Deleting..." : "Delete User"}
            </button>
            <button
              type="submit"
              className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save User
            </button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
