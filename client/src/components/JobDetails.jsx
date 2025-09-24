import React from 'react';

function formatDate(dateStr) {
	try {
		return new Date(dateStr).toLocaleDateString();
	} catch {
		return String(dateStr || '');
	}
}

export default function JobDetails({ job }) {
	if (!job) return null;
	return (
		<div className="space-y-4">
			<div>
				<h4 className="text-xl font-semibold text-gray-900">{job.title}</h4>
				<p className="text-gray-600">{job.company} • {job.location}</p>
			</div>
			<div className="grid sm:grid-cols-2 gap-4 text-sm">
				<div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
					<p className="text-gray-500">Posting Date</p>
					<p className="text-gray-900 font-medium">{formatDate(job.posting_date)}</p>
				</div>
				<div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
					<p className="text-gray-500">Job Type</p>
					<p className="text-gray-900 font-medium">{job.job_type}</p>
				</div>
			</div>
			{Array.isArray(job.tags) && job.tags.length > 0 && (
				<div>
					<p className="text-gray-500 text-sm mb-2">Tags</p>
					<div className="flex flex-wrap gap-2">
						{job.tags.map((t, idx) => (
							<span key={idx} className="px-2 py-1 text-xs rounded-full bg-gray-100 border border-gray-200 text-gray-700">{t}</span>
						))}
					</div>
				</div>
			)}
		</div>
	);
} 