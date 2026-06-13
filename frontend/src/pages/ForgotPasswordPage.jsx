import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Eye,
  EyeOff,
} from "lucide-react";

import axiosInstance from "../api/axiosInstance";

/**
 * Password Schema
 */
const passwordSchema = z
  .object({
    password: z
      .string()
      .min(
        8,
        "Password must be at least 8 characters"
      )
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
      data.password ===
      data.confirmPassword,
    {
      message:
        "Passwords do not match",
      path: [
        "confirmPassword",
      ],
    }
  );

function ForgotPasswordPage() {
  const navigate =
    useNavigate();

  /**
   * Flow State
   */
  const [step, setStep] =
    useState(1);

  const [email, setEmail] =
    useState("");

  const [otp, setOtp] =
    useState("");

  const [
    resetToken,
    setResetToken,
  ] = useState("");

  /**
   * Loading States
   */
  const [
    emailLoading,
    setEmailLoading,
  ] = useState(false);

  const [
    otpLoading,
    setOtpLoading,
  ] = useState(false);

  const [
    passwordLoading,
    setPasswordLoading,
  ] = useState(false);

  /**
   * Error States
   */
  const [
    emailError,
    setEmailError,
  ] = useState("");

  const [
    otpError,
    setOtpError,
  ] = useState("");

  const [
    passwordError,
    setPasswordError,
  ] = useState("");

  /**
   * Success Message
   */
  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  /**
   * Timer
   */
  const [timer, setTimer] =
    useState(0);

  /**
   * Password Visibility
   */
  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  /**
   * RHF
   */
  const {
    register,
    handleSubmit,
    formState: {
      errors,
    },
  } = useForm({
    resolver: zodResolver(
      passwordSchema
    ),
  });

  /**
   * Countdown Timer
   */
  useEffect(() => {
    if (timer <= 0) return;

    const interval =
      setInterval(() => {
        setTimer(
          (prev) => prev - 1
        );
      }, 1000);

    return () =>
      clearInterval(interval);
  }, [timer]);

  /**
   * Helper
   */
  const getErrorMessage = (
    error
  ) => {
    const data =
      error?.response?.data;

    if (data?.message) {
      return data.message;
    }

    if (
      data?.errors?.length
    ) {
      return data.errors[0].msg;
    }

    return "Something went wrong. Please try again.";
  };

  /**
   * Step 1
   */
  const handleSendOTP =
    async (e) => {
      e.preventDefault();

      setEmailError("");

      if (!email.trim()) {
        setEmailError(
          "Email is required"
        );
        return;
      }

      if (
        !/^\S+@\S+\.\S+$/.test(
          email
        )
      ) {
        setEmailError(
          "Please enter a valid email address"
        );
        return;
      }

      try {
        setEmailLoading(true);

        await axiosInstance.post(
          "/api/auth/forgot-password",
          { email }
        );

        setStep(2);
        setTimer(60);
      } catch (error) {
        setEmailError(
          getErrorMessage(
            error
          )
        );
      } finally {
        setEmailLoading(false);
      }
    };

  /**
   * OTP Input
   */
  const handleOtpChange = (
    e
  ) => {
    const value =
      e.target.value
        .replace(/\D/g, "")
        .slice(0, 6);

    setOtp(value);
  };

  /**
   * Step 2
   */
  const handleVerifyOTP =
    async (e) => {
      e.preventDefault();

      setOtpError("");

      if (
        otp.length !== 6
      ) {
        setOtpError(
          "Please enter a valid 6-digit OTP."
        );
        return;
      }

      try {
        setOtpLoading(true);

        const response =
          await axiosInstance.post(
            "/api/auth/verify-reset-otp",
            {
              email,
              otp,
            }
          );

        setResetToken(
          response.data
            .resetToken
        );

        setStep(3);
      } catch (error) {
        setOtpError(
          getErrorMessage(
            error
          )
        );
      } finally {
        setOtpLoading(false);
      }
    };

  /**
   * Resend OTP
   */
  const handleResendOTP =
    async () => {
      if (timer > 0) return;

      try {
        await axiosInstance.post(
          "/api/auth/forgot-password",
          { email }
        );

        setSuccessMessage(
          "OTP resent successfully."
        );

        setTimer(60);

        setTimeout(() => {
          setSuccessMessage(
            ""
          );
        }, 3000);
      } catch (error) {
        setOtpError(
          getErrorMessage(
            error
          )
        );
      }
    };

  /**
   * Step 3
   */
  const handlePasswordReset =
    async (data) => {
      setPasswordError("");

      try {
        setPasswordLoading(
          true
        );

        await axiosInstance.post(
          "/api/auth/reset-password",
          {
            token:
              resetToken,
            newPassword:
              data.password,
          }
        );

        navigate(
          "/login",
          {
            state: {
              passwordReset: true,
            },
          }
        );
      } catch (error) {
        setPasswordError(
          getErrorMessage(
            error
          )
        );
      } finally {
        setPasswordLoading(
          false
        );
      }
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

      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-lg shadow-slate-200/40 sm:p-8">

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-[#0f172a]">
                  Forgot password?
                </h1>

                <p className="mt-2 text-sm text-[#64748b]">
                  Enter your email
                  and we'll send
                  you a reset code
                </p>
              </div>

              <form
                onSubmit={
                  handleSendOTP
                }
                className="space-y-5"
              >
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#0f172a]">
                    Email
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(
                      e
                    ) =>
                      setEmail(
                        e.target
                          .value
                      )
                    }
                    placeholder="Enter your email"
                    className="w-full rounded-lg border border-[#e2e8f0] px-4 py-3 outline-none transition focus:border-[#2563eb] focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {emailError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {
                      emailError
                    }
                  </div>
                )}

                <button
                  type="submit"
                  disabled={
                    emailLoading
                  }
                  className="w-full rounded-lg bg-[#2563eb] px-4 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-70"
                >
                  {emailLoading
                    ? "Sending OTP..."
                    : "Send OTP"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm">
                <Link
                  to="/login"
                  className="text-[#2563eb] hover:underline"
                >
                  Back to login
                </Link>
              </p>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-[#0f172a]">
                  Check your email
                </h1>

                <p className="mt-2 text-sm text-[#64748b]">
                  We sent a
                  6-digit code to
                </p>

                <p className="mt-1 font-medium text-[#2563eb]">
                  {email}
                </p>
              </div>

              <form
                onSubmit={
                  handleVerifyOTP
                }
                className="space-y-5"
              >
                <input
                  type="text"
                  inputMode="numeric"
                  value={otp}
                  onChange={
                    handleOtpChange
                  }
                  placeholder="123456"
                  className={`w-full rounded-lg border border-[#e2e8f0] px-4 py-3 text-center text-2xl outline-none transition focus:border-[#2563eb] focus:ring-4 focus:ring-blue-100 ${
                    otp
                      ? "tracking-[0.5em]"
                      : ""
                  }`}
                />

                {otpError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {otpError}
                  </div>
                )}

                {successMessage && (
                  <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
                    {
                      successMessage
                    }
                  </div>
                )}

                <button
                  type="submit"
                  disabled={
                    otpLoading
                  }
                  className="w-full rounded-lg bg-[#2563eb] px-4 py-3 font-medium text-white"
                >
                  {otpLoading
                    ? "Verifying..."
                    : "Verify OTP"}
                </button>
              </form>

              <div className="mt-5 text-center">
                {timer > 0 ? (
                  <p className="text-sm text-[#64748b]">
                    Resend OTP
                    in{" "}
                    <span className="font-medium text-[#2563eb]">
                      {timer}s
                    </span>
                  </p>
                ) : (
                  <button
                    onClick={
                      handleResendOTP
                    }
                    className="text-sm text-[#2563eb] hover:underline"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <button
                onClick={() =>
                  setStep(1)
                }
                className="mt-5 w-full text-sm text-[#64748b] hover:text-[#2563eb]"
              >
                Back
              </button>
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <>
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-[#0f172a]">
                  Set new password
                </h1>

                <p className="mt-2 text-sm text-[#64748b]">
                  Choose a strong
                  password for
                  your account
                </p>
              </div>

              <form
                onSubmit={handleSubmit(
                  handlePasswordReset
                )}
                className="space-y-5"
              >
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    New Password
                  </label>

                  <div className="relative">
                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      {...register(
                        "password"
                      )}
                      className="w-full rounded-lg border border-[#e2e8f0] px-4 py-3 pr-12 outline-none focus:border-[#2563eb] focus:ring-4 focus:ring-blue-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (
                            prev
                          ) =>
                            !prev
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff />
                      ) : (
                        <Eye />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">
                      {
                        errors
                          .password
                          .message
                      }
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Confirm Password
                  </label>

                  <div className="relative">
                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      {...register(
                        "confirmPassword"
                      )}
                      className="w-full rounded-lg border border-[#e2e8f0] px-4 py-3 pr-12 outline-none focus:border-[#2563eb] focus:ring-4 focus:ring-blue-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (
                            prev
                          ) =>
                            !prev
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                    >
                      {showConfirmPassword ? (
                        <EyeOff />
                      ) : (
                        <Eye />
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

                {passwordError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {
                      passwordError
                    }
                  </div>
                )}

                <button
                  type="submit"
                  disabled={
                    passwordLoading
                  }
                  className="w-full rounded-lg bg-[#2563eb] px-4 py-3 font-medium text-white"
                >
                  {passwordLoading
                    ? "Updating Password..."
                    : "Update Password"}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default ForgotPasswordPage;