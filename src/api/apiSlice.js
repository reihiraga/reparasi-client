/* eslint-disable no-unused-vars */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    // baseUrl: "https://reparasi-server-08k5.onrender.com",
    baseUrl: "http://localhost:8080",
  }),
  tagTypes: ["Ticket", "User"],
  endpoints: (builder) => ({}),
});
