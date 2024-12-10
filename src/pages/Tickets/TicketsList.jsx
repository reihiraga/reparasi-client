/* eslint-disable no-unused-vars */
import { SyncLoader } from "react-spinners";
import { useGetAllTicketsQuery } from "@/api/ticketsApiSlice";
import { Search, Filter } from "lucide-react";
import Ticket from "./Ticket";
import { CreateTicketDrawer } from "./CreateTicketDrawer";
import { useState } from "react";

export const TicketsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("false");

  const {
    data: ticketsData,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetAllTicketsQuery("ticketsList", {
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
    const { ids, entities } = ticketsData;

    // Apply search and filter
    const filteredTickets = ids.filter((ticketId) => {
      const ticket = entities[ticketId];
      const matchesSearch = ticket.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFilter =
        statusFilter === "all" || ticket.isFixed.toString() === statusFilter;

      return matchesSearch && matchesFilter;
    });

    const tableBody =
      filteredTickets.length > 0 ? (
        filteredTickets.map((ticketId) => (
          <Ticket key={ticketId} ticketId={ticketId} />
        ))
      ) : (
        <tr>
          <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
            No tickets found
          </td>
        </tr>
      );

    list = (
      <div>
        <div className="mb-8 sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tickets</h1>
            <p>Mengelola akses dan data tiket</p>
          </div>
          {/* Drawer to create a new ticket */}
          <CreateTicketDrawer />
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col gap-4 sm:flex-row">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                <input
                  type="text"
                  placeholder="Cari Ticket"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              {/* Filter */}
              <div className="flex gap-4">
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="py-2 pl-8 pr-10 border-gray-300 rounded-md appearance-none focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="all">All</option>
                    <option value="false">New</option>
                    <option value="true">Completed</option>
                  </select>
                  <Filter className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-2 top-1/2" />
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden bg-white rounded-lg shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Title
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Description
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    User
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Is Fixed
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
      </div>
    );
  }

  return list;
};
