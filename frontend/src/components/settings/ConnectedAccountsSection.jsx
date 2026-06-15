import { FcGoogle } from "react-icons/fc";
import { Mail } from "lucide-react";

function ConnectedAccountsSection({
    user,
}) {
    return (
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
    );
}

export default ConnectedAccountsSection;