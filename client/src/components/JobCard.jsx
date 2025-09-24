import React from "react";

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString();
  } catch {
    return String(dateStr || "");
  }
}

export default function JobCard({ job, onEdit, onDelete, onView }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {job.title}
          </h3>
          <p className="text-gray-600 mb-1">
            {job.company} • {job.location}
          </p>
          <p className="text-xs text-gray-500">
            Posted: {formatDate(job.posting_date)} • {job.job_type}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onView?.(job)}
            className="px-3 py-1.5 text-sm rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
          >
            View
          </button>
          <button
            onClick={() => onEdit?.(job)}
            className="px-3 py-1.5 text-sm rounded-md bg-amber-50 text-amber-700 hover:bg-amber-100 transition"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete?.(job)}
            className="px-3 py-1.5 text-sm rounded-md bg-rose-50 text-rose-700 hover:bg-rose-100 transition"
          >
            Delete
          </button>
        </div>
      </div>
      {Array.isArray(job.tags) && job.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {job.tags.map((t, idx) => (
            <span
              key={idx}
              className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
