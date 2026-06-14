import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { FcGoogle } from "react-icons/fc";

import { useForm } from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  Mail,
  Eye,
  EyeOff,
} from "lucide-react";

import axiosInstance from "../api/axiosInstance";

import { useAuth } from "../context/AuthContext";

  /**
 * Password Schema
 */
const passwordSchema = z
  .object({
    currentPassword:
      z.string().min(1,
        "Current password is required"
      ),

    newPassword:
      z
        .string()
        .min(
          8,
          "Password must be at least 8 characters"
        )
        .regex(
          /[A-Z]/,
          "Must contain an uppercase letter"
        )
        .regex(
          /[a-z]/,
          "Must contain a lowercase letter"
        )
        .regex(
          /[0-9]/,
          "Must contain a number"
        )
        .regex(
          /[^A-Za-z0-9]/,
          "Must contain a special character"
        ),

    confirmPassword:
      z.string(),
  })
  .refine(
    (data) =>
      data.newPassword ===
      data.confirmPassword,
    {
      path: [
        "confirmPassword",
      ],
      message:
        "Passwords do not match",
    }
  );

function SettingsPage() {
  const navigate = useNavigate();

  const {
    user,
    login,
    logout,
  } = useAuth();

  /**
   * Profile State
   */
  const [name, setName] =
    useState(""); 

  const [
    profileLoading,
    setProfileLoading,
  ] = useState(false);

  const [
    profileSuccess,
    setProfileSuccess,
  ] = useState("");

  const [
    profileError,
    setProfileError,
  ] = useState("");

  /**
 * Delete Account State
 */
const [
  deleteConfirmation,
  setDeleteConfirmation,
] = useState("");

const [
  deletingAccount,
  setDeletingAccount,
] = useState(false);

const [
  deleteError,
  setDeleteError,
] = useState("");

/**
 * Password State
 */
const [
  passwordLoading,
  setPasswordLoading,
] = useState(false);

const [
  passwordSuccess,
  setPasswordSuccess,
] = useState("");

const [
  passwordError,
  setPasswordError,
] = useState("");

const [
  showCurrentPassword,
  setShowCurrentPassword,
] = useState(false);

const [
  showNewPassword,
  setShowNewPassword,
] = useState(false);

const [
  showConfirmPassword,
  setShowConfirmPassword,
] = useState(false);

/**
 * React Hook Form
 */
const {
  register,
  handleSubmit,
  reset,
  formState: {
    errors,
  },
} = useForm({
  resolver:
    zodResolver(
      passwordSchema
    ),
});

  /**
   * Initialize Form
   */
  useEffect(() => {
    if (!user) return;

    setName(user.name || "");

  }, [user]);

  /**
   * Update Profile
   */
  const handleProfileSubmit =
    async (e) => {
      e.preventDefault();

      try {
        setProfileLoading(
          true
        );

        setProfileError("");

        setProfileSuccess("");

        const response =
          await axiosInstance.put(
            "/api/user/profile",
            {
              name,
            }
          );

        const token =
          localStorage.getItem(
            "nexhire_token"
          );

        login(
          token,
          response.data.user
        );

        setProfileSuccess(
          "Profile updated successfully"
        );
      } catch (error) {
        const responseData =
          error?.response?.data;

        setProfileError(
          responseData?.message ||
            "Failed to update profile"
        );
      } finally {
        setProfileLoading(
          false
        );
      }
    };

    /**
 * Update Password
 */
const handlePasswordSubmit =
  async (data) => {
    try {
      setPasswordLoading(
        true
      );

      setPasswordError("");

      setPasswordSuccess(
        ""
      );

      await axiosInstance.put(
        "/api/user/password",
        {
          currentPassword:
            data.currentPassword,

          newPassword:
            data.newPassword,
        }
      );

      setPasswordSuccess(
        "Password updated successfully"
      );

      reset();
    } catch (error) {
      const responseData =
        error?.response?.data;

      setPasswordError(
        responseData?.message ||
          "Failed to update password"
      );
    } finally {
      setPasswordLoading(
        false
      );
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#0f172a]">
          Settings
        </h1>

        <p className="mt-2 text-[#64748b]">
          Manage your account
          preferences and
          profile information.
        </p>
      </div>

      {/* Profile Section */}
      <section className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold text-[#0f172a]">
          Profile
        </h2>

        {/* Avatar */}
        <div className="mb-8 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-3xl font-bold text-[#2563eb]">
            {user?.name?.charAt(
              0
            ) || "U"}
          </div>
        </div>

        <form
          onSubmit={
            handleProfileSubmit
          }
          className="space-y-5"
        >
          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#0f172a]">
              Full Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              className="
                w-full
                rounded-xl
                border
                border-[#e2e8f0]
                px-4
                py-3
                outline-none
                focus:border-[#2563eb]
              "
            />
          </div>

          {/* Messages */}
          {profileSuccess && (
            <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
              {
                profileSuccess
              }
            </div>
          )}

          {profileError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
              {profileError}
            </div>
          )}

          {/* Save Button */}
          <button
            type="submit"
            disabled={
              profileLoading
            }
            className="
              rounded-xl
              bg-[#2563eb]
              px-5
              py-3
              font-medium
              text-white
              transition
              hover:bg-blue-700
              disabled:opacity-60
            "
          >
            {profileLoading
              ? "Saving..."
              : "Save Changes"}
          </button>
        </form>
      </section>

      {/* Connected Accounts */}
      <section className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold text-[#0f172a]">
          Connected Accounts
        </h2>

        <div className="rounded-xl border border-[#e2e8f0] p-4">
          {user?.authProvider ===
          "google" ? (
            <div className="flex items-center gap-4">
              <FcGoogle
                size={28}
              />

              <div>
                <p className="font-medium text-[#0f172a]">
                  Google Account
                </p>

                <p className="text-sm text-[#64748b]">
                  {
                    user.email
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Mail
                size={24}
                className="text-[#2563eb]"
              />

              <div>
                <p className="font-medium text-[#0f172a]">
                  Email Account
                </p>

                <p className="text-sm text-[#64748b]">
                  {
                    user.email
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Password Section */}
<section className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
  <h2 className="mb-6 text-xl font-semibold text-[#0f172a]">
    Change Password
  </h2>

  {user?.authProvider ===
  "google" ? (
    <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-blue-700">
      Password management is
      not available for
      Google accounts.
    </div>
  ) : (
    <form
      onSubmit={handleSubmit(
        handlePasswordSubmit
      )}
      className="space-y-5"
    >
      {/* Current Password */}
      <div>
        <label className="mb-2 block text-sm font-medium text-[#0f172a]">
          Current Password
        </label>

        <div className="relative">
          <input
            type={
              showCurrentPassword
                ? "text"
                : "password"
            }
            {...register(
              "currentPassword"
            )}
            className="w-full rounded-xl border border-[#e2e8f0] px-4 py-3 pr-12 outline-none focus:border-[#2563eb]"
          />

          <button
            type="button"
            onClick={() =>
              setShowCurrentPassword(
                !showCurrentPassword
              )
            }
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            {showCurrentPassword ? (
              <EyeOff
                size={18}
              />
            ) : (
              <Eye
                size={18}
              />
            )}
          </button>
        </div>

        {errors.currentPassword && (
          <p className="mt-1 text-sm text-red-600">
            {
              errors
                .currentPassword
                .message
            }
          </p>
        )}
      </div>

      {/* New Password */}
      <div>
        <label className="mb-2 block text-sm font-medium text-[#0f172a]">
          New Password
        </label>

        <div className="relative">
          <input
            type={
              showNewPassword
                ? "text"
                : "password"
            }
            {...register(
              "newPassword"
            )}
            className="w-full rounded-xl border border-[#e2e8f0] px-4 py-3 pr-12 outline-none focus:border-[#2563eb]"
          />

          <button
            type="button"
            onClick={() =>
              setShowNewPassword(
                !showNewPassword
              )
            }
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            {showNewPassword ? (
              <EyeOff
                size={18}
              />
            ) : (
              <Eye
                size={18}
              />
            )}
          </button>
        </div>

        {errors.newPassword && (
          <p className="mt-1 text-sm text-red-600">
            {
              errors
                .newPassword
                .message
            }
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="mb-2 block text-sm font-medium text-[#0f172a]">
          Confirm New Password
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
            className="w-full rounded-xl border border-[#e2e8f0] px-4 py-3 pr-12 outline-none focus:border-[#2563eb]"
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword(
                !showConfirmPassword
              )
            }
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            {showConfirmPassword ? (
              <EyeOff
                size={18}
              />
            ) : (
              <Eye
                size={18}
              />
            )}
          </button>
        </div>

        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">
            {
              errors
                .confirmPassword
                .message
            }
          </p>
        )}
      </div>

      {passwordSuccess && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
          {passwordSuccess}
        </div>
      )}

      {passwordError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
          {passwordError}
        </div>
      )}

      <button
        type="submit"
        disabled={
          passwordLoading
        }
        className="rounded-xl bg-[#2563eb] px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {passwordLoading
          ? "Updating..."
          : "Update Password"}
      </button>
    </form>
  )}
</section>

{/* Danger Zone */}
<section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
  <h2 className="mb-4 text-xl font-semibold text-red-600">
    Danger Zone
  </h2>

  <p className="mb-6 text-[#64748b]">
    Permanently delete your account and all associated data.
    This action cannot be undone.
  </p>

  <div className="rounded-xl border border-red-200 bg-red-50 p-5">
    <p className="mb-4 text-sm text-red-700">
      To confirm account deletion, type:
      {" "}
      <strong>DELETE</strong>
    </p>

    <div className="mb-4 rounded-xl border border-orange-200 bg-orange-50 p-4 text-orange-700">
      <p className="font-medium">
        This action will permanently delete:
      </p>

      <ul className="mt-2 list-disc pl-5">
        <li>Your account</li>
        <li>All interview reports</li>
        <li>All resume analyses</li>
      </ul>
    </div>

    <input
      type="text"
      value={
        deleteConfirmation
      }
      onChange={(e) =>
        setDeleteConfirmation(
          e.target.value
        )
      }
      placeholder="Type DELETE"
      className="
        mb-4
        w-full
        rounded-xl
        border
        border-red-200
        px-4
        py-3
        outline-none
        focus:border-red-500
      "
    />

    {deleteError && (
      <div className="mb-4 rounded-xl border border-red-200 bg-white p-3 text-red-600">
        {deleteError}
      </div>
    )}

    <button
      onClick={async () => {
        try {
          setDeleteError("");

          setDeletingAccount(
            true
          );

          await axiosInstance.delete(
            "/api/user/account"
          );

          logout();

          navigate("/");
        } catch (error) {
          const responseData =
            error?.response?.data;

          setDeleteError(
            responseData?.message ||
              "Failed to delete account"
          );
        } finally {
          setDeletingAccount(
            false
          );
        }
      }}
      disabled={
        deleteConfirmation !==
          "DELETE" ||
        deletingAccount
      }
      className="
        rounded-xl
        bg-red-600
        px-5
        py-3
        font-medium
        text-white
        transition
        hover:bg-red-700
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
    >
      {deletingAccount
        ? "Deleting Account..."
        : "Confirm Delete"}
    </button>
  </div>
</section>
    </div>
  );
}

export default SettingsPage;

