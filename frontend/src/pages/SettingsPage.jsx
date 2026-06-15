import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";


import { useForm } from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";


import axiosInstance from "../api/axiosInstance";

import { useAuth } from "../context/AuthContext";

import ConnectedAccountsSection from "../components/settings/ConnectedAccountsSection";
import DangerZoneSection from "../components/settings/DangerZoneSection";
import PasswordSection from "../components/settings/PasswordSection";
import ProfileSection from "../components/settings/ProfileSection";

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

/**
 * Delete Account
 */
const handleDeleteAccount =
  async () => {
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
      <ProfileSection
        user={user}
        name={name}
        setName={setName}
        profileLoading={profileLoading}
        profileSuccess={profileSuccess}
        profileError={profileError}
        handleProfileSubmit={handleProfileSubmit}
      />

      {/* Connected Accounts */}
      <ConnectedAccountsSection
        user={user}
      />

      {/* Password Section */}
      <PasswordSection
        user={user}

        register={register}
        handleSubmit={handleSubmit}
        handlePasswordSubmit={handlePasswordSubmit}

        errors={errors}

        passwordLoading={passwordLoading}
        passwordSuccess={passwordSuccess}
        passwordError={passwordError}

        showCurrentPassword={showCurrentPassword}
        setShowCurrentPassword={setShowCurrentPassword}

        showNewPassword={showNewPassword}
        setShowNewPassword={setShowNewPassword}

        showConfirmPassword={showConfirmPassword}
        setShowConfirmPassword={setShowConfirmPassword}
      />


      {/* Danger Zone */}
      <DangerZoneSection
        deleteConfirmation={
          deleteConfirmation
        }
        setDeleteConfirmation={
          setDeleteConfirmation
        }
        deletingAccount={
          deletingAccount
        }
        deleteError={
          deleteError
        }
        handleDeleteAccount={
          handleDeleteAccount
        }
      />
    </div>
  );
}

export default SettingsPage;