import {
    Eye,
    EyeOff
} from "lucide-react";

function PasswordSection({
  user,

  register,
  handleSubmit,
  handlePasswordSubmit,

  errors,

  passwordLoading,
  passwordSuccess,
  passwordError,

  showCurrentPassword,
  setShowCurrentPassword,

  showNewPassword,
  setShowNewPassword,

  showConfirmPassword,
  setShowConfirmPassword,
}) {
    return (
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
    );
}

export default PasswordSection;