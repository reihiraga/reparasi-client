/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Switch } from "@headlessui/react";
import { FiEdit } from "react-icons/fi";
import {
  useUpdateTicketMutation,
  useDeleteTicketMutation,
} from "@/api/ticketsApiSlice";
import { useGetAllUsersQuery } from "@/api/usersApiSlice";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function EditTicketDrawer({ selectedTicket }) {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { data: usersData } = useGetAllUsersQuery("usersList");
  const users = usersData ? Object.values(usersData.entities) : [];
  const [isFixed, setIsFixed] = useState(selectedTicket?.isFixed || false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      selectedTicket,
    },
  });

  const [updateTicket, { isLoading, isSuccess, isError, error }] =
    useUpdateTicketMutation();

  useEffect(() => {
    if (selectedTicket) {
      reset({
        title: selectedTicket.title,
        desc: selectedTicket.desc,
        user: selectedTicket.user,
        isFixed: selectedTicket.isFixed,
        username: selectedTicket.username,
      });
      setIsFixed(selectedTicket.isFixed);
      setSelectedUsers([selectedTicket.user]);
    }
  }, [selectedTicket, reset]);

  const onSubmit = async (payload) => {
    try {
      // Map selected user IDs to usernames
      const selectedUsernames = selectedUsers
        .map((userId) => {
          const user = users.find((u) => u.id === userId);
          return user ? user.username : null;
        })
        .filter(Boolean);

      const requestBody = {
        ...selectedTicket,
        title: payload.title,
        desc: payload.desc,
        user: selectedUsers.join(","),
        isFixed,
        username: selectedUsernames.join(","),
      };

      console.log("Payload being sent:", requestBody);
      await updateTicket(requestBody);
      reset();
    } catch (err) {
      console.error("Failed to update ticket:", err);
    }
  };

  const [deleteUser, { isLoading: isDeleting }] = useDeleteTicketMutation();

  const handleDelete = async () => {
    if (
      confirm(
        `Are you sure you want to delete ticket: ${selectedTicket.title}?`
      )
    ) {
      try {
        await deleteUser({ id: selectedTicket.id }).unwrap();
        console.log("Ticket deleted successfully");
      } catch (err) {
        console.error("Failed to delete ticket:", err);
      }
    }
  };

  const onStatusChange = (newFixed) => {
    setIsFixed(newFixed);
    setValue("active", newFixed);
  };

  return (
    <Sheet>
      <SheetTrigger className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        <FiEdit className="w-5 h-5" />
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Ticket</SheetTitle>
          <SheetDescription>
            Edit details for ticket{" "}
            <span className="font-bold capitalize">{selectedTicket.title}</span>
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              {...register("title")}
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              type="text"
              id="description"
              {...register("desc")}
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Username */}
          <div>
            <label
              htmlFor="user"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <select
              type="text"
              id="user"
              {...register("user")}
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={selectedUsers.join(",")}
              onChange={(e) => {
                const value = e.target.value.split(",");
                setSelectedUsers(value);
              }}
            >
              <option value="">Pilih User</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>

          {/* Is Fixed */}
          <div>
            <label
              htmlFor="fixed"
              className="block text-sm font-medium text-gray-700"
            >
              Is Fixed
            </label>
            <Switch
              id="fixed"
              checked={isFixed}
              onChange={onStatusChange}
              className="group relative inline-flex h-6 w-11 mt-1 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 data-[checked]:bg-indigo-600"
            >
              <span className="pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5" />
            </Switch>
          </div>

          {/* Save and Delete Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-red-500 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Ticket"}
            </button>
            <button
              type="submit"
              className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Ticket
            </button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
