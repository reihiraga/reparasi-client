/* eslint-disable no-unused-vars */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials } from "./authSlice";

const baseQuery = fetchBaseQuery({
  // baseUrl: "https://reparasi-server-08k5.onrender.com",
  baseUrl: "http://localhost:8080",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const bearerToken = getState()?.auth?.accessToken;

    if (bearerToken) {
      headers.set("authorization", `Bearer ${bearerToken}`);
    }

    return headers;
  },
});

const baseQueryWithAuth = async (args, api, extraOptions) => {
  let response = await baseQuery(args, api, extraOptions);

  if (response?.error?.status === 403) {
    const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);

    if (refreshResult?.data) {
      api.dispatch(setCredentials({ ...refreshResult.data }));

      response = await baseQuery(args, api, extraOptions);
    } else {
      if (refreshResult?.error?.status === 403) {
        refreshResult.error.data.message = "Login tokenmu sudah kadaluarsa.";
      }

      return refreshResult;
    }
  }

  return response;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Ticket", "User"],
  endpoints: (builder) => ({}),
});
