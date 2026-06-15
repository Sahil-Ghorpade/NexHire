function ResumeHistoryDetails({
    item,
}) {
    return (
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
    );
}

export default ResumeHistoryDetails;