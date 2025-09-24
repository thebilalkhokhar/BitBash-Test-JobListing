import React from "react";

const JOB_TYPES = ["All", "Full-time", "Part-time", "Contract", "Internship"];
const SORT_OPTIONS = [
  { value: "posting_date_desc", label: "Newest" },
  { value: "posting_date_asc", label: "Oldest" },
  { value: "title_asc", label: "Title A-Z" },
  { value: "title_desc", label: "Title Z-A" },
];

export default function FilterBar({ filters, onChange, onCreate, onFetch }) {
  function handleChange(e) {
    const { name, value } = e.target;
    onChange({ ...filters, [name]: value });
  }

  const inputClass =
    "w-full rounded-md border border-gray-300 bg-white text-gray-900 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition";
  const selectClass = inputClass;
  const btnClass =
    "inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 active:scale-[0.98] transition";
  const ghostBtn =
    "inline-flex items-center rounded-md bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition";

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-3 items-center">
        <input
          className={inputClass}
          name="q"
          placeholder="Search title/company"
          value={filters.q || ""}
          onChange={handleChange}
        />
        <input
          className={inputClass}
          name="location"
          placeholder="Location"
          value={filters.location || ""}
          onChange={handleChange}
        />
        <select
          className={selectClass}
          name="job_type"
          value={filters.job_type || ""}
          onChange={handleChange}
        >
          {JOB_TYPES.map((t) => (
            <option key={t} value={t === "All" ? "" : t}>
              {t}
            </option>
          ))}
        </select>
        <select
          className={selectClass}
          name="sort"
          value={filters.sort || "posting_date_desc"}
          onChange={handleChange}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <button className={ghostBtn} onClick={onFetch}>
          Fetch Latest Jobs
        </button>
        <button className={btnClass} onClick={onCreate}>
          + New Job
        </button>
      </div>
    </div>
  );
}
