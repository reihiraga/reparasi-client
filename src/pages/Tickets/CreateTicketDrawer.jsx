/* eslint-disable no-unused-vars */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ticketSchema } from "@/schema/Ticket";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCreateTicketMutation } from "@/api/ticketsApiSlice";
import { useGetAllUsersQuery } from "@/api/usersApiSlice";

export function CreateTicketDrawer() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({ resolver: zodResolver(ticketSchema) });

  const [createTicket, { isLoading, isError, isSuccess, error }] =
    useCreateTicketMutation();

  // Fetch users data
  const { data: usersData } = useGetAllUsersQuery("usersList");

  const users = usersData ? Object.values(usersData.entities) : [];

  const onSubmit = async (payload) => {
    try {
      await createTicket({
        title: payload.title,
        desc: payload.description,
        user: payload.user,
      });

      reset();
    } catch (error) {
      console.error("Failed to create a new ticket", error);
    }
  };

  return (
    <Sheet>
      <SheetTrigger className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Create Ticket
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create New Ticket</SheetTitle>
          <SheetDescription>Add a new ticket to the system</SheetDescription>
        </SheetHeader>
        <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Title */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="title"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              {...register("title", { required: true })}
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
              className="block text-sm font-medium text-gray-700"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              {...register("description", { required: true })}
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              rows="4"
            ></textarea>
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* User Selection */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="user"
            >
              User
            </label>
            <select
              id="user"
              {...register("user", { required: true })}
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Pilih User</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
            {errors.user && (
              <p className="mt-1 text-sm text-red-600">{errors.user.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-500 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
