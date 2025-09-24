import React from 'react';

export default function Pagination({ page, totalPages, onPageChange }) {
	const p = Math.max(1, page || 1);
	const tp = Math.max(1, totalPages || 1);
	const canPrev = p > 1;
	const canNext = p < tp;

	function go(delta) {
		const next = p + delta;
		if (next >= 1 && next <= tp) onPageChange(next);
	}

	const btn = "px-3 py-1.5 text-sm rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition";

	return (
		<div className="flex items-center gap-3 mt-6 justify-center">
			<button disabled={!canPrev} onClick={() => go(-1)} className={btn}>Prev</button>
			<span className="text-sm text-gray-700">Page {p} of {tp}</span>
			<button disabled={!canNext} onClick={() => go(1)} className={btn}>Next</button>
		</div>
	);
} 