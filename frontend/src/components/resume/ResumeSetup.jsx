import {
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  FileText,
} from "lucide-react";

import SidebarLayout from "../../layouts/SidebarLayout";

function ResumeSetup({
  selectedRole,
  setSelectedRole,
  customRole,
  setCustomRole,
  roleValidated,
  validatingRole,
  roleValidationError,
  handleValidateRole,
  roleOptions,
  file,
  fileInputRef,
  handleDrop,
  handleInputChange,
  handleRemoveFile,
  error,
  analyzing,
  handleAnalyzeResume,
}) {
    return (
      <SidebarLayout>
        <div className="mx-auto flex min-h-[calc(100vh-120px)] max-w-4xl items-center p-4 md:p-8">
          <div className="w-full rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm md:p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#0f172a]">
                Resume Analyzer
              </h1>

              <p className="mt-2 text-[#64748b]">
                Get your ATS score
                and improvement
                suggestions
              </p>
            </div>

            {/* Role */}
            <div className="mb-8">
              <label className="mb-3 block text-sm font-medium text-[#0f172a]">
                Target Role
              </label>

              <select
                value={
                  selectedRole
                }
                onChange={(e) =>
                  setSelectedRole(
                    e.target.value
                  )
                }
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
                    onChange={(e) =>
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
                        Role validated:
                        {" "}
                        {
                          customRole
                        }
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

            {/* File Upload */}
            <div className="mb-8">
              <label className="mb-3 block text-sm font-medium text-[#0f172a]">
                Resume File
              </label>

              <div
                onDragOver={(
                  e
                ) =>
                  e.preventDefault()
                }
                onDrop={
                  handleDrop
                }
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="
                  cursor-pointer
                  rounded-xl
                  border-2
                  border-dashed
                  border-[#e2e8f0]
                  bg-[#f8fafc]
                  p-8
                  text-center
                  transition
                  hover:border-[#2563eb]
                "
              >
                <Upload
                  className="mx-auto mb-3 text-[#2563eb]"
                  size={36}
                />

                <p className="font-medium text-[#0f172a]">
                  Drag & Drop your
                  resume here
                </p>

                <p className="mt-2 text-sm text-[#64748b]">
                  Or click to browse
                  PDF or DOCX files
                </p>

                <input
                  ref={
                    fileInputRef
                  }
                  type="file"
                  accept=".pdf,.docx"
                  onChange={
                    handleInputChange
                  }
                  className="hidden"
                />
              </div>

              {file && (
                <div className="mt-4 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <FileText
                        size={22}
                        className="text-[#2563eb]"
                      />

                      <div>
                        <p className="font-medium text-[#0f172a]">
                          {file.name}
                        </p>

                        <p className="text-sm text-[#64748b]">
                          {
                            file.type
                          }
                          {" • "}
                          {(
                            file.size /
                            1024 /
                            1024
                          ).toFixed(
                            2
                          )}
                          MB
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={
                        handleRemoveFile
                      }
                      className="text-red-500"
                    >
                      <X
                        size={18}
                      />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
                {error}
              </div>
            )}

            {/* Analyze Button */}
            <button
              onClick={
                handleAnalyzeResume
              }
              disabled={
                analyzing ||
                !selectedRole ||
                !file ||
                (
                  selectedRole ===
                    "Other (custom role)" &&
                  !roleValidated
                )
              }
              className="
                w-full
                rounded-xl
                bg-[#2563eb]
                px-5
                py-4
                font-medium
                text-white
                transition
                hover:bg-blue-700
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {analyzing ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Analyzing...
                </span>
              ) : (
                "Analyze Resume"
              )}
            </button>
          </div>
        </div>
      </SidebarLayout>
    );
}

export default ResumeSetup;