import React, { useEffect, useState } from "react";

const initialState = {
  title: "",
  company: "",
  location: "",
  posting_date: "",
  job_type: "Full-time",
  tags: "", // comma-separated in UI
};

export default function JobForm({ initialJob, onCancel, onSubmit }) {
  const [values, setValues] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialJob) {
      setValues({
        title: initialJob.title || "",
        company: initialJob.company || "",
        location: initialJob.location || "",
        posting_date: initialJob.posting_date
          ? String(initialJob.posting_date).slice(0, 10)
          : "",
        job_type: initialJob.job_type || "Full-time",
        tags: Array.isArray(initialJob.tags) ? initialJob.tags.join(", ") : "",
      });
    }
  }, [initialJob]);

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (
      !values.title ||
      !values.company ||
      !values.location ||
      !values.posting_date
    ) {
      alert("Please fill all required fields.");
      return;
    }
    const payload = {
      ...values,
      posting_date: values.posting_date,
      tags: values.tags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    setSubmitting(true);
    try {
      await onSubmit?.(payload);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  }

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass =
    "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const btnPrimary =
    "inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700";
  const btnSecondary =
    "inline-flex items-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200";

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div>
        <label className={labelClass}>Title*</label>
        <input
          className={inputClass}
          name="title"
          value={values.title}
          onChange={handleChange}
          placeholder="e.g., Data Analyst"
        />
      </div>
      <div>
        <label className={labelClass}>Company*</label>
        <input
          className={inputClass}
          name="company"
          value={values.company}
          onChange={handleChange}
          placeholder="e.g., Acme Corp"
        />
      </div>
      <div>
        <label className={labelClass}>Location*</label>
        <input
          className={inputClass}
          name="location"
          value={values.location}
          onChange={handleChange}
          placeholder="e.g., London, UK"
        />
      </div>
      <div>
        <label className={labelClass}>Posting Date*</label>
        <input
          className={inputClass}
          type="date"
          name="posting_date"
          value={values.posting_date}
          onChange={handleChange}
        />
      </div>
      <div>
        <label className={labelClass}>Job Type*</label>
        <select
          className={inputClass}
          name="job_type"
          value={values.job_type}
          onChange={handleChange}
        >
          <option>Full-time</option>
          <option>Part-time</option>
          <option>Contract</option>
          <option>Internship</option>
        </select>
      </div>
      <div>
        <label className={labelClass}>Tags</label>
        <input
          className={inputClass}
          name="tags"
          value={values.tags}
          onChange={handleChange}
          placeholder="Comma separated, e.g., Pricing, Health"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <button type="submit" className={btnPrimary} disabled={submitting}>
          {submitting ? "Saving..." : "Save"}
        </button>
        <button type="button" className={btnSecondary} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
