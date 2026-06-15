import { useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  AlertCircle
} from "lucide-react";

import axiosInstance from "../api/axiosInstance";

import SidebarLayout from "../layouts/SidebarLayout";

import ResumeAnalyzing from "../components/resume/ResumeAnalyzing";
import ResumeReport from "../components/resume/ResumeReport";
import ResumeSetup from "../components/resume/ResumeSetup";

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
      <ResumeSetup
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        customRole={customRole}
        setCustomRole={setCustomRole}
        roleValidated={roleValidated}
        validatingRole={validatingRole}
        roleValidationError={roleValidationError}
        handleValidateRole={handleValidateRole}
        roleOptions={roleOptions}
        file={file}
        fileInputRef={fileInputRef}
        handleDrop={handleDrop}
        handleInputChange={handleInputChange}
        handleRemoveFile={handleRemoveFile}
        error={error}
        analyzing={analyzing}
        handleAnalyzeResume={handleAnalyzeResume}
      />
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
      <ResumeAnalyzing />
    );
  }

    /**
   * Report Phase
   */
  if (
    phase === "report" &&
    report
  ) {
    return (
      <ResumeReport
        report={report}
        navigate={navigate}
        resetAnalysis={resetAnalysis}
        setError={setError}
      />
    );
  }

  return null;
}

export default ResumePage;