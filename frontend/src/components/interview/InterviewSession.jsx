import SidebarLayout from "../SidebarLayout";

function InterviewSession (
    {
    questions,
    currentIndex,
    currentAnswer,
    setCurrentAnswer,
    answerError,
    setAnswerError,
    handleSubmitAnswer,
    showSkipConfirm,
    setShowSkipConfirm,
    handleSkipQuestion,
    progress,
    minutes,
    seconds,
    timerColor,
    }) {
    return (
      <SidebarLayout
        hideSidebar
      >
      <div className="mx-auto max-w-5xl p-6">
        <div className="space-y-6">
          <div className="mb-6 rounded-2xl bg-gradient-to-r from-[#2563eb] to-blue-500 p-6 text-white">

            <h2 className="text-2xl font-bold">
              AI Mock Interview
            </h2>

            <p className="mt-2 text-blue-100">
              Answer carefully. Each question has 5 minutes.
            </p>

          </div>  
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
        <div
            className="
            w-full
            rounded-2xl
            border
            border-[#e2e8f0]
            bg-white
            p-8
            shadow-sm
            "
          >
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
            onChange={(e) => {
              setCurrentAnswer(
                e.target.value
              );

              if (answerError) {
                setAnswerError("");
              }
            }}
            placeholder="Type your answer here..."
            className="min-h-[150px] w-full rounded-xl border border-[#e2e8f0] p-4 outline-none focus:border-[#2563eb]"
          />

          {answerError && (
            <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {answerError}
            </div>
          )}

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
              onClick={() =>
                setShowSkipConfirm(true)
              }
              className="
                rounded-xl
                border
                border-[#e2e8f0]
                px-5
                py-3
                font-medium
                text-[#0f172a]
                transition
                hover:bg-slate-50
              "
            >
              Skip Question
            </button>
          </div>
          {showSkipConfirm && (
          <div className="mt-5 rounded-xl border border-orange-200 bg-orange-50 p-4">
            <h3 className="font-medium text-orange-800">
              Skip this question?
            </h3>

            <p className="mt-1 text-sm text-orange-700">
              This question will be marked as skipped and cannot be answered later.
            </p>

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => {
                  setShowSkipConfirm(false);
                  handleSkipQuestion();
                }}
                className="rounded-lg bg-red-600 px-4 py-2 text-white"
              >
                Yes, Skip
              </button>

              <button
                onClick={() =>
                  setShowSkipConfirm(false)
                }
                className="rounded-lg border border-[#e2e8f0] px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        </div>
        </div>
      </div>
      </SidebarLayout>
    );
}

export default InterviewSession;