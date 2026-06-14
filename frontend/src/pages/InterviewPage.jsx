import { useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";

import axiosInstance from "../api/axiosInstance";

import InterviewEvaluating from "../components/interview/InterviewEvaluating";
import InterviewReport from "../components/interview/InterviewReport";
import InterviewSession from "../components/interview/InterviewSession";
import InterviewSetup from "../components/interview/InterviewSetup";

import {
  QUESTION_TIME,
  INTERVIEW_TYPES,
  DIFFICULTIES,
  QUESTION_COUNTS,
  ROLE_OPTIONS,
} from "../constants/interview";

function InterviewPage() {
  const navigate = useNavigate();

  /**
   * Phase Control
   */
  const [phase, setPhase] =
    useState("setup");

  /**
   * Setup State
   */
  const [type, setType] =
    useState("");

  const [role, setRole] =
    useState("");

  const [
    customRole,
    setCustomRole,
  ] = useState("");

  const [selectedRole, setSelectedRole] =
  useState("");

  const [difficulty, setDifficulty] =
    useState("");

  const [count, setCount] =
    useState(null);

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
   * Interview Session State
   */
  const [questions, setQuestions] =
    useState([]);

  const [answers, setAnswers] =
    useState([]);

  const [
    currentIndex,
    setCurrentIndex,
  ] = useState(0);

  const [timeLeft, setTimeLeft] =
    useState(QUESTION_TIME);

  const [
    currentAnswer,
    setCurrentAnswer,
  ] = useState("");

  /**
   * Loading State
   */
  const [
    generatingQuestions,
    setGeneratingQuestions,
  ] = useState(false);

  const [error, setError] = useState("");
  const [answerError, setAnswerError] = useState(""); 

  /**
   * Report State
   */
  const [report, setReport] =
    useState(null);

  /**
   * Skip Question State
   */    
  const [
    showSkipConfirm,
    setShowSkipConfirm,
  ] = useState(false);

  /**
   * Refs
   */
  const timerRef = useRef(null);

  const evaluationStarted =
    useRef(false);

      /**
   * Leave Protection
   */
  useEffect(() => {
    const handleBeforeUnload =
      (e) => {
        if (
          phase ===
          "session"
        ) {
          e.preventDefault();
          e.returnValue = "";
        }
      };

    window.addEventListener(
      "beforeunload",
      handleBeforeUnload
    );

    return () =>
      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload
      );
  }, [phase]);

    /**
   * Timer
   */
  useEffect(() => {
    if (
      phase !==
      "session"
    )
      return;

    timerRef.current =
      setInterval(() => {
        setTimeLeft(
          (prev) => {
            if (prev <= 1) {
              return 0;
            }

            return prev - 1;
          }
        );
      }, 1000);

    return () =>
      clearInterval(
        timerRef.current
      );
  }, [
    phase,
    currentIndex,
  ]);

    /**
   * Auto Skip
   */
  useEffect(() => {
    if (
      phase === "session" &&
      timeLeft === 0
    ) {
      handleTimeExpired();
    }
  }, [
    timeLeft,
    phase,
  ]);

      /**
   * Evaluate Interview
   */
  useEffect(() => {
    if (
      phase !== "evaluating"
    )
      return;

    if (
      evaluationStarted.current
    )
      return;

    evaluationStarted.current =
      true;

    const evaluateInterview =
      async () => {
        try {
          const response =
            await axiosInstance.post(
              "/api/interview/evaluate",
              {
                type,
                role,
                difficulty,
                questions:
                  questions.map(
                    (
                      question,
                      index
                    ) => ({
                      question,
                      answer:
                        answers[
                          index
                        ],
                    })
                  ),
              }
            );

          setReport(
            response.data
              .interview
          );

          setPhase(
            "report"
          );
        } catch (error) {
          const responseData =
            error?.response?.data;

          setError(
            responseData?.message ||
              "Failed to evaluate interview"
          );
        }
      };

    evaluateInterview();
  }, [
    phase,
    answers,
    questions,
    type,
    role,
    difficulty,
  ]);

  /**
   * Reset role validation
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
   * Generate Questions
   */
  const handleStartInterview =
    async () => {
      try {
        setGeneratingQuestions(
          true
        );

        setError("");

        const resolvedRole =
          selectedRole ===
          "Other (custom role)"
            ? customRole.trim()
            : selectedRole;

        const response =
          await axiosInstance.post(
            "/api/interview/generate-questions",
            {
              type,
              role:
                resolvedRole,
              difficulty,
              count,
            }
          );

        const generatedQuestions =
          response.data
            .questions;

        if (
          !Array.isArray(
            generatedQuestions
          ) ||
          generatedQuestions.length === 0
        ) {
          throw new Error(
            "No interview questions were generated."
          );
        }

        setRole(resolvedRole);

        setQuestions(
          generatedQuestions
        );

        setAnswers(
          new Array(
            generatedQuestions.length
          ).fill(null)
        );

        setCurrentIndex(0);

        setCurrentAnswer(
          ""
        );

        setTimeLeft(QUESTION_TIME);

        setPhase(
          "session"
        );
      } catch (error) {
        const responseData =
          error?.response?.data;

        const backendMessage =
          responseData?.message || 
          error.message || 
          "";

        if (
          backendMessage.includes(
            "GoogleGenerativeAI"
          ) ||
          backendMessage.includes(
            "503"
          )
        ) {
          setError(
            "AI service is currently unavailable. Please try again in a few minutes."
          );
        } else {
          setError(
            backendMessage ||
              "Unable to start interview right now. Please try again."
          );
        }
      } finally {
        setGeneratingQuestions(
          false
        );
      }
    };

  /**
   * Setup Phase
   */
  if (phase === "setup") {
    return (
      <InterviewSetup
        type={type}
        setType={setType}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        role={role}
        setRole={setRole}
        customRole={customRole}
        setCustomRole={setCustomRole}
        roleValidated={roleValidated}
        validatingRole={validatingRole}
        roleValidationError={roleValidationError}
        setRoleValidated={setRoleValidated}
        setRoleValidationError={setRoleValidationError}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        count={count}
        setCount={setCount}
        error={error}
        generatingQuestions={generatingQuestions}
        handleValidateRole={handleValidateRole}
        handleStartInterview={handleStartInterview}
        interviewTypes={INTERVIEW_TYPES}
        difficulties={DIFFICULTIES}
        questionCounts={QUESTION_COUNTS}
        roleOptions={ROLE_OPTIONS}
      />
    );
  }

  const handleTimeExpired =
    () => {
      const answer =
        currentAnswer.trim();

      setShowSkipConfirm(false);

      // User wrote something
      if (answer) {
        const updatedAnswers =
          [...answers];

        updatedAnswers[
          currentIndex
        ] = answer;

        setAnswers(
          updatedAnswers
        );
      }
      // User wrote nothing
      else {
        const updatedAnswers =
          [...answers];

        updatedAnswers[
          currentIndex
        ] = null;

        setAnswers(
          updatedAnswers
        );
      }

      if (
        currentIndex ===
        questions.length - 1
      ) {
        setPhase(
          "evaluating"
        );

        return;
      }

      setCurrentIndex(
        (prev) =>
          prev + 1
      );

      setCurrentAnswer("");

      setTimeLeft(QUESTION_TIME);
    };

  /**
   * Skip Current Question
   */
  const handleSkipQuestion =
    () => {
      const updatedAnswers =
        [...answers];

      updatedAnswers[
        currentIndex
      ] = null;

      setShowSkipConfirm(false);

      setAnswers(
        updatedAnswers
      );

      if (
        currentIndex ===
        questions.length - 1
      ) {
        setPhase(
          "evaluating"
        );

        return;
      }

      setCurrentIndex(
        (prev) =>
          prev + 1
      );

      setCurrentAnswer(
        ""
      );

      setTimeLeft(QUESTION_TIME);
    };

  /**
   * Submit Current Answer
   */
  const handleSubmitAnswer =
    () => {
      setAnswerError("");
      if (
        !currentAnswer.trim()
      ) {
        setAnswerError(
          "Please enter an answer or use Skip Question."
        );

        return;
      }

      const updatedAnswers =
        [...answers];

      updatedAnswers[
        currentIndex
      ] =
        currentAnswer.trim();

      setAnswers(
        updatedAnswers
      );

      if (
        currentIndex ===
        questions.length - 1
      ) {
        setPhase(
          "evaluating"
        );

        return;
      }

      setCurrentIndex(
        (prev) =>
          prev + 1
      );

      setCurrentAnswer(
        ""
      );

      setTimeLeft(QUESTION_TIME);
    };

  /**
   * Session Phase
   */
  if (phase === "session") {
    const progress =
      ((currentIndex + 1) /
        questions.length) *
      100;

    const minutes =
      Math.floor(
        timeLeft / 60
      );

    const seconds =
      timeLeft % 60;

    const timerColor =
      timeLeft <= 10
        ? "text-red-500"
        : timeLeft <= 30
        ? "text-orange-500"
        : "text-[#2563eb]";

      return (
      <InterviewSession
        questions={questions}
        currentIndex={currentIndex}
        currentAnswer={currentAnswer}
        setCurrentAnswer={setCurrentAnswer}
        answerError={answerError}
        setAnswerError={setAnswerError}
        handleSubmitAnswer={handleSubmitAnswer}
        showSkipConfirm={showSkipConfirm}
        setShowSkipConfirm={setShowSkipConfirm}
        handleSkipQuestion={handleSkipQuestion}
        progress={progress}
        minutes={minutes}
        seconds={seconds}
        timerColor={timerColor}
      />
    );
  }

  /**
   * Reset Interview
   */
  const resetInterview =
    () => {
      setPhase("setup");

      setType("");
      setRole("");
      setSelectedRole("");
      setCustomRole("");
      setDifficulty("");
      setCount(null);

      setQuestions([]);
      setAnswers([]);

      setCurrentIndex(0);
      setCurrentAnswer("");
      setTimeLeft(QUESTION_TIME);

      setRoleValidated(
        false
      );

      setRoleValidationError(
        ""
      );

      setReport(null);

      setError("");

      evaluationStarted.current =
        false;
    };

  /**
   * Evaluating Phase
   */
  if (
    phase === "evaluating"
  ) {
    if (error) {
      return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
            {error}
          </div>

          <button
            onClick={() => {
              evaluationStarted.current =
                false;

              setPhase(
                "setup"
              );
            }}
            className="rounded-xl bg-[#2563eb] px-5 py-3 text-white"
          >
            Try Again
          </button>
        </div>
      );
    }

    return(
      <InterviewEvaluating />
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
    <InterviewReport
      report={report}
      navigate={navigate}
      resetInterview={resetInterview}
    />
  );
  }

  return null;
}

export default InterviewPage;