import { useState } from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Eye,
  EyeOff,
} from "lucide-react";

import { FcGoogle } from "react-icons/fc";

import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

/**
 * Validation Schema
 */
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
});

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const verified =
    location.state?.verified || false;

  const passwordReset =
    location.state?.passwordReset || false;

  const [apiError, setApiError] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  /**
   * Handle Login
   */
  const onSubmit = async (data) => {
    setApiError("");

    try {
      const response =
        await axiosInstance.post(
          "/api/auth/login",
          {
            email: data.email,
            password: data.password,
          }
        );

      login(
        response.data.token,
        response.data.user
      );

      navigate("/dashboard", { replace: true });
    } catch (error) {
      const responseData =
        error?.response?.data;

      if (responseData?.message) {
        setApiError(
          responseData.message
        );
      } else if (
        responseData?.errors?.length
      ) {
        setApiError(
          responseData.errors[0].msg
        );
      } else {
        setApiError(
          "Something went wrong. Please try again."
        );
      }
    }
  };

  /**
   * Placeholder Google Auth
   */
  const handleGoogleLogin = () => {
    alert("Google auth coming soon");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#e2e8f0] bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="text-2xl font-bold text-[#2563eb]"
          >
            NexHire
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-lg shadow-slate-200/40 sm:p-8">
          {/* Verified Success Banner */}
          {verified && (
            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              Email verified successfully.
              You can now log in.
            </div>
          )}

          {passwordReset && (
            <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
              Password updated successfully.
              Please log in.
            </div>
          )}

          {/* Heading */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-[#0f172a]">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-[#64748b]">
              Log in to your account
            </p>
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="group flex w-full items-center justify-center gap-3 rounded-lg border border-[#e2e8f0] bg-white px-4 py-3 text-sm font-medium text-[#0f172a] transition-all duration-300 hover:border-[#4285F4] hover:bg-gradient-to-r hover:from-[#4285F4]/5 hover:via-[#34A853]/5 hover:to-[#EA4335]/5 hover:shadow-md"
          >
            <FcGoogle
              size={22}
              className="transition-transform duration-300 group-hover:scale-110"
            />

            <span className="transition-colors duration-300 group-hover:text-[#2563eb]">
              Continue with Google
            </span>
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="h-px flex-1 bg-[#e2e8f0]" />

            <span className="px-3 text-sm text-[#64748b]">
              or continue with email
            </span>

            <div className="h-px flex-1 bg-[#e2e8f0]" />
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(
              onSubmit
            )}
            className="space-y-5"
          >
            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#0f172a]">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                className="w-full rounded-lg border border-[#e2e8f0] px-4 py-3 outline-none transition focus:border-[#2563eb] focus:ring-4 focus:ring-blue-100"
              />

              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {
                    errors.email
                      .message
                  }
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#0f172a]">
                Password
              </label>

              <div className="relative">
                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  {...register(
                    "password"
                  )}
                  className="w-full rounded-lg border border-[#e2e8f0] px-4 py-3 pr-12 outline-none transition focus:border-[#2563eb] focus:ring-4 focus:ring-blue-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#0f172a]"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>

              <div className="mt-2 flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-[#2563eb] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {
                    errors.password
                      .message
                  }
                </p>
              )}
            </div>

            {/* API Error */}
            {apiError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {apiError}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                isSubmitting
              }
              className="w-full rounded-lg bg-[#2563eb] px-4 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting
                ? "Logging in..."
                : "Log in"}
            </button>
          </form>

          {/* Signup Link */}
          <p className="mt-6 text-center text-sm text-[#64748b]">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-[#2563eb] hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;