import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function NotFoundPage() {
  const navigate =
    useNavigate();

  const {
    isAuthenticated,
  } = useAuth();

  /**
   * Navigate user
   */
  const handleNavigate =
    () => {
      if (
        isAuthenticated
      ) {
        navigate(
          "/dashboard"
        );
      } else {
        navigate("/");
      }
    };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] px-6">
      <div className="text-center">
        {/* 404 */}
        <h1
          className="
            text-8xl
            font-extrabold
            text-[#2563eb]
            sm:text-9xl
            md:text-[10rem]
          "
        >
          404
        </h1>

        {/* Heading */}
        <h2 className="mt-4 text-3xl font-bold text-[#0f172a]">
          Page Not Found
        </h2>

        {/* Subtitle */}
        <p className="mt-3 max-w-md text-[#64748b]">
          The page you're
          looking for doesn't
          exist or has been
          moved.
        </p>

        {/* Action Button */}
        <button
          onClick={
            handleNavigate
          }
          className="
            mt-8
            rounded-xl
            bg-[#2563eb]
            px-6
            py-3
            font-medium
            text-white
            transition
            hover:bg-blue-700
          "
        >
          {isAuthenticated
            ? "Go to Dashboard"
            : "Go to Home"}
        </button>
      </div>
    </div>
  );
}

export default NotFoundPage;