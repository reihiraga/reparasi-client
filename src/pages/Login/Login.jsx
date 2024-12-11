/* eslint-disable no-unused-vars */
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router-dom";
import { useLoginMutation } from "@/api/authApiSlice";
import { setCredentials } from "@/api/authSlice";
import { z } from "zod";
import { toast } from "sonner";

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const loginSchema = z.object({
    username: z.string().min(1, "Username dibutuhkan"),
    password: z.string().min(1, "Password dibutuhkan"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const [login, { isLoading, isSuccess }] = useLoginMutation();

  const onSubmit = async (payload) => {
    // TODO: Implement actual login API call
    try {
      const { accessToken } = await login(payload).unwrap();
      toast.info("You are logged in.");
      dispatch(setCredentials({ accessToken }));
      navigate("/app/dashboard");
    } catch (error) {
      if (!error?.status) {
        console.error("No server response!");
      }
      toast.error(error.data.message, { dismissible: true });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
          Login ke Reparasi Si Budi
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Username */}
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              {...register("username", { required: true })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password", { required: true })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};
