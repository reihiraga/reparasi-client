import { apiSlice } from "./apiSlice";
import { logout, setCredentials } from "./authSlice";

const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    refresh: builder.mutation({
      query: () => ({
        url: "/auth/refresh",
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          const { accessToken } = data;
          dispatch(setCredentials({ accessToken }));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data);

          // eksekusi action logout pada authSlice
          dispatch(logout());

          setTimeout(() => {
            // pembersihan keseluruhan state Store
            dispatch(apiSlice.util.resetApiState());
            window.location.replace("/login");
          }, 250);
        } catch (error) {
          console.log(error);
        }
      },
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useRefreshMutation } =
  authApiSlice;
