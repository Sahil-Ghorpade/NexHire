import { useState, useEffect, useRef } from "react";

import { useNavigate } from "react-router-dom";

import {
  Brain,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

import axiosInstance from "../api/axiosInstance";

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
    useState(120);

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

  const [error, setError] =
    useState("");

  /**
   * Report State
   */
  const [report, setReport] =
    useState(null);

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
      phase ===
        "session" &&
      timeLeft === 0
    ) {
      handleSkipQuestion();
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
   * Available Options
   */
  const interviewTypes = [
    "Technical",
    "HR",
    "Behavioral",
    "Mixed",
  ];

  const difficulties = [
    "Easy",
    "Medium",
    "Hard",
  ];

  const questionCounts = [
    5,
    10,
    15,
  ];

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

        setTimeLeft(120);

        setPhase(
          "session"
        );
      } catch (error) {
        const responseData =
          error?.response?.data;

        setError(
          responseData?.message ||
            "Failed to generate interview questions"
        );
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
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
              {error}
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
              !selectedRolerole ||
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
    );
  }

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

      setTimeLeft(120);
    };

  /**
   * Submit Current Answer
   */
  const handleSubmitAnswer =
    () => {
      if (
        !currentAnswer.trim()
      ) {
        handleSkipQuestion();

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

      setTimeLeft(120);
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
      <div className="mx-auto max-w-4xl p-4 md:p-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-medium text-[#0f172a]">
              Question{" "}
              {currentIndex +
                1}{" "}
              of{" "}
              {
                questions.length
              }
            </span>

            <span
              className={`text-xl font-bold ${timerColor}`}
            >
              {String(
                minutes
              ).padStart(
                2,
                "0"
              )}
              :
              {String(
                seconds
              ).padStart(
                2,
                "0"
              )}
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full bg-[#2563eb] transition-all"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-2xl font-semibold text-[#0f172a]">
            {
              questions[
                currentIndex
              ]
            }
          </h2>

          <textarea
            value={
              currentAnswer
            }
            onChange={(e) =>
              setCurrentAnswer(
                e.target.value
              )
            }
            placeholder="Type your answer here..."
            className="min-h-[150px] w-full rounded-xl border border-[#e2e8f0] p-4 outline-none focus:border-[#2563eb]"
          />

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={
                handleSubmitAnswer
              }
              className="rounded-xl bg-[#2563eb] px-5 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              Submit Answer
            </button>

            <button
              onClick={() => {
              const confirmSkip =
                window.confirm(
                  "Are you sure you want to skip this question?"
                );

              if (confirmSkip) {
                handleSkipQuestion();
              }
            }}
              className="rounded-xl border border-[#e2e8f0] px-5 py-3 font-medium text-[#0f172a]"
            >
              Skip Question
            </button>
          </div>
        </div>
      </div>
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
      setTimeLeft(120);

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

    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
        <div className="mb-6 h-14 w-14 animate-spin rounded-full border-4 border-[#e2e8f0] border-t-[#2563eb]" />

        <h2 className="text-3xl font-bold text-[#0f172a]">
          Evaluating your
          interview...
        </h2>

        <p className="mt-3 text-[#64748b]">
          Our AI is analyzing
          your answers. This
          may take a moment.
        </p>
      </div>
    );
  }

  /**
   * Report Phase
   */
  if (
    phase === "report" &&
    report
  ) {
    const scorePercent =
      (report.overallScore /
        10) *
      100;

    return (
      <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-8">
        {/* Header */}
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#0f172a]">
                Interview
                Complete
              </h1>

              <p className="mt-2 text-[#64748b]">
                Here's your
                detailed
                performance
                report.
              </p>
            </div>

            <div className="rounded-full bg-blue-50 px-5 py-3 text-lg font-semibold text-[#2563eb]">
              {report.overallScore}
              /10
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="grid gap-4 md:grid-cols-4">
          {[
            {
              label:
                "Overall Score",
              value: `${report.overallScore}/10`,
            },
            {
              label:
                "Attempt Rate",
              value: `${report.attemptRate}%`,
            },
            {
              label:
                "Attempted",
              value:
                report.attempted,
            },
            {
              label:
                "Skipped",
              value:
                report.skipped,
            },
          ].map((item) => (
            <div
              key={
                item.label
              }
              className="rounded-xl border border-[#e2e8f0] bg-white p-5"
            >
              <p className="text-sm text-[#64748b]">
                {
                  item.label
                }
              </p>

              <h3 className="mt-2 text-3xl font-bold text-[#0f172a]">
                {
                  item.value
                }
              </h3>
            </div>
          ))}
        </div>

        {/* Score Progress */}
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-5">
          <div className="mb-3 flex justify-between">
            <span className="font-medium text-[#0f172a]">
              Overall
              Performance
            </span>

            <span className="font-medium text-[#2563eb]">
              {
                report.overallScore
              }
              /10
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full bg-[#2563eb]"
              style={{
                width: `${scorePercent}%`,
              }}
            />
          </div>
        </div>

        {/* Strengths */}
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-5">
          <h2 className="mb-4 text-xl font-semibold text-[#0f172a]">
            Strengths
          </h2>

          <div className="space-y-3">
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

        {/* Weak Areas */}
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-5">
          <h2 className="mb-4 text-xl font-semibold text-[#0f172a]">
            Weak Areas
          </h2>

          <div className="space-y-3">
            {report.weakAreas?.map(
              (
                area,
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
                    {area}
                  </p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-5">
          <h2 className="mb-4 text-xl font-semibold text-[#0f172a]">
            Recommendations
          </h2>

          <ol className="list-decimal space-y-2 pl-5 text-[#64748b]">
            {report.recommendations?.map(
              (
                recommendation,
                index
              ) => (
                <li
                  key={index}
                >
                  {
                    recommendation
                  }
                </li>
              )
            )}
          </ol>
        </div>

        {/* Question Breakdown */}
        <div className="space-y-4">
          {report.questions?.map(
            (
              question,
              index
            ) => (
              <div
                key={index}
                className="rounded-xl border border-[#e2e8f0] bg-white p-5"
              >
                <h3 className="font-semibold text-[#0f172a]">
                  Q
                  {index +
                    1}
                  .{" "}
                  {
                    question.question
                  }
                </h3>

                <p className="mt-3 text-[#64748b]">
                  <span className="font-medium text-[#0f172a]">
                    Your
                    Answer:
                  </span>{" "}
                  {question.answer ||
                    "Skipped"}
                </p>

                <div className="mt-4">
                  <div className="mb-2 flex justify-between">
                    <span>
                      Score
                    </span>

                    <span className="font-medium text-[#2563eb]">
                      {
                        question.score
                      }
                      /10
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full bg-[#2563eb]"
                      style={{
                        width: `${
                          question.score *
                          10
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <p className="mt-4 text-sm text-[#64748b]">
                  {
                    question.feedback
                  }
                </p>
              </div>
            )
          )}
        </div>

        {/* Learning Path */}
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-5">
          <h2 className="mb-4 text-xl font-semibold text-[#0f172a]">
            Learning Path
          </h2>

          <div className="space-y-3">
            {report.learningPath?.map(
              (
                item,
                index
              ) => (
                <div
                  key={index}
                  className="rounded-lg border border-[#e2e8f0] p-4"
                >
                  <p className="font-medium text-[#0f172a]">
                    {
                      item.topic
                    }
                  </p>

                  <a
                    href={
                      item.resource
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#2563eb] hover:underline"
                  >
                    {
                      item.resource
                    }
                  </a>
                </div>
              )
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={
              resetInterview
            }
            className="rounded-xl bg-[#2563eb] px-5 py-3 text-white"
          >
            Start New
            Interview
          </button>

          <button
            onClick={() =>
              navigate(
                "/history"
              )
            }
            className="rounded-xl border border-[#e2e8f0] px-5 py-3"
          >
            View History
          </button>

          <button
            onClick={() =>
              console.log(
                "download"
              )
            }
            className="rounded-xl border border-[#e2e8f0] px-5 py-3"
          >
            Download Report
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default InterviewPage;