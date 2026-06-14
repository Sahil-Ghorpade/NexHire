import SidebarLayout from "../../components/SidebarLayout";

function InterviewEvaluating() {
  return (
    <SidebarLayout hideSidebar>
      <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center p-6">
        <div className="w-full rounded-3xl border border-[#e2e8f0] bg-white p-12 text-center shadow-sm">

          <div className="mx-auto mb-8 h-16 w-16 animate-spin rounded-full border-4 border-[#e2e8f0] border-t-[#2563eb]" />

          <h2 className="text-4xl font-bold text-[#0f172a]">
            Evaluating Your Interview
          </h2>

          <p className="mt-4 text-lg text-[#64748b]">
            Our AI is reviewing your responses and preparing detailed feedback.
          </p>

          <div className="mt-8 h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-[#2563eb]" />
          </div>

          <p className="mt-4 text-sm text-[#64748b]">
            This usually takes 10–30 seconds.
          </p>

        </div>
      </div>
    </SidebarLayout>
  );
}

export default InterviewEvaluating;