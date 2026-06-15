function InterviewHistoryDetails({
    item,
}) {
    return (
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
    );
}

export default InterviewHistoryDetails;