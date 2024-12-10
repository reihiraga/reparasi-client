/* eslint-disable no-unused-vars */
import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";

const ticketsAdapter = createEntityAdapter({});

const initialState = ticketsAdapter.getInitialState();

const ticketsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllTickets: builder.query({
      query: () => "/tickets",
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {
        const ticketsArray = responseData.data;
        if (!Array.isArray(ticketsArray)) {
          console.error("Expected an array but got:", ticketsArray);
          return initialState;
        }

        const loadedTickets = ticketsArray.map((ticket) => {
          ticket.id = ticket._id;
          return ticket;
        });
        return ticketsAdapter.setAll(initialState, loadedTickets);
      },

      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            {
              type: "Ticket",
              id: "LIST",
            },
            ...result.ids.map((id) => ({ type: "Ticket", id })),
          ];
        }
      },
    }),
    createTicket: builder.mutation({
      query: (initialTicketData) => ({
        url: "/tickets",
        method: "POST",
        body: {
          ...initialTicketData,
        },
      }),
      invalidatesTags: [{ type: "Ticket", id: "LIST" }],
    }),
    updateTicket: builder.mutation({
      query: ({ newTicketData }) => ({
        url: "/tickets",
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: newTicketData,
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Ticket", id: arg.id }],
    }),
    deleteTicket: builder.mutation({
      query: ({ id }) => ({
        url: "/tickets",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Ticket", id: arg.id }],
    }),
  }),
});

export const {
  useGetAllTicketsQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
} = ticketsApiSlice;

export const selectTicketsResult =
  ticketsApiSlice.endpoints.getAllTickets.select();

const selectTicketsData = createSelector(
  selectTicketsResult,
  (ticketsResult) => ticketsResult.data
);

export const {
  selectAll: selectAllTickets,
  selectById: selectTicketById,
  selectIds: selectTicketIds,
} = ticketsAdapter.getSelectors(
  (state) => selectTicketsData(state) ?? initialState
);
