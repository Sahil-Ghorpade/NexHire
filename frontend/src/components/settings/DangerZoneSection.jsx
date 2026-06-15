function DangerZoneSection({
  deleteConfirmation,
  setDeleteConfirmation,

  deletingAccount,
  deleteError,

  handleDeleteAccount,
}) {
    return (
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
                onClick={
                    handleDeleteAccount
                }

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
    );
}

export default DangerZoneSection;