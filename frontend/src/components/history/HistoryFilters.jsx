import { Search } from "lucide-react";

function HistoryFilters({
  searchQuery,
  setSearchQuery,
  filter,
  setFilter,
}) {
    return (
        <div className="mb-8 rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Search */}
          <div className="relative w-full md:max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]"
            />

            <input
              type="text"
              placeholder="Search by role..."
              value={
                searchQuery
              }
              onChange={(e) =>
                setSearchQuery(
                  e.target
                    .value
                )
              }
              className="
                w-full
                rounded-lg
                border
                border-[#e2e8f0]
                py-3
                pl-10
                pr-4
                outline-none
                focus:border-[#2563eb]
              "
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {[
              {
                label:
                  "All",
                value:
                  "all",
              },
              {
                label:
                  "Interviews",
                value:
                  "interview",
              },
              {
                label:
                  "Analyses",
                value:
                  "resume",
              },
            ].map(
              (
                option
              ) => (
                <button
                  key={
                    option.value
                  }
                  onClick={() =>
                    setFilter(
                      option.value
                    )
                  }
                  className={`
                    rounded-lg
                    px-4
                    py-2
                    text-sm
                    font-medium
                    transition

                    ${
                      filter ===
                      option.value
                        ? "bg-[#2563eb] text-white"
                        : "border border-[#e2e8f0] bg-white text-[#64748b]"
                    }
                  `}
                >
                  {
                    option.label
                  }
                </button>
              )
            )}
          </div>
        </div>
      </div>
    );
}

export default HistoryFilters;