/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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
  const [selectedUsers, setSelectedUsers] = useState(
    Array.isArray(selectedTicket.user) ? selectedTicket.user : []
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: selectedTicket.title || "",
      desc: selectedTicket.desc || "",
      user: Array.isArray(selectedTicket.user) ? selectedTicket.user : [],
      isFixed: selectedTicket.isFixed || false,
      username: selectedTicket.username || "", // Set initial username
    },
  });

  const [updateTicket, { isLoading, isSuccess, isError, error }] =
    useUpdateTicketMutation();

  const { data: usersData } = useGetAllUsersQuery("usersList");
  const users = usersData ? Object.values(usersData.entities) : [];

  useEffect(() => {
    if (selectedTicket) {
      reset({
        title: selectedTicket.title || "",
        desc: selectedTicket.desc || "",
        user: Array.isArray(selectedTicket.user) ? selectedTicket.user : [],
        isFixed: selectedTicket.isFixed || false,
        username: selectedTicket.username || "", // Reset username when ticket changes
      });
    }
  }, [selectedTicket, reset]);

  const onSubmit = async (payload) => {
    try {
      await updateTicket({
        ...selectedTicket,
        title: payload.title,
        desc: payload.desc,
        user: selectedUsers,
        isFixed: payload.isFixed,
        username: payload.username, // Use the submitted username
      })
        .then((response) => {
          console.log("Ticket created:", response);
        })
        .catch((error) => {
          console.error("API Error:", error);
          if (error.response) {
            console.error("Response Data:", error.response.data);
          }
        });
      console.log(payload);
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
              disabled={!selectedTicket.username} // Make it non-editable if username shouldn't change
            />
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
