import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  Brain,
  Star,
  FileText,
  BarChart2,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import axiosInstance from "../api/axiosInstance";

import { useAuth } from "../context/AuthContext";

function DashboardPage() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const [stats, setStats] =
    useState({
      totalInterviews: 0,
      avgInterviewScore: 0,
      totalAnalyses: 0,
      avgAtsScore: 0,
    });

  const [interviews, setInterviews] =
    useState([]);

  const [analyses, setAnalyses] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /**
   * Fetch dashboard data
   */
  useEffect(() => {
    const fetchDashboardData =
      async () => {
        try {
          setLoading(true);
          setError("");

          const [
            statsResponse,
            interviewsResponse,
            analysesResponse,
          ] = await Promise.all([
            axiosInstance.get(
              "/api/user/dashboard"
            ),

            axiosInstance.get(
              "/api/interview"
            ),

            axiosInstance.get(
              "/api/resume"
            ),
          ]);

          setStats(
            statsResponse.data.stats
          );

          setInterviews(
            interviewsResponse.data
              .interviews || []
          );

          setAnalyses(
            analysesResponse.data
              .analyses || []
          );
        } catch (error) {
          console.error(error);

          setError(
            "Failed to load dashboard data."
          );
        } finally {
          setLoading(false);
        }
      };

    fetchDashboardData();
  }, []);

  /**
   * Loading State
   */
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-lg text-[#64748b]">
          Loading dashboard...
        </p>
      </div>
    );
  }

  /**
   * Error State
   */
  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
        {error}
      </div>
    );
  }

  /**
   * Stats Cards
   */
  const statCards = [
    {
      title:
        "Total Interviews",
      value:
        stats.totalInterviews,
      icon: Brain,
      suffix: "",
    },
    {
      title:
        "Avg Interview Score",
      value:
        stats.avgInterviewScore,
      icon: Star,
      suffix: "/10",
    },
    {
      title:
        "Total Analyses",
      value:
        stats.totalAnalyses,
      icon: FileText,
      suffix: "",
    },
    {
      title:
        "Avg ATS Score",
      value:
        stats.avgAtsScore,
      icon: BarChart2,
      suffix: "%",
    },
  ];

  /**
   * Interview Readiness Score
   */
  const readinessScore = Math.round(
    (
      stats.avgAtsScore +
      stats.avgInterviewScore * 10
    ) / 2
  );

  let readinessLevel =
    "Beginner";

  let readinessColor =
    "bg-red-100 text-red-600";

  if (readinessScore >= 80) {
    readinessLevel =
      "Interview Ready";

    readinessColor =
      "bg-green-100 text-green-600";
  } else if (
    readinessScore >= 60
  ) {
    readinessLevel =
      "Intermediate";

    readinessColor =
      "bg-yellow-100 text-yellow-700";
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <section className="rounded-2xl bg-gradient-to-r from-[#2563eb] to-blue-500 p-8 text-white shadow-lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          <div>
            <p className="text-blue-100">
              Welcome back,
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              {user?.name}
            </h1>

            <p className="mt-2 text-blue-100">
              Current Readiness:
              {" "}
              <span className="font-semibold">
                {readinessScore}%
              </span>
            </p>

            <p className="mt-3 max-w-2xl text-blue-100">
              Keep practicing and improve your interview readiness score.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() =>
                navigate("/interview")
              }
              className="rounded-xl bg-white px-5 py-3 font-medium text-[#2563eb]"
            >
              Start Interview
            </button>

            <button
              onClick={() =>
                navigate("/resume")
              }
              className="rounded-xl border border-white/30 px-5 py-3 font-medium"
            >
              Analyze Resume
            </button>
          </div>
        </div>
      </section>

      <section>
        <div className="space-y-3">
          {/* Interview Readiness */}
          <section className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm">
            <div>
              <h2 className="text-lg font-semibold text-[#0f172a]">
                Interview Readiness
              </h2>

              <span
                className={`mt-2 mb-4 inline-flex rounded-full px-3 py-1 text-xs font-medium ${readinessColor}`}
              >
                {readinessLevel}
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-[#2563eb] transition-all duration-500"
                style={{
                  width: `${readinessScore}%`,
                }}
              />
            </div>

            <p className="mt-4 text-sm text-[#64748b]">
              {readinessScore < 50
                ? "Keep practicing. Every interview improves your confidence."
                : readinessScore < 80
                ? "You're making solid progress. Keep pushing forward."
                : "You're looking interview-ready. Maintain the momentum."}
            </p>
          </section>

          {/* Achievement Cards */}
          <section className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-[#e2e8f0] bg-white px-5 py-4 shadow-sm">
              <p className="text-sm text-[#64748b]">
                Best Interview Score
              </p>

              <h3 className="mt-2 text-2xl font-bold text-[#0f172a]">
                {Math.max(
                  ...interviews.map(
                    (i) => i.overallScore
                  ),
                  0
                )}
                /10
              </h3>
            </div>

            <div className="rounded-xl border border-[#e2e8f0] bg-white px-5 py-4 shadow-sm">
              <p className="text-sm text-[#64748b]">
                Best ATS Score
              </p>

              <h3 className="mt-2 text-2xl font-bold text-[#0f172a]">
                {Math.max(
                  ...analyses.map(
                    (a) => a.atsScore
                  ),
                  0
                )}
                %
              </h3>
            </div>

            <div className="rounded-xl border border-[#e2e8f0] bg-white px-5 py-4 shadow-sm">
              <p className="text-sm text-[#64748b]">
                Total Activity
              </p>

              <h3 className="mt-2 text-2xl font-bold text-[#0f172a]">
                {stats.totalInterviews +
                  stats.totalAnalyses}
              </h3>
            </div>
          </section>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {statCards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className="
                  rounded-xl
                  border
                  border-[#e2e8f0]
                  bg-white
                  p-4
                  shadow-sm
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-lg
                  "
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                      <Icon
                        size={22}
                        className="text-[#2563eb]"
                      />
                    </div>
                  </div>

                  <p className="text-sm text-[#64748b]">
                    {card.title}
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-[#0f172a]">
                    {card.value}
                    {card.suffix}
                  </h2>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Charts Data */}
      {(() => {
        const interviewChartData =
          interviews
            .slice(0, 5)
            .reverse()
            .map((interview) => ({
              role: interview.role,
              score:
                interview.overallScore,
            }));

        const atsChartData =
          analyses
            .slice(0, 5)
            .reverse()
            .map((analysis) => ({
              role: analysis.role,
              score:
                analysis.atsScore,
            }));

        return (
          <section className="grid gap-6 lg:grid-cols-2">
            {/* Interview Scores Chart */}
            <div
              className="
              rounded-2xl
              border
              border-[#e2e8f0]
              bg-gradient-to-br
              from-white
              to-slate-50
              p-6
              shadow-sm
              transition-all
              duration-300
              hover:shadow-lg
            "
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                  <Brain
                    size={20}
                    className="text-[#2563eb]"
                  />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-[#0f172a]">
                    Interview Scores
                  </h2>

                  <p className="text-sm font-medium text-[#2563eb]">
                    Current Average:{" "}
                    {
                      stats.avgInterviewScore
                    }
                    /10
                  </p>

                  <p className="text-xs text-[#64748b]">
                    Best Score:{" "}
                    {Math.max(
                      ...interviews.map(
                        (i) =>
                          i.overallScore
                      ),
                      0
                    )}
                    /10
                  </p>

                  <p className="text-sm text-[#64748b]">
                    Last 5 mock
                    interviews
                  </p>
                </div>
              </div>

              {interviewChartData.length ===
              0 ? (
                <div className="flex h-[260px] items-center justify-center">
                  <p className="text-[#64748b]">
                    No interviews yet
                  </p>
                </div>
              ) : (
                <div className="h-[260px]">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <BarChart
                      data={
                        interviewChartData
                      }
                    >
                      <CartesianGrid strokeDasharray="3 3" />

                      <XAxis
                        dataKey="role"
                        tick={{
                          fontSize: 12,
                        }}
                        interval={0}
                        tickFormatter={(
                          value
                        ) =>
                          value.length >
                          12
                            ? `${value.slice(
                                0,
                                12
                              )}...`
                            : value
                        }
                      />

                      <YAxis
                        domain={[
                          0,
                          10,
                        ]}
                      />

                      <Tooltip
                        contentStyle={{
                          borderRadius:
                            "12px",
                          border:
                            "1px solid #e2e8f0",
                          boxShadow:
                            "0 10px 15px rgba(0,0,0,0.05)",
                        }}
                      />

                      <Bar
                        dataKey="score"
                        fill="#2563eb"
                        radius={[
                          6,
                          6,
                          0,
                          0,
                        ]}
                        label={{
                          position:
                            "top",
                          fontSize: 12,
                        }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* ATS Scores Chart */}
            <div
              className="
              rounded-2xl
              border
              border-[#e2e8f0]
              bg-gradient-to-br
              from-white
              to-slate-50
              p-6
              shadow-sm
              transition-all
              duration-300
              hover:shadow-lg
            "
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                  <TrendingUp
                    size={20}
                    className="text-[#2563eb]"
                  />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-[#0f172a]">
                    ATS Scores
                  </h2>

                  <p className="text-sm font-medium text-[#2563eb]">
                    Current Average:{" "}
                    {
                      stats.avgAtsScore
                    }
                    %
                  </p>

                  <p className="text-xs text-[#64748b]">
                    Best Score:{" "}
                    {Math.max(
                      ...analyses.map(
                        (a) =>
                          a.atsScore
                      ),
                      0
                    )}
                    %
                  </p>

                  <p className="text-sm text-[#64748b]">
                    Last 5 resume
                    analyses
                  </p>
                </div>
              </div>

              {atsChartData.length ===
              0 ? (
                <div className="flex h-[260px] items-center justify-center">
                  <p className="text-[#64748b]">
                    No analyses yet
                  </p>
                </div>
              ) : (
                <div className="h-[260px]">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <LineChart
                      data={
                        atsChartData
                      }
                    >
                      <CartesianGrid strokeDasharray="3 3" />

                      <XAxis
                        dataKey="role"
                        tick={{
                          fontSize: 12,
                        }}
                        interval={0}
                        tickFormatter={(
                          value
                        ) =>
                          value.length >
                          12
                            ? `${value.slice(
                                0,
                                12
                              )}...`
                            : value
                        }
                      />

                      <YAxis
                        domain={[
                          0,
                          100,
                        ]}
                      />

                      <Tooltip
                        contentStyle={{
                          borderRadius:
                            "12px",
                          border:
                            "1px solid #e2e8f0",
                          boxShadow:
                            "0 10px 15px rgba(0,0,0,0.05)",
                        }}
                      />

                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#2563eb"
                        strokeWidth={3}
                        dot={{ r: 5 }}
                        activeDot={{
                          r: 7,
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </section>
        );
      })()}

      {/* Recommended Actions */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#0f172a]">
            Recommended Actions
          </h2>

          <p className="mt-2 text-[#64748b]">
            Next steps to improve your interview readiness.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {/* Interview Recommendation */}
          <div
            className="
            rounded-2xl
            border
            border-[#e2e8f0]
            bg-gradient-to-br
            from-white
            to-slate-50
            p-6
            shadow-sm
            transition-all
            duration-300
            hover:-translate-y-1
            hover:border-[#2563eb]
            hover:shadow-lg
          "
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
              <Brain
                size={26}
                className="text-[#2563eb]"
              />
            </div>

            {stats.totalInterviews ===
            0 ? (
              <>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                  Getting Started
                </span>

                <h3 className="mt-4 text-xl font-semibold text-[#0f172a]">
                  Start Your First Mock
                  Interview
                </h3>

                <p className="mt-3 text-[#64748b]">
                  Practice with
                  AI-powered interview
                  questions and receive
                  instant feedback.
                </p>
              </>
            ) : stats.avgInterviewScore <
              5 ? (
              <>
                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-600">
                  Needs Attention
                </span>

                <h3 className="mt-4 text-xl font-semibold text-[#0f172a]">
                  Improve Your Interview
                  Performance
                </h3>

                <p className="mt-3 text-[#64748b]">
                  Your interview scores
                  are below target.
                  More practice can help
                  strengthen your answers
                  and confidence.
                </p>
              </>
            ) : (
              <>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-600">
                  Doing Great
                </span>

                <h3 className="mt-4 text-xl font-semibold text-[#0f172a]">
                  Keep Building Momentum
                </h3>

                <p className="mt-3 text-[#64748b]">
                  Your interview scores
                  are improving. Continue
                  practicing regularly to
                  stay interview-ready.
                </p>
              </>
            )}

            <button
              onClick={() =>
                navigate("/interview")
              }
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#2563eb] px-5 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              Practice Interview

              <ArrowRight size={18} />
            </button>
          </div>

          {/* Resume Recommendation */}
          <div
            className="
            rounded-2xl
            border
            border-[#e2e8f0]
            bg-gradient-to-br
            from-white
            to-slate-50
            p-6
            shadow-sm
            transition-all
            duration-300
            hover:-translate-y-1
            hover:border-[#2563eb]
            hover:shadow-lg
          "
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
              <FileText
                size={26}
                className="text-[#2563eb]"
              />
            </div>

            {stats.totalAnalyses ===
            0 ? (
              <>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                  Getting Started
                </span>

                <h3 className="mt-4 text-xl font-semibold text-[#0f172a]">
                  Analyze Your Resume
                </h3>

                <p className="mt-3 text-[#64748b]">
                  Upload your resume and
                  receive an ATS score,
                  missing skills, and
                  actionable suggestions.
                </p>
              </>
            ) : stats.avgAtsScore <
              60 ? (
              <>
                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-600">
                  Needs Attention
                </span>

                <h3 className="mt-4 text-xl font-semibold text-[#0f172a]">
                  Improve Your ATS Score
                </h3>

                <p className="mt-3 text-[#64748b]">
                  Your resume could be
                  optimized further.
                  Update it using the ATS
                  recommendations and
                  analyze again.
                </p>
              </>
            ) : (
              <>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-600">
                  Doing Great
                </span>

                <h3 className="mt-4 text-xl font-semibold text-[#0f172a]">
                  Strong ATS Performance
                </h3>

                <p className="mt-3 text-[#64748b]">
                  Your resume is performing
                  well. Review missing
                  skills and continue
                  refining it.
                </p>
              </>
            )}

            <button
              onClick={() =>
                navigate("/resume")
              }
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#2563eb] px-5 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              Analyze Resume

              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;