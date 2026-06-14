import { useState, useEffect, useRef } from "react";

import { useNavigate } from "react-router-dom";

import {
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  FileText,
} from "lucide-react";

import axiosInstance from "../api/axiosInstance";

import SidebarLayout from "../components/SidebarLayout";

import { downloadPDF } from "../utils/downloadPDF";

function ResumePage() {
  const navigate = useNavigate();

  /**
   * Phase Control
   */
  const [phase, setPhase] =
    useState("setup");

  /**
   * Role State
   */
  const [role, setRole] =
    useState("");

  const [
    selectedRole,
    setSelectedRole,
  ] = useState("");

  const [
    customRole,
    setCustomRole,
  ] = useState("");

  /**
   * Role Validation
   */
  const [
    roleValidated,
    setRoleValidated,
  ] = useState(false);

  const [
    validatingRole,
    setValidatingRole,
  ] = useState(false);

  const [
    roleValidationError,
    setRoleValidationError,
  ] = useState("");

  /**
   * File State
   */
  const [file, setFile] =
    useState(null);

  /**
   * Report State
   */
  const [report, setReport] =
    useState(null);

  /**
   * UI State
   */
  const [error, setError] =
    useState("");

  const [
    analyzing,
    setAnalyzing,
  ] = useState(false);

  /**
   * Refs
   */
  const fileInputRef =
    useRef(null);

  const analysisStarted =
    useRef(false);

      /**
   * Analyze Resume
   */
  const handleAnalyzeResume =
    () => {
      setPhase(
        "analyzing"
      );
    };

      /**
   * Start Analysis
   */
  useEffect(() => {
    if (
      phase !==
      "analyzing"
    )
      return;

    if (
      analysisStarted.current
    )
      return;

    analysisStarted.current =
      true;

    const analyzeResume =
      async () => {
        try {
          setAnalyzing(true);

          setError("");

          const finalRole =
            selectedRole ===
            "Other (custom role)"
              ? customRole.trim()
              : selectedRole;

          const formData =
            new FormData();

          formData.append(
            "role",
            finalRole
          );

          formData.append(
            "resume",
            file
          );

          const response =
            await axiosInstance.post(
              "/api/resume/analyze",
              formData,
              {
                headers:
                  {
                    "Content-Type":
                      "multipart/form-data",
                  },
              }
            );

          setRole(
            finalRole
          );

          setReport(
            response.data
              .analysis
          );

          setPhase(
            "report"
          );
        } catch (error) {
            const responseData =
              error?.response?.data;

            const backendMessage =
              responseData?.message || "";

            if (
              backendMessage ===
              "File size must be less than 5MB"
            ) {
              setError(
                "File size must be less than 5MB"
              );
            }

            else if (
              backendMessage ===
              "Could not extract text from the file."
            ) {
              setError(
                "We couldn't read any text from this file. Please upload a valid resume in PDF or DOCX format."
              );
            }

            else if (
              backendMessage ===
              "The uploaded file does not appear to be a valid resume."
            ) {
              setError(
                "This file doesn't appear to be a resume. Please upload valid resume and try again."
              );
            }

            else if (
              backendMessage.includes(
                "GoogleGenerativeAI"
              ) ||
              backendMessage.includes(
                "503"
              )
            ) {
              setError(
                "AI analysis is currently unavailable. Please try again in a few minutes."
              );
            }

            else {
              setError(
                backendMessage ||
                "Something went wrong while analyzing your resume."
              );
            }
          } finally {
          setAnalyzing(false);
        }
      };

    analyzeResume();
  }, [
    phase,
    file,
    customRole,
    selectedRole,
  ]);

  /**
   * Role Options
   */
  const roleOptions = [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Data Scientist",
    "Product Manager",
    "Other (custom role)",
  ];

  /**
   * Reset validation
   */
  useEffect(() => {
    setRoleValidated(false);

    setRoleValidationError("");
  }, [customRole]);

  /**
   * Validate Custom Role
   */
  const handleValidateRole =
    async () => {
      if (!customRole.trim()) {
        setRoleValidationError(
          "Please enter a role"
        );

        return;
      }

      try {
        setValidatingRole(true);

        setRoleValidationError("");

        const response =
          await axiosInstance.post(
            "/api/role/validate",
            {
              roleName:
                customRole,
            }
          );

        if (
          response.data.valid
        ) {
          setRoleValidated(true);

          setRoleValidationError(
            ""
          );
        } else {
          setRoleValidated(
            false
          );

          setRoleValidationError(
            "This is not a valid job role"
          );
        }
      } catch (error) {
        const responseData =
          error?.response?.data;

        setRoleValidated(false);

        setRoleValidationError(
          responseData?.message ||
            "Failed to validate role"
        );
      } finally {
        setValidatingRole(false);
      }
    };

  /**
   * File Select
   */
  const handleFileSelect =
    (selectedFile) => {
      if (!selectedFile)
        return;

      if (
        selectedFile.size >
        5 * 1024 * 1024
      ) {
        setError(
          "File size must be less than 5MB"
        );

        return;
      }

      const allowedTypes =
        [
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];

      if (
        !allowedTypes.includes(
          selectedFile.type
        )
      ) {
        setError(
          "Only PDF and DOCX files are allowed."
        );

        return;
      }

      setError("");

      setFile(selectedFile);
    };

  /**
   * File Input Change
   */
  const handleInputChange =
    (event) => {
      const selectedFile =
        event.target.files?.[0];

      handleFileSelect(
        selectedFile
      );
    };

  /**
   * Drag & Drop
   */
  const handleDrop = (
    event
  ) => {
    event.preventDefault();

    const selectedFile =
      event.dataTransfer.files?.[0];

    handleFileSelect(
      selectedFile
    );
  };

  /**
   * Remove File
   */
  const handleRemoveFile =
    () => {
      setFile(null);

      if (
        fileInputRef.current
      ) {
        fileInputRef.current.value =
          "";
      }
    };

  /**
   * Setup Phase
   */
  if (phase === "setup") {
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

  /**
   * Reset Page
   */
  const resetAnalysis =
    () => {
      setPhase(
        "setup"
      );

      setRole("");
      setSelectedRole("");
      setCustomRole("");

      setRoleValidated(
        false
      );

      setRoleValidationError(
        ""
      );

      setFile(null);

      setReport(
        null
      );

      setError("");

      setAnalyzing(
        false
      );

      analysisStarted.current =
        false;

      if (
        fileInputRef.current
      ) {
        fileInputRef.current.value =
          "";
      }
    };

  /**
   * Analyzing Phase
   */
  if (
    phase === "analyzing"
  ) {
    if (error) {
      return (
        <SidebarLayout hideSidebar>
          <div className="flex min-h-[70vh] items-center justify-center p-6">
            <div className="w-full max-w-lg rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">

              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                <AlertCircle
                  size={28}
                  className="text-red-600"
                />
              </div>

              <h2 className="text-2xl font-bold text-[#0f172a]">
                Resume Analysis Failed
              </h2>

              <p className="mt-3 text-[#64748b]">
                {error}
              </p>

              <button
                onClick={() => {
                  analysisStarted.current = false;
                  setPhase("setup");
                }}
                className="mt-6 rounded-xl bg-[#2563eb] px-5 py-3 font-medium text-white hover:bg-blue-700"
              >
                Back to Analyzer
              </button>

            </div>
          </div>
        </SidebarLayout>
      );
    }

    return (
      <SidebarLayout hideSidebar>
        <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
          <div className="mb-6 h-14 w-14 animate-spin rounded-full border-4 border-[#e2e8f0] border-t-[#2563eb]" />

          <h2 className="text-3xl font-bold text-[#0f172a]">
            Analyzing your
            resume...
          </h2>

          <p className="mt-3 max-w-md text-[#64748b]">
            Our AI is reviewing
            your resume against
            the role
            requirements.
          </p>
        </div>
      </SidebarLayout>
    );
  }

    /**
   * Report Phase
   */
  if (
    phase === "report" &&
    report
  ) {
    const atsScore =
      report.atsScore || 0;

    const scoreColor =
      atsScore >= 70
        ? "bg-green-500"
        : atsScore >= 50
        ? "bg-orange-500"
        : "bg-red-500";

    const scoreTextColor =
      atsScore >= 70
        ? "text-green-600"
        : atsScore >= 50
        ? "text-orange-500"
        : "text-red-500";

    return (
      <SidebarLayout>
        <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-8">
          {/* Header */}
          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-[#0f172a]">
                  Resume Analysis
                  Complete
                </h1>

                <p className="mt-2 text-[#64748b]">
                  Here's your ATS
                  evaluation report.
                </p>
              </div>

              <div
                className={`rounded-full px-5 py-3 text-lg font-semibold ${scoreTextColor}`}
              >
                ATS Score:
                {" "}
                {atsScore}
                %
              </div>
            </div>
          </div>

          {/* ATS Score Card */}
          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-8 shadow-sm">
            <div className="text-center">
              <h2 className="mb-4 text-xl font-semibold text-[#0f172a]">
                ATS Score
              </h2>

              <div
                className={`text-6xl font-bold ${scoreTextColor}`}
              >
                {atsScore}
                %
              </div>

              <div className="mx-auto mt-6 h-4 max-w-xl overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full ${scoreColor}`}
                  style={{
                    width: `${atsScore}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Skills Found */}
          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-[#0f172a]">
              Skills Found
            </h2>

            <div className="flex flex-wrap gap-2">
              {report.skillsFound?.map(
                (
                  skill,
                  index
                ) => (
                  <span
                    key={index}
                    className="
                      rounded-full
                      bg-green-100
                      px-3
                      py-2
                      text-sm
                      font-medium
                      text-green-700
                    "
                  >
                    {skill}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Missing Skills */}
          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-[#0f172a]">
              Missing Skills
            </h2>

            <div className="flex flex-wrap gap-2">
              {report.missingSkills?.map(
                (
                  skill,
                  index
                ) => (
                  <span
                    key={index}
                    className="
                      rounded-full
                      bg-red-100
                      px-3
                      py-2
                      text-sm
                      font-medium
                      text-red-600
                    "
                  >
                    {skill}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Strengths */}
          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold text-[#0f172a]">
              Strengths
            </h2>

            <div className="space-y-3 leading-relaxed">
              {report.strengths?.map(
                (
                  strength,
                  index
                ) => (
                  <div
                    key={index}
                    className="
                      flex
                      items-start
                      gap-3
                      rounded-xl
                      border
                      border-green-200
                      bg-green-50
                      p-4
                    "
                  >
                    <div className="mt-1 h-2 w-2 rounded-full bg-green-500" />

                    <p className="text-sm text-green-800">
                      {strength}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Weaknesses */}
          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold text-[#0f172a]">
              Weaknesses
            </h2>

            <div className="space-y-3 leading-relaxed">
              {report.weaknesses?.map(
                (
                  weakness,
                  index
                ) => (
                  <div
                    key={index}
                    className="
                      flex
                      items-start
                      gap-3
                      rounded-xl
                      border
                      border-red-200
                      bg-red-50
                      p-4
                    "
                  >
                    <div className="mt-1 h-2 w-2 rounded-full bg-red-500" />

                    <p className="text-sm text-red-800">
                      {weakness}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Suggestions */}
          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold text-[#0f172a]">
              Suggestions
            </h2>

            <ol className="list-decimal space-y-3 pl-5 text-[#64748b]">
              {report.suggestions?.map(
                (
                  suggestion,
                  index
                ) => (
                  <li
                    key={index}
                  >
                    {suggestion}
                  </li>
                )
              )}
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={
                resetAnalysis
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
              "
            >
              Analyze Another
              Resume
            </button>

            <button
              onClick={() =>
                navigate(
                  "/history"
                )
              }
              className="
                rounded-xl
                border
                border-[#e2e8f0]
                px-5
                py-3
                font-medium
                text-[#0f172a]
              "
            >
              View History
            </button>

            <button
              onClick={async () => {
                try {
                  await downloadPDF(
                    `/api/resume/${report._id}/download`,
                    `resume-analysis.pdf`
                  );
                } catch (err) {
                  setError(err.message);
                }
              }}
              className="
                rounded-xl
                border
                border-[#e2e8f0]
                px-5
                py-3
                font-medium
                text-[#0f172a]
              "
            >
              Download Report
            </button>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return null;
}

export default ResumePage;