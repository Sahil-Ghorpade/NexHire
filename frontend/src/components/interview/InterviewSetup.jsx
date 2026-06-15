import SidebarLayout from "../../layouts/SidebarLayout";

import {
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";

function InterviewSetup({
  type,
  setType,
  selectedRole,
  setSelectedRole,
  role,
  setRole,
  customRole,
  setCustomRole,
  roleValidated,
  validatingRole,
  roleValidationError,
  setRoleValidated,
  setRoleValidationError,
  difficulty,
  setDifficulty,
  count,
  setCount,
  error,
  generatingQuestions,
  handleValidateRole,
  handleStartInterview,
  interviewTypes,
  difficulties,
  questionCounts,
  roleOptions,
}) {
    return (
      <SidebarLayout>
        <div className="mx-auto flex min-h-[calc(100vh-120px)] max-w-4xl items-center p-4 md:p-8">
          <div className="w-full rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm md:p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#0f172a]">
                AI Mock Interview
              </h1>

              <p className="mt-2 text-[#64748b]">
                Configure your
                interview session
              </p>
            </div>

            {/* Type */}
            <div className="mb-8">
              <label className="mb-3 block text-sm font-medium text-[#0f172a]">
                Interview Type
              </label>

              <div className="flex flex-wrap gap-3">
                {interviewTypes.map(
                  (
                    interviewType
                  ) => (
                    <button
                      key={
                        interviewType
                      }
                      type="button"
                      onClick={() =>
                        setType(
                          interviewType
                        )
                      }
                      className={`rounded-lg border px-4 py-3 font-medium transition ${
                        type ===
                        interviewType
                          ? "border-[#2563eb] bg-[#2563eb] text-white"
                          : "border-[#e2e8f0] bg-white text-[#0f172a]"
                      }`}
                    >
                      {
                        interviewType
                      }
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Role */}
            <div className="mb-8">
              <label className="mb-3 block text-sm font-medium text-[#0f172a]">
                Role
              </label>

              <select
                value={selectedRole}
                onChange={(e) => {
                  setSelectedRole(
                    e.target.value
                  );

                  setRole(e.target.value);

                  setRoleValidated(
                    false
                  );

                  setRoleValidationError(
                    ""
                  );
                }}
                className="w-full rounded-lg border border-[#e2e8f0] px-4 py-3 outline-none focus:border-[#2563eb]"
              >
                <option value="">
                  Select Role
                </option>

                {roleOptions.map(
                  (
                    roleOption
                  ) => (
                    <option
                      key={
                        roleOption
                      }
                      value={
                        roleOption
                      }
                    >
                      {
                        roleOption
                      }
                    </option>
                  )
                )}
              </select>

              {selectedRole ===
                "Other (custom role)" && (
                <div className="mt-4">
                  <input
                    type="text"
                    value={
                      customRole
                    }
                    onChange={(
                      e
                    ) =>
                      setCustomRole(
                        e.target
                          .value
                      )
                    }
                    placeholder="Enter custom role"
                    className="w-full rounded-lg border border-[#e2e8f0] px-4 py-3 outline-none focus:border-[#2563eb]"
                  />

                  <button
                    type="button"
                    onClick={
                      handleValidateRole
                    }
                    disabled={
                      validatingRole
                    }
                    className="mt-3 rounded-lg bg-[#2563eb] px-4 py-3 text-white"
                  >
                    {validatingRole
                      ? "Validating..."
                      : "Validate Role"}
                  </button>

                  {roleValidated && (
                    <div className="mt-3 flex items-center gap-2 text-green-600">
                      <CheckCircle
                        size={18}
                      />

                      <span>
                        Role validated
                      </span>
                    </div>
                  )}

                  {roleValidationError && (
                    <div className="mt-3 flex items-center gap-2 text-red-600">
                      <AlertCircle
                        size={18}
                      />

                      <span>
                        {
                          roleValidationError
                        }
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

                      {/* Difficulty */}
            <div className="mb-8">
              <label className="mb-3 block text-sm font-medium text-[#0f172a]">
                Difficulty
              </label>

              <div className="flex flex-wrap gap-3">
                {difficulties.map(
                  (level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() =>
                        setDifficulty(
                          level
                        )
                      }
                      className={`rounded-lg border px-4 py-3 font-medium transition ${
                        difficulty ===
                        level
                          ? "border-[#2563eb] bg-[#2563eb] text-white"
                          : "border-[#e2e8f0] bg-white text-[#0f172a]"
                      }`}
                    >
                      {level}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Question Count */}
            <div className="mb-8">
              <label className="mb-3 block text-sm font-medium text-[#0f172a]">
                Question Count
              </label>

              <div className="flex flex-wrap gap-3">
                {questionCounts.map(
                  (value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setCount(
                          value
                        )
                      }
                      className={`rounded-lg border px-4 py-3 font-medium transition ${
                        count ===
                        value
                          ? "border-[#2563eb] bg-[#2563eb] text-white"
                          : "border-[#e2e8f0] bg-white text-[#0f172a]"
                      }`}
                    >
                      {value}
                    </button>
                  )
                )}
              </div>
            </div>

            {error && (
              <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
                <h3 className="font-semibold text-amber-800">
                  AI Service Unavailable
                </h3>

                <p className="mt-1 text-sm text-amber-700">
                  {error}
                </p>
              </div>
            )}

            {/* Start Button */}
            <button
              onClick={
                handleStartInterview
              }
              disabled={
                generatingQuestions ||
                !type ||
                !difficulty ||
                !count ||
                !selectedRole ||
                (selectedRole ===
                  "Other (custom role)" &&
                  !roleValidated)
              }
              className="w-full rounded-xl bg-[#2563eb] px-5 py-4 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {generatingQuestions ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Generating Questions...
                </span>
              ) : (
                "Start Interview"
              )}
            </button>
          </div>
        </div>
      </SidebarLayout>
    );
}

export default InterviewSetup;