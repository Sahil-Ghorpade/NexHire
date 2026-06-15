import SidebarLayout from "../SidebarLayout";

import { downloadPDF } from "../../utils/downloadPDF";

import { useState } from "react";

function InterviewReport({
    report,
    navigate,
    resetInterview,
    handleDownloadReport,
    }) {

    const [downloadError, setDownloadError] =
      useState("");

    const scorePercent =
    (report.overallScore /
        10) *
    100;

    return (
      <SidebarLayout>
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

              {downloadError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-red-600">
                  {downloadError}
                </div>
              )}

            <button
              onClick={async () => {
                try {
                  const safeRole =
                    report.role
                      ?.replace(/\s+/g, "-");

                  await downloadPDF(
                    `/api/interview/${report._id}/download`,
                    `interview-${safeRole}.pdf`
                  );
                } catch (err) {
                  setDownloadError(err.message);
                }
              }}
              className="rounded-xl border border-[#e2e8f0] px-5 py-3"
            >
              Download Report
            </button>
          </div>
        </div>
      </SidebarLayout>
    );
}

export default InterviewReport;