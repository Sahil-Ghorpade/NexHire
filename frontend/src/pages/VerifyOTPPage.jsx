import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Logo from "../components/Logo";

import axiosInstance from "../api/axiosInstance";

function VerifyOTPPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const email =
    location.state?.email || "";

  const [otp, setOtp] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const [timer, setTimer] =
    useState(60);

  /**
   * Redirect if email is missing
   */
  useEffect(() => {
    if (!email) {
      navigate("/signup", {
        replace: true,
      });
    }
  }, [
    email,
    navigate,
  ]);

  /**
   * Start resend timer
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
   * Auto hide success message
   */
  useEffect(() => {
    if (!successMessage) return;

    const timeout =
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

    return () =>
      clearTimeout(timeout);
  }, [successMessage]);

  /**
   * OTP Input Handler
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
   * Verify OTP
   */
  const handleVerify = async (
    e
  ) => {
    e.preventDefault();

    setError("");

    if (otp.length !== 6) {
      setError(
        "Please enter a valid 6-digit OTP."
      );
      return;
    }

    try {
      setLoading(true);

      await axiosInstance.post(
        "/api/auth/verify-otp",
        {
          email,
          otp,
        }
      );

      navigate("/login", {
        state: {
          verified: true,
        },
      });
    } catch (error) {
      const responseData =
        error?.response?.data;

      if (
        responseData?.message
      ) {
        setError(
          responseData.message
        );
      } else if (
        responseData?.errors
          ?.length
      ) {
        setError(
          responseData.errors[0]
            .msg
        );
      } else {
        setError(
          "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resend OTP
   */
  const handleResendOTP =
    async () => {
      if (timer > 0) return;

      setError("");

      try {
        await axiosInstance.post(
          "/api/auth/resend-otp",
          {
            email,
          }
        );

        setSuccessMessage(
          "OTP resent successfully."
        );

        setTimer(60);
      } catch (error) {
        const responseData =
          error?.response?.data;

        if (
          responseData?.message
        ) {
          setError(
            responseData.message
          );
        } else {
          setError(
            "Failed to resend OTP."
          );
        }
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
            <Logo></Logo>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-lg shadow-slate-200/40 sm:p-8">
          {/* Heading */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-[#0f172a]">
              Verify your email
            </h1>

            <p className="mt-2 text-sm text-[#64748b]">
              We sent a 6-digit
              code to
            </p>

            <p className="mt-1 break-all text-sm font-medium text-[#2563eb]">
              {email}
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={
              handleVerify
            }
            className="space-y-5"
          >
            {/* Email Display */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#0f172a]">
                Email
              </label>

              <input
                type="email"
                value={email}
                readOnly
                className="w-full cursor-not-allowed rounded-lg border border-[#e2e8f0] bg-gray-50 px-4 py-3 text-[#64748b]"
              />
            </div>

            {/* OTP */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#0f172a]">
                OTP Code
              </label>

              <input
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={handleOtpChange}
                placeholder="123456"
                className={`w-full rounded-lg border border-[#e2e8f0] px-4 py-3 text-center text-2xl outline-none transition focus:border-[#2563eb] focus:ring-4 focus:ring-blue-100 ${
                  otp ? "tracking-[0.5em]" : ""
                }`}
              />

              <p className="mt-2 text-xs text-[#64748b]">
                Enter the
                6-digit code sent
                to your email.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Success */}
            {successMessage && (
              <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
                {
                  successMessage
                }
              </div>
            )}

            {/* Verify Button */}
            <button
              type="submit"
              disabled={
                loading
              }
              className="w-full rounded-lg bg-[#2563eb] px-4 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading
                ? "Verifying..."
                : "Verify Email"}
            </button>
          </form>

          {/* Resend OTP */}
          <div className="mt-5 text-center">
            {timer > 0 ? (
              <p className="text-sm text-[#64748b]">
                Resend OTP in{" "}
                <span className="font-medium text-[#2563eb]">
                  {timer}s
                </span>
              </p>
            ) : (
              <button
                type="button"
                onClick={
                  handleResendOTP
                }
                className="text-sm font-medium text-[#2563eb] hover:underline"
              >
                Resend OTP
              </button>
            )}
          </div>

          {/* Links */}
          <div className="mt-6 flex flex-col gap-2 text-center text-sm">
            <button
              type="button"
              onClick={() =>
                navigate(
                  "/signup"
                )
              }
              className="text-[#2563eb] hover:underline"
            >
              Change email
            </button>

            <Link
              to="/signup"
              className="text-[#64748b] hover:text-[#2563eb]"
            >
              Back to signup
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default VerifyOTPPage;