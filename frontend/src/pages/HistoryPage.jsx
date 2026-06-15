import { useEffect, useState } from "react";

import axiosInstance from "../api/axiosInstance";



import HistoryFilters from "../components/history/HistoryFilters";
import HistoryItem from "../components/history/HistoryItem";

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
      <HistoryFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filter={filter}
        setFilter={setFilter}
      />

      {/* History List */}
      <div className="space-y-4">

        {filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-12 text-center">
            <p className="text-[#64748b]">
              No matching history found.
            </p>
          </div>
          ) : (
          filteredItems.map((item) => (
            <HistoryItem
              key={item._id}
              item={item}
              expandedId={expandedId}
              setExpandedId={setExpandedId}
              deletingId={deletingId}
              setDeletingId={setDeletingId}
              confirmDeleteId={confirmDeleteId}
              setConfirmDeleteId={setConfirmDeleteId}
              setItems={setItems}
              items={items}
              setError={setError}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default HistoryPage;