function ProfileSection({
  user,
  name,
  setName,
  profileLoading,
  profileSuccess,
  profileError,
  handleProfileSubmit,
}) {
    return (
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
    );
}

export default ProfileSection;