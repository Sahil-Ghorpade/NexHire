import { useEffect, useState } from "react";

import axiosInstance from "../api/axiosInstance";

import {
  Search,
  Brain,
  FileText,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

function HistoryPage() {
  /**
   * State
   */
  const [items, setItems] =
    useState([]);

  const [filter, setFilter] =
    useState("all");

  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    expandedId,
    setExpandedId,
  ] = useState(null);

  const [
    deletingId,
    setDeletingId,
  ] = useState(null);

  const [
    confirmDeleteId,
    setConfirmDeleteId,
  ] = useState(null);

  /**
   * Fetch History
   */
  useEffect(() => {
    const fetchHistory =
      async () => {
        try {
          setLoading(true);

          setError("");

          const [
            interviewResponse,
            resumeResponse,
          ] =
            await Promise.all([
              axiosInstance.get(
                "/api/interview"
              ),
              axiosInstance.get(
                "/api/resume"
              ),
            ]);

          const interviews =
            (
              interviewResponse
                .data
                ?.interviews ||
              []
            ).map(
              (
                interview
              ) => ({
                ...interview,
                itemType:
                  "interview",
              })
            );

          const analyses =
            (
              resumeResponse
                .data
                ?.analyses ||
              []
            ).map(
              (
                analysis
              ) => ({
                ...analysis,
                itemType:
                  "resume",
              })
            );

          const mergedItems =
            [
              ...interviews,
              ...analyses,
            ].sort(
              (
                a,
                b
              ) =>
                new Date(
                  b.createdAt
                ) -
                new Date(
                  a.createdAt
                )
            );

          setItems(
            mergedItems
          );
        } catch (error) {
          const responseData =
            error?.response
              ?.data;

          setError(
            responseData?.message ||
              "Failed to load history"
          );
        } finally {
          setLoading(false);
        }
      };

    fetchHistory();
  }, []);

  /**
   * Filter + Search
   */
  const filteredItems =
    items.filter(
      (item) => {
        const matchesFilter =
          filter === "all"
            ? true
            : item.itemType ===
              filter;

        const matchesSearch =
          item.role
            ?.toLowerCase()
            .includes(
              searchQuery.toLowerCase()
            );

        return (
          matchesFilter &&
          matchesSearch
        );
      }
    );

  /**
   * Loading State
   */
  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="text-lg text-[#64748b]">
          Loading history...
        </p>
      </div>
    );
  }

  /**
   * Error State
   */
  if (error) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  /**
   * Empty State
   */
  if (
    !loading &&
    items.length === 0
  ) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-6 text-center">
        <div>
          <h2 className="text-2xl font-semibold text-[#0f172a]">
            No history yet
          </h2>

          <p className="mt-3 text-[#64748b]">
            Start an interview
            or analyze your
            resume.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0f172a]">
          History
        </h1>

        <p className="mt-2 text-[#64748b]">
          All your interviews
          and resume analyses
        </p>
      </div>

      {/* Search + Filter */}
      <div className="mb-8 rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Search */}
          <div className="relative w-full md:max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]"
            />

            <input
              type="text"
              placeholder="Search by role..."
              value={
                searchQuery
              }
              onChange={(e) =>
                setSearchQuery(
                  e.target
                    .value
                )
              }
              className="
                w-full
                rounded-lg
                border
                border-[#e2e8f0]
                py-3
                pl-10
                pr-4
                outline-none
                focus:border-[#2563eb]
              "
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {[
              {
                label:
                  "All",
                value:
                  "all",
              },
              {
                label:
                  "Interviews",
                value:
                  "interview",
              },
              {
                label:
                  "Analyses",
                value:
                  "resume",
              },
            ].map(
              (
                option
              ) => (
                <button
                  key={
                    option.value
                  }
                  onClick={() =>
                    setFilter(
                      option.value
                    )
                  }
                  className={`
                    rounded-lg
                    px-4
                    py-2
                    text-sm
                    font-medium
                    transition

                    ${
                      filter ===
                      option.value
                        ? "bg-[#2563eb] text-white"
                        : "border border-[#e2e8f0] bg-white text-[#64748b]"
                    }
                  `}
                >
                  {
                    option.label
                  }
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-4">

        {filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-12 text-center">
            <p className="text-[#64748b]">
              No matching history found.
            </p>
          </div>
          ) : (
          filteredItems.map((item) => {
            const isExpanded =
              expandedId === item._id;

          const isDeleting =
            deletingId === item._id;

          const isConfirming =
            confirmDeleteId ===
            item._id;

          const formattedDate =
            new Date(
              item.createdAt
            ).toLocaleDateString(
              "en-US",
              {
                month:
                  "short",
                day: "numeric",
                year: "numeric",
              }
            );

          return (
            <div
              key={item._id}
              className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-sm"
            >
              {/* Card Header */}
              <div className="p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  {/* Left */}
                  <div>
                    <div className="mb-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          item.itemType ===
                          "interview"
                            ? "bg-blue-100 text-[#2563eb]"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {item.itemType ===
                        "interview"
                          ? "Interview"
                          : "Resume"}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold text-[#0f172a]">
                      {item.role}
                    </h3>

                    <p className="mt-1 text-sm text-[#64748b]">
                      {
                        formattedDate
                      }
                    </p>
                  </div>

                  {/* Right */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="rounded-lg bg-slate-50 px-4 py-2">
                      <span className="font-semibold text-[#0f172a]">
                        {item.itemType ===
                        "interview"
                          ? `${item.overallScore}/10`
                          : `${item.atsScore}%`}
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        setExpandedId(
                          isExpanded
                            ? null
                            : item._id
                        )
                      }
                      className="flex items-center gap-2 rounded-lg border border-[#e2e8f0] px-4 py-2"
                    >
                      View

                      {isExpanded ? (
                        <ChevronUp
                          size={16}
                        />
                      ) : (
                        <ChevronDown
                          size={16}
                        />
                      )}
                    </button>

                    <button
                      onClick={() =>
                        setConfirmDeleteId(
                          item._id
                        )
                      }
                      className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-red-600"
                    >
                      <Trash2
                        size={16}
                      />

                      Delete
                    </button>
                  </div>
                </div>

                {/* Delete Confirmation */}
                {isConfirming && (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                    <p className="mb-3 text-red-700">
                      Are you sure
                      you want to
                      delete this
                      item?
                    </p>

                    <div className="flex gap-3">
                      <button
                        onClick={async () => {
                          try {
                            setDeletingId(
                              item._id
                            );

                            const endpoint =
                              item.itemType ===
                              "interview"
                                ? `/api/interview/${item._id}`
                                : `/api/resume/${item._id}`;

                            await axiosInstance.delete(
                              endpoint
                            );

                            setItems(
                              (
                                prev
                              ) =>
                                prev.filter(
                                  (
                                    historyItem
                                  ) =>
                                    historyItem._id !==
                                    item._id
                                )
                            );

                            setConfirmDeleteId(
                              null
                            );

                            if (
                              expandedId ===
                              item._id
                            ) {
                              setExpandedId(
                                null
                              );
                            }
                          } catch {
  setError(
    "Failed to delete item. Please try again."
  );
} finally {
                            setDeletingId(
                              null
                            );
                          }
                        }}
                        disabled={
                          isDeleting
                        }
                        className="rounded-lg bg-red-600 px-4 py-2 text-white"
                      >
                        {isDeleting
                          ? "Deleting..."
                          : "Confirm"}
                      </button>

                      <button
                        onClick={() =>
                          setConfirmDeleteId(
                            null
                          )
                        }
                        className="rounded-lg border border-[#e2e8f0] px-4 py-2"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Expanded Interview */}
                {isExpanded &&
                  item.itemType ===
                    "interview" && (
                    <div className="mt-6 border-t border-[#e2e8f0] pt-6">
                      {/* Summary */}
                      <div className="mb-6 grid gap-4 md:grid-cols-4">
                        <div className="rounded-xl bg-slate-50 p-4">
                          <p className="text-sm text-[#64748b]">
                            Score
                          </p>

                          <h3 className="mt-2 text-2xl font-bold">
                            {
                              item.overallScore
                            }
                            /10
                          </h3>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-4">
                          <p className="text-sm text-[#64748b]">
                            Attempt
                            Rate
                          </p>

                          <h3 className="mt-2 text-2xl font-bold">
                            {
                              item.attemptRate
                            }
                            %
                          </h3>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-4">
                          <p className="text-sm text-[#64748b]">
                            Attempted
                          </p>

                          <h3 className="mt-2 text-2xl font-bold">
                            {
                              item.attempted
                            }
                          </h3>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-4">
                          <p className="text-sm text-[#64748b]">
                            Skipped
                          </p>

                          <h3 className="mt-2 text-2xl font-bold">
                            {
                              item.skipped
                            }
                          </h3>
                        </div>
                      </div>

                      {/* Strengths */}
                      <div className="mb-6">
                        <h4 className="mb-3 text-lg font-semibold">
                          Strengths
                        </h4>

                        <div className="space-y-2">
                          {item.strengths?.map(
                            (
                              strength,
                              index
                            ) => (
                              <div
                                key={
                                  index
                                }
                                className="rounded-lg border border-green-200 bg-green-50 p-3 text-green-800"
                              >
                                {
                                  strength
                                }
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {/* Weak Areas */}
                      <div className="mb-6">
                        <h4 className="mb-3 text-lg font-semibold">
                          Weak Areas
                        </h4>

                        <div className="space-y-2">
                          {item.weakAreas?.map(
                            (
                              area,
                              index
                            ) => (
                              <div
                                key={
                                  index
                                }
                                className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-700"
                              >
                                {
                                  area
                                }
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {/* Recommendations */}
                      <div className="mb-6">
                        <h4 className="mb-3 text-lg font-semibold">
                          Recommendations
                        </h4>

                        <ol className="list-decimal space-y-2 pl-5 text-[#64748b]">
                          {item.recommendations?.map(
                            (
                              recommendation,
                              index
                            ) => (
                              <li
                                key={
                                  index
                                }
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
                      <div>
                        <h4 className="mb-4 text-lg font-semibold">
                          Question
                          Breakdown
                        </h4>

                        <div className="space-y-4">
                          {item.questions?.map(
                            (
                              question,
                              index
                            ) => (
                              <div
                                key={
                                  index
                                }
                                className="rounded-xl border border-[#e2e8f0] p-4"
                              >
                                <p className="font-medium text-[#0f172a]">
                                  Q
                                  {index +
                                    1}
                                  .{" "}
                                  {
                                    question.question
                                  }
                                </p>

                                <p className="mt-3 text-[#64748b]">
                                  <strong>
                                    Answer:
                                  </strong>{" "}
                                  {question.answer ||
                                    "Skipped"}
                                </p>

                                <div className="mt-4">
                                  <div className="mb-2 flex justify-between">
                                    <span>
                                      Score
                                    </span>

                                    <span>
                                      {
                                        question.score
                                      }
                                      /10
                                    </span>
                                  </div>

                                  <div className="h-2 rounded-full bg-slate-100">
                                    <div
                                      className="h-full rounded-full bg-[#2563eb]"
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
                      </div>

                      {/* Learning Path */}
                      <div className="mt-6">
                        <h4 className="mb-4 text-lg font-semibold">
                          Learning
                          Path
                        </h4>

                        <div className="space-y-3">
                          {item.learningPath?.map(
                            (
                              learning,
                              index
                            ) => (
                              <div
                                key={
                                  index
                                }
                                className="rounded-xl border border-[#e2e8f0] p-4"
                              >
                                <p className="font-medium">
                                  {
                                    learning.topic
                                  }
                                </p>

                                <a
                                  href={
                                    learning.resource
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[#2563eb] hover:underline"
                                >
                                  {
                                    learning.resource
                                  }
                                </a>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                
                {/* Expanded Resume */}
                {isExpanded &&
                  item.itemType ===
                    "resume" && (
                    <div className="mt-6 border-t border-[#e2e8f0] pt-6">
                      {/* ATS Score */}
                      <div className="mb-6 rounded-xl border border-[#e2e8f0] bg-slate-50 p-5">
                        <div className="mb-3 flex items-center justify-between">
                          <h4 className="text-lg font-semibold text-[#0f172a]">
                            ATS Score
                          </h4>

                          <span
                            className={`text-2xl font-bold ${
                              item.atsScore >= 70
                                ? "text-green-600"
                                : item.atsScore >= 50
                                ? "text-orange-500"
                                : "text-red-500"
                            }`}
                          >
                            {item.atsScore}%
                          </span>
                        </div>

                        <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className={`h-full ${
                              item.atsScore >= 70
                                ? "bg-green-500"
                                : item.atsScore >= 50
                                ? "bg-orange-500"
                                : "bg-red-500"
                            }`}
                            style={{
                              width: `${item.atsScore}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Skills Found */}
                      <div className="mb-6">
                        <h4 className="mb-3 text-lg font-semibold text-[#0f172a]">
                          Skills Found
                        </h4>

                        <div className="flex flex-wrap gap-2">
                          {item.skillsFound?.map(
                            (
                              skill,
                              index
                            ) => (
                              <span
                                key={
                                  index
                                }
                                className="rounded-full bg-green-100 px-3 py-2 text-sm font-medium text-green-700"
                              >
                                {skill}
                              </span>
                            )
                          )}
                        </div>
                      </div>

                      {/* Missing Skills */}
                      <div className="mb-6">
                        <h4 className="mb-3 text-lg font-semibold text-[#0f172a]">
                          Missing Skills
                        </h4>

                        <div className="flex flex-wrap gap-2">
                          {item.missingSkills?.map(
                            (
                              skill,
                              index
                            ) => (
                              <span
                                key={
                                  index
                                }
                                className="rounded-full bg-red-100 px-3 py-2 text-sm font-medium text-red-600"
                              >
                                {skill}
                              </span>
                            )
                          )}
                        </div>
                      </div>

                      {/* Strengths */}
                      <div className="mb-6">
                        <h4 className="mb-3 text-lg font-semibold text-[#0f172a]">
                          Strengths
                        </h4>

                        <div className="space-y-2">
                          {item.strengths?.map(
                            (
                              strength,
                              index
                            ) => (
                              <div
                                key={
                                  index
                                }
                                className="rounded-lg border border-green-200 bg-green-50 p-3 text-green-800"
                              >
                                {
                                  strength
                                }
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {/* Weaknesses */}
                      <div className="mb-6">
                        <h4 className="mb-3 text-lg font-semibold text-[#0f172a]">
                          Weaknesses
                        </h4>

                        <div className="space-y-2">
                          {item.weaknesses?.map(
                            (
                              weakness,
                              index
                            ) => (
                              <div
                                key={
                                  index
                                }
                                className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-700"
                              >
                                {
                                  weakness
                                }
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {/* Suggestions */}
                      <div>
                        <h4 className="mb-3 text-lg font-semibold text-[#0f172a]">
                          Suggestions
                        </h4>

                        <ol className="list-decimal space-y-2 pl-5 text-[#64748b]">
                          {item.suggestions?.map(
                            (
                              suggestion,
                              index
                            ) => (
                              <li
                                key={
                                  index
                                }
                              >
                                {
                                  suggestion
                                }
                              </li>
                            )
                          )}
                        </ol>
                      </div>
                    </div>
                  )}
            </div>
          </div>
          );
          })
        )}
      </div>
    </div>
  );
}

export default HistoryPage;