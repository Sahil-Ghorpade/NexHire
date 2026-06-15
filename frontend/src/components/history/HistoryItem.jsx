import {
  Trash2,
  ChevronDown,
  ChevronUp,
  Download,
} from "lucide-react";

import axiosInstance from "../../api/axiosInstance";
import { downloadPDF } from "../../utils/downloadPDF";

import InterviewHistoryDetails from "./InterviewHistoryDetails";
import ResumeHistoryDetails from "./ResumeHistoryDetails";

function HistoryItem({
  item,
  expandedId,
  setExpandedId,
  deletingId,
  setDeletingId,
  confirmDeleteId,
  setConfirmDeleteId,
  setItems,
  items,
  setError,
}) {
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
                      onClick={async () => {
                        try {
                            const safeRole =
                            item.role
                            ?.replace(/\s+/g, "-");
                            
                            const endpoint = item.itemType === "interview"
                                ? `/api/interview/${item._id}/download`
                                : `/api/resume/${item._id}/download`;
                            const filename = item.itemType === "interview"
                                ? `interview-${safeRole}.pdf`
                                : `resume-analysis-${safeRole}.pdf`;
                          await downloadPDF(endpoint, filename);
                        } catch (err) {
                          setError(err.message);
                        }
                      }}
                      className="flex items-center gap-2 rounded-lg border border-[#e2e8f0] px-4 py-2"
                    >
                      <Download size={16} />
                      Download
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
                    <InterviewHistoryDetails
                      item={item}
                    />              
                )}
                
                {/* Expanded Resume */}
                {isExpanded &&
                  item.itemType ===
                    "resume" && (
                    <ResumeHistoryDetails
                      item={item}
                    />
                )}
            </div>
          </div>      
    );
}

export default HistoryItem;