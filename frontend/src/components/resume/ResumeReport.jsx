import { downloadPDF } from "../../utils/downloadPDF";

import SidebarLayout from "../../layouts/SidebarLayout";

function ResumeReport({
  report,
  navigate,
  resetAnalysis,
  setError,
}) {
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
                    const safeRole =
                        report.role
                        ?.replace(/\s+/g, "-");
                  await downloadPDF(
                    `/api/resume/${report._id}/download`,
                    `resume-${safeRole}.pdf`
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

export default ResumeReport;