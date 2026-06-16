import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Eye, EyeOff } from "lucide-react";

import axiosInstance from "../api/axiosInstance";

import { GoogleLogin } from "@react-oauth/google";

import { useAuth } from "../context/AuthContext";

import Logo from "../components/Logo";

/**
 * Validation Schema
 */
const signupSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters"),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),

    password: z
      .string()
      .min(
        8,
        "Password must be at least 8 characters"
      )
      .max(20, "Name must be less than 20 characters")
      .regex(
        /[A-Z]/,
        "Password must contain at least one uppercase letter"
      )
      .regex(
        /[a-z]/,
        "Password must contain at least one lowercase letter"
      )
      .regex(
        /[0-9]/,
        "Password must contain at least one digit"
      )
      .regex(
        /[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?]/,
        "Password must contain at least one special character"
      ),

    confirmPassword: z.string(),
  })
  .refine(
    (data) =>
      data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

function SignupPage() {
  const navigate = useNavigate();

  const { login } =
  useAuth();

  const [apiError, setApiError] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  /**
   * Handle Signup
   */
  const onSubmit = async (data) => {
    setApiError("");

    try {
      await axiosInstance.post(
        "/api/auth/signup",
        {
          name: data.name,
          email: data.email,
          password: data.password,
        }
      );

      navigate("/verify-otp", {
        state: {
          email: data.email,
        },
      });
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
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#e2e8f0] bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="text-2xl font-bold text-[#2563eb]"
          >
            <Logo></Logo>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-lg shadow-slate-200/40 sm:p-8">
          {/* Heading */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-[#0f172a]">
              Create your account
            </h1>

            <p className="mt-2 text-sm text-[#64748b]">
              Start your interview
              preparation journey
            </p>
          </div>

          {/* Google Signup */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={async (
                credentialResponse
              ) => {
                try {
                  setApiError("");

                  const response =
                    await axiosInstance.post(
                      "/api/auth/google",
                      {
                        credential:
                          credentialResponse.credential,
                      }
                    );

                  login(
                    response.data.token,
                    response.data.user
                  );

                  navigate(
                    "/dashboard",
                    {
                      replace: true,
                    }
                  );
                } catch (error) {
                  const responseData =
                    error?.response?.data;

                  setApiError(
                    responseData?.message ||
                      "Google signup failed"
                  );
                }
              }}
              onError={() =>
                setApiError(
                  "Google signup failed"
                )
              }
              width="320"
              text="continue_with"
            />
          </div>

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
            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#0f172a]">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter your full name"
                {...register("name")}
                className="w-full rounded-lg border border-[#e2e8f0] px-4 py-3 outline-none transition focus:border-[#2563eb]"
              />

              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {
                    errors.name
                      .message
                  }
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#0f172a]">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                className="w-full rounded-lg border border-[#e2e8f0] px-4 py-3 outline-none transition focus:border-[#2563eb]"
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
                  placeholder="Create a password"
                  {...register(
                    "password"
                  )}
                  className="w-full rounded-lg border border-[#e2e8f0] px-4 py-3 pr-12 outline-none transition focus:border-[#2563eb]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (
                        prev
                      ) => !prev
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b]"
                >
                  {showPassword ? (
                    <EyeOff
                      size={20}
                    />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
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

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#0f172a]">
                Confirm Password
              </label>

              <div className="relative">
                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm your password"
                  {...register(
                    "confirmPassword"
                  )}
                  className="w-full rounded-lg border border-[#e2e8f0] px-4 py-3 pr-12 outline-none transition focus:border-[#2563eb]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (
                        prev
                      ) => !prev
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b]"
                >
                  {showConfirmPassword ? (
                    <EyeOff
                      size={20}
                    />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {
                    errors
                      .confirmPassword
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

            {/* Submit */}
            <button
              type="submit"
              disabled={
                isSubmitting
              }
              className="w-full rounded-lg bg-[#2563eb] px-4 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting
                ? "Creating account..."
                : "Create Account"}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-[#64748b]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-[#2563eb] hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default SignupPage;