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
    <div>
      <div>
        <h2>Login ke Reparasi APL</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* username */}
          <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              {...register("username", { required: true })}
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* password */}
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              {...register("password", { required: true })}
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* button */}
          <button
            type="submit"
            className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};
