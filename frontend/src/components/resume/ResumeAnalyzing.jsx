import SidebarLayout from "../../layouts/SidebarLayout";

function ResumeAnalyzing() {
    return (
      <SidebarLayout hideSidebar>
        <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
          <div className="mb-6 h-14 w-14 animate-spin rounded-full border-4 border-[#e2e8f0] border-t-[#2563eb]" />

          <h2 className="text-3xl font-bold text-[#0f172a]">
            Analyzing your
            resume...
          </h2>

          <p className="mt-3 max-w-md text-[#64748b]">
            Our AI is reviewing
            your resume against
            the role
            requirements.
          </p>
        </div>
      </SidebarLayout>
    );
}

export default ResumeAnalyzing;